<script lang="ts">
    const { image, bookName, bookTitle, genre, originalPrice, listingPrice } =
        $props<{
            image: string | null;
            bookName: string;
            bookTitle: string;
            genre: string;
            originalPrice?: string;
            listingPrice: string;
        }>();
</script>

<div
    class="w-[260px] bg-white rounded-2xl shadow-md hover:shadow-xl transition overflow-hidden"
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
            class="self-start text-xs px-2 py-1 rounded-full bg-amber-100 text-amber-700"
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
