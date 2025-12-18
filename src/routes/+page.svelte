<script lang="ts">
    import "./layout.css";
    import Card from "../components/Card.svelte";
    import Book from "../components/Book.svelte";
    import { getAllBooks } from "../lib/db";
    import type { BookListing } from "../lib/db";

    let books = $state<BookListing[]>([]);
    let featuredBooks = $state<BookListing[]>([]);

    async function loadBooks() {
        books = await getAllBooks();

        // show latest 8 books on home
        featuredBooks = [...books]
            .sort(
                (a, b) =>
                    new Date(b.createdAt).getTime() -
                    new Date(a.createdAt).getTime(),
            )
            .slice(0, 8);
    }

    $effect(() => {
        loadBooks();
    });
</script>

<!-- Action Cards -->
<div class="w-full flex justify-center">
    <div
        class="w-full max-w-7xl px-4 py-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
    >
        <Card
            url="search"
            imageURL="/search_books.jpg"
            tagname="Find Books"
            tagline="Discover your next great adventure."
        />
        <Card
            url="listing"
            imageURL="/listing.jpg"
            tagname="List Books"
            tagline="Give your pre-loved books a new home."
        />
        <Card
            url="exchange"
            imageURL="/exchange.jpg"
            tagname="Exchange Books"
            tagline="Swap stories with readers near you."
        />
        <Card
            url="donate"
            imageURL="/donate_books.jpg"
            tagname="Donate Books"
            tagline="Pass the magic of reading forward."
        />
    </div>
</div>

<!-- Shelf Header -->
<div class="w-full py-6 bg-amber-400 text-center px-4">
    <p class="text-2xl sm:text-4xl subtitle">Open Shelf Store</p>
    <p class="text-sm text-amber-900 mt-1">Recently added by the community</p>
</div>

<!-- Featured Books -->
<div class="w-full flex justify-center py-16">
    <div class="w-full max-w-7xl px-4 flex gap-4 md:gap-6 flex-wrap justify-center">
        {#if featuredBooks.length === 0}
            <p class="text-gray-500 text-center w-full">
                No books listed yet 📚
            </p>
        {:else}
            {#each featuredBooks as book (book.id)}
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
