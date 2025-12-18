<script lang="ts">
    const { imageURL, tagname, tagline, url } = $props();
</script>

<a
    href={url}
    class="aspect-3/4 w-[300px] overflow-hidden hover:p-2 cursor-pointer transition-all"
>
    <div
        class="w-full h-full relative overflow-hidden flex flex-col-reverse bg-center bg-cover"
        style="background-image: url('{imageURL}');"
    >
        <div class="z-10 w-full h-full nice-card"></div>
        <div class="flex z-20 text-white items-center p-4 justify-between">
            <div class="flex flex-col">
                <p class="text-xl">{tagname}</p>
                <p>{tagline}</p>
            </div>
            <div class="w-min whitespace-nowrap">
                {"->"}
            </div>
        </div>
    </div>
</a>
