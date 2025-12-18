<script lang="ts">
    import Book from "../../components/Book.svelte";
    import { getAllBooks, ensureSeedBooks } from "../../lib/db";
    import type { BookListing } from "../../lib/db";

    let selectedGenre = $state("All");
    let searchQuery = $state("");
    let sortOrder = $state<"none" | "low" | "high">("none");

    let books = $state<BookListing[]>([]);
    let filteredBooks = $state<BookListing[]>([]);

    const genres = [
        "All",
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

    async function loadBooks() {
        await ensureSeedBooks();
        books = await getAllBooks();
    }

    // load on mount
    $effect(() => {
        loadBooks();
    });

    // filtering + sorting pipeline
    $effect(() => {
        let result = [...books];

        // genre filter
        if (selectedGenre !== "All") {
            result = result.filter((b) => b.genre === selectedGenre);
        }

        // text search
        if (searchQuery.trim()) {
            const q = searchQuery.toLowerCase();
            result = result.filter(
                (b) =>
                    b.bookName.toLowerCase().includes(q) ||
                    b.bookTitle.toLowerCase().includes(q),
            );
        }

        // price sort
        if (sortOrder !== "none") {
            result.sort((a, b) => {
                const pa = Number(a.listingPrice);
                const pb = Number(b.listingPrice);
                return sortOrder === "low" ? pa - pb : pb - pa;
            });
        }

        filteredBooks = result;
    });
</script>

<div class="py-4 flex flex-col items-center gap-8 w-full">
    <!-- Header -->
    <div class="w-full py-6 bg-amber-400 text-center">
        <p class="text-4xl subtitle">Find Books</p>
    </div>

    <!-- Filters -->
    <div
        class="w-full max-w-7xl flex flex-wrap gap-4 items-center justify-between px-2"
    >
        <!-- Search -->
        <input
            type="text"
            placeholder="Search by name or title…"
            class="px-4 py-2 border rounded-none w-full sm:w-65"
            value={searchQuery}
            oninput={(e) => (searchQuery = e.currentTarget.value)}
        />

        <div class="flex gap-3">
            <!-- Genre -->
            <select
                class="px-4 py-2 border rounded-none"
                value={selectedGenre}
                onchange={(e) => (selectedGenre = e.currentTarget.value)}
            >
                {#each genres as g}
                    <option value={g}>{g}</option>
                {/each}
            </select>

            <!-- Sort -->
            <select
                class="px-4 py-2 border rounded-none"
                value={sortOrder}
                onchange={(e) =>
                    (sortOrder = e.currentTarget.value as typeof sortOrder)}
            >
                <option value="none">Sort</option>
                <option value="low">Price ↑</option>
                <option value="high">Price ↓</option>
            </select>
        </div>
    </div>

    <!-- Books -->
    <div class="w-full max-w-7xl flex gap-4 flex-wrap">
        {#if filteredBooks.length === 0}
            <p class="w-full text-center text-gray-500">No books found 📚</p>
        {:else}
            {#each filteredBooks as book (book.id)}
                <Book
                    id={book.id}
                    image={book.image}
                    bookName={book.bookName}
                    bookTitle={book.bookTitle}
                    genre={book.genre}
                    originalPrice={book.originalPrice}
                    listingPrice={book.listingPrice}
                />
            {/each}
        {/if}
    </div>
</div>
