<script lang="ts">
    import Navbar from "../../components/Navbar.svelte";
    import Book from "../../components/Book.svelte";
    import { addBook, getAllBooks } from "../../lib/db";
    import type { BookListing } from "../../lib/db";
    import { Mail, MapPin, CheckCircle } from "@lucide/svelte";

    /* ---------- Section 1: Put book for exchange ---------- */
    let imagePreview = $state<string | null>(null);
    let bookName = $state("");
    let bookTitle = $state("");
    let genre = $state("");
    let address = $state("");
    let email = $state("");

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
        reader.onload = () => (imagePreview = reader.result as string);
        reader.readAsDataURL(file);
    }

    async function addExchangeListing() {
        if (!bookName || !bookTitle || !genre || !email) {
            alert("Please fill required fields");
            return;
        }

        const book: BookListing = {
            id: crypto.randomUUID(),
            image: imagePreview,
            bookName,
            bookTitle,
            genre,
            originalPrice: "",
            listingPrice: "",
            exchangeAddress: address,
            exchangeEmail: email,
            isExchange: true,
            createdAt: new Date().toISOString(),
        };

        await addBook(book);

        imagePreview = null;
        bookName = "";
        bookTitle = "";
        genre = "";
        address = "";
        email = "";

        alert("Exchange listing added!");
    }

    /* ---------- Section 2: Exchange with listing ---------- */
    let listings = $state<BookListing[]>([]);
    let selectedBook: BookListing | null = $state(null);
    let messageSent = $state(false);

    async function loadListings() {
        listings = (await getAllBooks()).filter((b) => b.isExchange);
    }

    $effect(() => {
        loadListings();
    });

    function initiateExchange() {
        if (!selectedBook) return;

        const subject = encodeURIComponent(
            `Book Exchange Request: ${selectedBook.bookName}`,
        );

        const body = encodeURIComponent(
            `Hello,\n\nI would like to exchange books with you.\n\n` +
                `Book Offered:\n${bookName || "Not specified"}\n\n` +
                `Exchange Location:\n${address || "To be discussed"}\n\n` +
                `Please let me know if you're interested.\n`,
        );

        window.location.href = `mailto:${selectedBook.exchangeEmail}?subject=${subject}&body=${body}`;
        messageSent = true;
    }
</script>

<div class="w-full flex justify-center">
    <Navbar />
</div>

<div class="w-full flex flex-col items-center gap-16 py-10">
    <!-- SECTION 1: PUT UP FOR EXCHANGE -->
    <section class="w-full max-w-2xl bg-white rounded-3xl shadow-lg p-8">
        <h2 class="text-2xl font-semibold mb-6 text-center">
            Put a Book Up for Exchange 🔄
        </h2>

        <!-- Image uploader -->
        <div class="flex justify-center mb-6">
            <div
                class="w-40 aspect-square rounded-2xl border bg-gray-50 cursor-pointer flex items-center justify-center overflow-hidden"
                onclick={() => fileInput.click()}
            >
                {#if imagePreview}
                    <img
                        src={imagePreview}
                        class="w-full h-full object-cover"
                    />
                {:else}
                    <p class="text-gray-400 text-sm text-center">
                        Click to add cover
                    </p>
                {/if}
            </div>

            <input
                bind:this={fileInput}
                type="file"
                accept="image/*"
                class="hidden"
                onchange={handleImage}
            />
        </div>

        <div class="flex flex-col gap-4">
            <input
                class="input"
                placeholder="Book Name"
                bind:value={bookName}
            />
            <input
                class="input"
                placeholder="Book Title / Edition"
                bind:value={bookTitle}
            />

            <select class="input" bind:value={genre}>
                <option value="" disabled>Select genre</option>
                {#each genres as g}
                    <option value={g}>{g}</option>
                {/each}
            </select>

            <input
                class="input"
                placeholder="Exchange Address"
                bind:value={address}
            />

            <input
                class="input"
                type="email"
                placeholder="Contact Email"
                bind:value={email}
            />

            <button
                class="mt-4 py-3 rounded-xl bg-amber-400 hover:bg-amber-500 font-semibold"
                onclick={addExchangeListing}
            >
                Add Exchange Listing
            </button>
        </div>
    </section>

    <!-- SECTION 2: EXCHANGE WITH EXISTING LISTING -->
    <section class="w-full max-w-[1280px]">
        <h2 class="text-2xl font-semibold mb-6 text-center">
            Available Exchange Listings 📚
        </h2>

        <div class="flex gap-4 flex-wrap justify-center">
            {#each listings as book (book.id)}
                <div
                    class="cursor-pointer"
                    onclick={() => (selectedBook = book)}
                >
                    <Book
                        image={book.image}
                        bookName={book.bookName}
                        originalPrice=""
                        listingPrice=""
                    />
                </div>
            {/each}
        </div>

        {#if selectedBook}
            <div class="mt-8 flex justify-center">
                <button
                    class="flex items-center gap-2 py-3 px-6 rounded-xl bg-green-500 text-white font-semibold"
                    onclick={initiateExchange}
                >
                    <Mail size={18} />
                    Initiate Exchange
                </button>
            </div>
        {/if}
    </section>

    <!-- SECTION 3: NOTICE -->
    {#if messageSent}
        <section class="flex items-center gap-3 text-green-600 text-lg">
            <CheckCircle />
            Exchange request has been notified via email.
        </section>
    {/if}
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
