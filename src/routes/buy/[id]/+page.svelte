<script lang="ts">
  import { onMount } from "svelte";
  import { page } from "$app/stores";
  import { getBookById } from "../../../lib/db";
  import { buildMailto } from "../../../lib/mail";

  let book: any = null;
  let loading = true;

  $: id = $page.params.id;

  onMount(async () => {
    loading = true;
    book = await getBookById(id as string);
    loading = false;
  });

  function mailtoLink() {
    if (!book?.email) return "mailto:";
    const subject = `Interest in: ${book.bookName}`;
    const body = `Hello,\n\nI am interested in purchasing your book:\n\nTitle: ${book.bookTitle}\nListing price: ${book.listingPrice}\n\nPlease let me know if it's still available and how to proceed.\n`;
    return buildMailto({ to: book.email, subject, body });
  }
</script>

{#if loading}
  <div class="w-full flex justify-center py-10">
    <p>Loading…</p>
  </div>
{:else}
  {#if !book}
    <div class="w-full flex justify-center py-10">
      <p>Book not found.</p>
    </div>
  {:else}
    <div class="w-full flex justify-center py-10 px-4">
      <div class="w-full max-w-275 grid grid-cols-1 md:grid-cols-3 gap-6 pb-24 md:pb-0">
        <!-- Image -->
        <div class="md:col-span-1 flex items-start">
          <div class="w-full bg-gray-50 p-6 flex items-center justify-center border border-gray-100">
            {#if book.image}
              <img src={book.image} alt={book.bookName} class="w-full h-auto max-h-130 object-contain" />
            {:else}
              <div class="w-full h-64 flex items-center justify-center text-gray-400">No image</div>
            {/if}
          </div>
        </div>

        <!-- Details -->
        <div class="md:col-span-1 flex flex-col">
          <nav class="text-sm text-gray-500 mb-3"> <a href="/">Home</a> / <a href="/search">Find Books</a> / <span class="text-amber-900">{book.bookName}</span> </nav>

          <h1 class="text-2xl md:text-3xl font-semibold mb-1">{book.bookName}</h1>
          <p class="text-sm text-gray-600 mb-3">{book.bookTitle}</p>

          <div class="flex items-center gap-3 mb-4">
            <span class="text-xs px-2 py-1 bg-amber-100 text-amber-800 rounded-none">{book.genre}</span>
            <span class="text-sm text-gray-500">Listed on {new Date(book.createdAt).toLocaleDateString()}</span>
          </div>

          <div class="border-t pt-4 text-sm text-gray-700">
            <h3 class="font-medium mb-2">Description</h3>
            <p class="mb-2">This listing was posted by a community member — contact them to enquire about availability and pickup/delivery details.</p>
            <p class="mb-1">Title: {book.bookTitle}</p>
            <p class="mb-1">Genre: {book.genre}</p>
          </div>
        </div>

        <!-- Purchase card -->
        <aside class="md:col-span-1 flex flex-col gap-4">
          <div class="w-full bg-white p-6 border border-gray-100">
            <div class="flex items-baseline gap-3 mb-4">
              {#if book.originalPrice}
                <div class="text-sm text-gray-400 line-through">₹{book.originalPrice}</div>
              {/if}
              <div class="text-3xl md:text-2xl font-extrabold text-green-700">₹{book.listingPrice}</div>
            </div>

            <div class="flex flex-col gap-3">
              <a href={mailtoLink()} class="w-full text-center py-4 bg-amber-500 hover:bg-amber-600 text-white font-semibold transition-colors">Contact Seller</a>

              {#if book.email}
                <div class="text-sm text-gray-600 text-center">Seller: <a href={buildMailto({ to: book.email })} class="underline">{book.email}</a></div>
              {:else}
                <div class="text-sm text-gray-600 text-center">Seller email not provided</div>
              {/if}

              <div class="mt-2 text-xs text-gray-500">You will be redirected to your email client with a pre-filled message.</div>
            </div>
          </div>

          <div class="w-full bg-white p-6 border border-gray-100 text-sm text-gray-700">
            <h4 class="font-medium mb-2">Pickup & Delivery</h4>
            <p class="mb-1">Local pickup or buyer-arranged shipping. Confirm details with the seller.</p>
            <p class="font-medium mt-2">Safe purchase tips</p>
            <ul class="list-disc ml-4 mt-1">
              <li>Meet in a public place</li>
              <li>Confirm the book condition before payment</li>
            </ul>
          </div>
        </aside>
      </div>

      <!-- Mobile sticky CTA -->
      <div class="md:hidden fixed left-0 right-0 bottom-0 bg-white p-3 border-t border-gray-100 flex items-center justify-between gap-3">
        <div>
          <div class="text-sm text-gray-500">Total</div>
          <div class="text-lg font-bold text-green-700">₹{book.listingPrice}</div>
        </div>
        <a href={mailtoLink()} class="flex-1 text-center py-3 bg-amber-500 hover:bg-amber-600 text-white font-semibold">Contact Seller</a>
      </div>

    </div>
  {/if}
{/if}
