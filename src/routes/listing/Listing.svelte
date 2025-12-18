<script lang="ts">
    import { addBook } from "../../lib/db";
    import type { BookListing } from "../../lib/db";
    import { ImagePlus } from "@lucide/svelte";
    import toast from "svelte-french-toast";
    import { isValidEmail, isValidPrice, priceNotExceed } from "../../lib/validators";

    let imagePreview = $state<string | null>(null);
    let bookName = $state("");
    let bookTitle = $state("");
    let genre = $state("");
    let originalPrice = $state("");
    let listingPrice = $state("");
    let contactEmail = $state("");
    let priceError = $state("");
    let contactEmailError = $state("");

    let fileInput = $state<HTMLInputElement | null>(null);

    function validatePrices() {
        // clear previous error
        priceError = "";

        // only validate when listing price is provided
        if (listingPrice !== "") {
            if (!isValidPrice(listingPrice)) {
                priceError = "Please enter a valid listing price.";
                return;
            }

            if (originalPrice !== "") {
                if (!isValidPrice(originalPrice)) {
                    priceError = "Please enter a valid original price to compare against.";
                    return;
                }

                if (!priceNotExceed(originalPrice, listingPrice)) {
                    priceError = "Listing price must not exceed the original price.";
                    return;
                }
            }
        }
    }

    const genres = [
        "Fiction",
        "Non-Fiction",
        "Academic",
        "Science",
        "Technology",
        "Fantasy",
        "Biography",
        "Self-Help",
        "Other",
    ];

    function handleImage(e: Event) {
        const file = (e.target as HTMLInputElement).files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = () => {
            imagePreview = reader.result as string;
        };
        reader.readAsDataURL(file);
    }

    async function saveBook() {
        // run validation first
        validatePrices();

        if (!bookName || !bookTitle || !genre || !listingPrice || !contactEmail) {
            toast.error("Please fill all required fields");
            return;
        }

        if (contactEmailError) {
            toast.error(contactEmailError);
            return;
        }

        if (priceError) {
            toast.error(priceError);
            return;
        }

        const book: BookListing = {
            id: crypto.randomUUID(),
            image: imagePreview,
            bookName,
            bookTitle,
            genre,
            originalPrice,
            listingPrice,
            email: contactEmail,
            createdAt: new Date().toISOString(),
        };

        try {
            await addBook(book);

            imagePreview = null;
            bookName = "";
            bookTitle = "";
            genre = "";
            originalPrice = "";
            listingPrice = "";
            contactEmail = "";
            priceError = "";

            toast.success("Book listed successfully!");
        } catch (err) {
            console.error('Failed to save book', err);
            toast.error('Failed to save listing. Please try again.');
        }
    }
</script>

<div class="w-full flex justify-center py-10">
    <form
        class="w-full max-w-2xl bg-white p-8 rounded-none border border-gray-200 flex flex-col gap-6"
        onsubmit={(e) => {
            e.preventDefault();
            saveBook();
        }}
    >
        <h2 class="text-3xl font-semibold text-center">List a Book 📚</h2>

        <!-- Image uploader -->
        <div class="flex justify-center">
            <button
                type="button"
                class="relative w-44 aspect-square rounded-none overflow-hidden border bg-gray-50 cursor-pointer group"
                onclick={() => fileInput?.click()}
            >
                {#if imagePreview}
                    <img
                        src={imagePreview}
                        class="w-full h-full object-cover"
                        alt="Book cover"
                    />
                {:else}
                    <div
                        class="w-full h-full flex flex-col items-center justify-center text-gray-400"
                    >
                        <ImagePlus size={36} />
                        <p class="text-sm mt-2">Add cover</p>
                    </div>
                {/if}

                <!-- Hover overlay -->
                <div
                    class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center"
                >
                    <ImagePlus size={32} class="text-white" />
                </div>
            </button>

            <input
                bind:this={fileInput}
                type="file"
                accept="image/*"
                class="hidden"
                onchange={handleImage}
            />
        </div>

        <!-- Inputs -->
        <input
            placeholder="Book Name"
            class="input"
            value={bookName}
            oninput={(e) => (bookName = e.currentTarget.value)}
        />

        <input
            placeholder="Book Title / Edition"
            class="input"
            value={bookTitle}
            oninput={(e) => (bookTitle = e.currentTarget.value)}
        />

        <select
            class="input"
            value={genre}
            onchange={(e) => (genre = e.currentTarget.value)}
        >
            <option value="" disabled>Select genre</option>
            {#each genres as g}
                <option value={g}>{g}</option>
            {/each}
        </select>

        <!-- Contact email above pricing -->
        <input
            type="email"
            placeholder="Contact Email *"
            class="input"
            required
            value={contactEmail}
                aria-invalid={contactEmailError ? "true" : "false"}
                oninput={(e) => {
                    contactEmail = e.currentTarget.value;
                    contactEmailError = isValidEmail(contactEmail) ? "" : "Please enter a valid email address.";
                }}
            />

            {#if contactEmailError}
                <p class="text-red-600 text-sm mt-1">{contactEmailError}</p>
            {/if}

            <input
                type="number"
                placeholder="Original Price (₹) (optional)"
                class="input"
                value={originalPrice}
                oninput={(e) => { originalPrice = e.currentTarget.value; validatePrices(); }}
            />

            <input
                type="number"
                placeholder="Listing Price (₹)"
                class="input"
                required
                value={listingPrice}
                aria-invalid={priceError ? "true" : "false"}
                oninput={(e) => { listingPrice = e.currentTarget.value; validatePrices(); }}
            />

        {#if priceError}
            <p class="text-red-600 text-sm mt-1">{priceError}</p>
        {/if}

        <button
            type="submit"
            class="mt-4 py-3 rounded-none bg-amber-400 hover:bg-amber-500 font-semibold transition"
        >
            Save Listing
        </button>
    </form>
</div>

<style>
    .input {
        padding: 0.75rem 1rem;
        border-radius: 0;
        border: 1px solid #f3f4f6; /* softer */
        background: #ffffff;
        transition: box-shadow 160ms ease, border-color 160ms ease, transform 160ms ease;
    }

    .input:focus {
        outline: none;
        border-color: #f59e0b;
        box-shadow: 0 0 0 6px rgba(245,158,11,0.06); /* subtle amber ring */
    }
</style>
