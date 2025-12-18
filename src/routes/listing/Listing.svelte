<script lang="ts">
    import Navbar from "../../components/Navbar.svelte";
    import { addBook } from "../../lib/db";
    import type { BookListing } from "../../lib/db";
    import { ImagePlus } from "@lucide/svelte";

    let imagePreview = $state<string | null>(null);
    let bookName = $state("");
    let bookTitle = $state("");
    let genre = $state("");
    let originalPrice = $state("");
    let listingPrice = $state("");

    let fileInput: HTMLInputElement;

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
        if (!bookName || !bookTitle || !genre || !listingPrice) {
            alert("Please fill all required fields");
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
            createdAt: new Date().toISOString(),
        };

        await addBook(book);

        imagePreview = null;
        bookName = "";
        bookTitle = "";
        genre = "";
        originalPrice = "";
        listingPrice = "";

        alert("Book listed successfully!");
    }
</script>

<div class="w-full flex justify-center py-10">
    <form
        class="w-full max-w-2xl bg-white p-8 rounded-3xl shadow-lg flex flex-col gap-6"
        onsubmit={(e) => {
            e.preventDefault();
            saveBook();
        }}
    >
        <h2 class="text-3xl font-semibold text-center">List a Book 📚</h2>

        <!-- Image uploader -->
        <div class="flex justify-center">
            <div
                class="relative w-44 aspect-square rounded-2xl overflow-hidden border bg-gray-50 cursor-pointer group"
                onclick={() => fileInput.click()}
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
            </div>

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

        <div class="grid grid-cols-2 gap-4">
            <input
                type="number"
                placeholder="Original Price (₹)"
                class="input"
                value={originalPrice}
                oninput={(e) => (originalPrice = e.currentTarget.value)}
            />

            <input
                type="number"
                placeholder="Listing Price (₹)"
                class="input"
                required
                value={listingPrice}
                oninput={(e) => (listingPrice = e.currentTarget.value)}
            />
        </div>

        <button
            type="submit"
            class="mt-4 py-3 rounded-xl bg-amber-400 hover:bg-amber-500 font-semibold transition"
        >
            Save Listing
        </button>
    </form>
</div>

<style>
    .input {
        padding: 0.75rem 1rem;
        border-radius: 0.75rem;
        border: 1px solid #e5e7eb;
        outline: none;
    }

    .input:focus {
        border-color: #f59e0b;
        box-shadow: 0 0 0 2px #fde68a;
    }
</style>
