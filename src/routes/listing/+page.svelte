<script lang="ts">
    import Listing from "./Listing.svelte";
</script>

<div
    class="py-4 gap-8 justify-center flex flex-col items-center text-center w-full"
>
    <div class="w-full py-6 bg-amber-400 text-center">
        <p class="text-4xl subtitle">List Books</p>
    </div>
    <br />
    <div class="w-full max-w-7xl">
        <Listing />
    </div>
</div>
