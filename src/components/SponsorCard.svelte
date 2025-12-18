<script lang="ts">
  import Logo from "./Logo.svelte";
  export let sponsor: any;
</script>

<a href={sponsor.website ?? '#'} target="_blank" rel="noopener" class="block">
  <div class="w-full bg-white rounded-none border border-gray-100 p-4 flex items-center gap-4 hover:shadow-sm transition">
    <div class="w-24 h-16 flex items-center justify-center bg-gray-50 border border-gray-100">
      <Logo src={sponsor.logo} alt={sponsor.name} class="w-full h-full object-contain" />
    </div>

    <div class="flex-1">
      <div class="text-sm font-semibold">{sponsor.name}</div>
      {#if sponsor.message}
        <div class="text-xs text-gray-500">{sponsor.message}</div>
      {/if}
    </div>
  </div>
</a>
