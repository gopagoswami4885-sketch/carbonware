<script lang="ts">
    const { id, image, bookName, bookTitle, genre, originalPrice, listingPrice } =
        $props<{
            id: string;
            image: string | null;
            bookName: string;
            bookTitle: string;
            genre: string;
            originalPrice?: string;
            listingPrice: string;
        }>();
</script>

<a href={`/buy/${id}`} aria-label={`Buy ${bookName}`} class="block">
    <div
        class="w-full sm:w-65 bg-white rounded-none border border-gray-100 hover:border-gray-300 transition-transform duration-200 ease-in-out hover:scale-105 overflow-hidden"
    >
    <div class="aspect-square bg-gray-100">
        <img
            src={image ?? "https://picsum.photos/600/600"}
            alt={bookName}
            class="w-full h-full object-cover"
            loading="lazy"
        />
    </div>

    <div class="p-4 flex flex-col gap-2">
        <p class="text-lg font-semibold leading-tight">
            {bookName}
        </p>

        <p class="text-sm text-gray-500">
            {bookTitle}
        </p>

        <span
            class="self-start text-xs px-2 py-1 rounded-none bg-amber-100 text-amber-700"
        >
            {genre}
        </span>

        <div class="flex items-center gap-2 mt-2">
            {#if originalPrice}
                <span class="text-sm text-gray-400 line-through">
                    ₹{originalPrice}
                </span>
            {/if}
            <span class="text-lg font-bold text-green-700">
                ₹{listingPrice}
            </span>
        </div>
    </div>
    </div>
</a>
