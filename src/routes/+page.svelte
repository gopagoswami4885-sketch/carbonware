<script lang="ts">
    import "./layout.css";
    import Card from "../components/Card.svelte";
    import Book from "../components/Book.svelte";
    import { getAllBooks, ensureSeedBooks } from "../lib/db";
    import { getTopSponsors, type Sponsor } from "../lib/sponsors";
    import Logo from "../components/Logo.svelte";
    import ContactUs from "../components/ContactUs.svelte";
    import type { BookListing } from "../lib/db";

    let books = $state<BookListing[]>([]);
    let featuredBooks = $state<BookListing[]>([]);

    async function loadBooks() {
        await ensureSeedBooks();
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

    // Load top sponsors
    let topSponsors = $state<Sponsor[]>([]);
    function loadSponsors() {
        topSponsors = getTopSponsors();
    }

    $effect(loadSponsors);
</script>

<!-- Action Cards -->
<div class="w-full flex justify-center">
    <div
        class="w-full max-w-7xl px-4 py-12 flex flex-col items-center md:grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
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
    <div class="w-full max-w-7xl px-4 grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
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

<!-- Sponsors (subtle, footer) -->
<div class="w-full py-10 bg-gray-50">
  <div class="w-full max-w-7xl mx-auto px-4">
    <div class="flex items-center justify-between mb-4">
      <div>
        <h4 class="text-sm font-medium text-gray-700">Our Sponsors</h4>
        <p class="text-xs text-gray-500">Supporters of the OpenShelf community</p>
      </div>

      <div class="flex gap-3">
        <a href="/sponsors" class="text-xs text-amber-700 hover:underline">View all sponsors</a>
        <a href="/sponsor" class="text-xs text-amber-700 hover:underline">Sponsor us</a>
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      {#each topSponsors as s}
        <div>
          <a href={s.website ?? '#'} target="_blank" rel="noopener" class="block">
            <div class="w-full bg-white rounded-none border border-gray-100 p-4 flex items-center gap-4 hover:shadow-sm transition">
              <div class="w-24 h-16 flex items-center justify-center bg-gray-50 border border-gray-100">
                <Logo src={s.logo} alt={s.name} class="w-full h-full object-contain" />
              </div>

              <div class="flex-1">
                <div class="text-sm font-semibold">{s.name}</div>
                {#if s.message}
                  <div class="text-xs text-gray-500">{s.message}</div>
                {/if}
              </div>
            </div>
          </a>
        </div>
      {/each}
    </div>
  </div>
</div>

<!-- Contact -->
<ContactUs />



