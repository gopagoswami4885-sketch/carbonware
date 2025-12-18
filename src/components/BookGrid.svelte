<script lang="ts">
    import Book from "./Book.svelte";

    type BookListing = {
        id: string;
        image: string | null;
        bookName: string;
        bookTitle: string;
        genre: string;
        originalPrice?: string;
        listingPrice: string;
        createdAt: string;
    };

    let listings = $state<BookListing[]>([]);

    function loadListings() {
        listings = JSON.parse(localStorage.getItem("bookListings") ?? "[]");
    }

    // Load once when component mounts
    $effect(() => {
        loadListings();
    });
</script>

<div class="w-full max-w-7xl px-4 flex gap-4 md:gap-6 flex-wrap">
    {#if listings.length === 0}
        <p class="text-gray-500 text-center w-full">No books listed yet 📚</p>
    {:else}
        {#each listings as book (book.id)}
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
