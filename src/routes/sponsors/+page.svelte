<script lang="ts">
  import { getAllSponsors, type Sponsor } from "../../lib/sponsors";
  import SponsorCard from "../../components/SponsorCard.svelte";

  let sponsors = $state<Sponsor[]>([]);

  function load() {
    sponsors = getAllSponsors();
  }

  $effect(load);
</script>

<div class="w-full py-6 bg-amber-400">
  <div class="w-full max-w-7xl mx-auto px-4 flex items-center justify-between">
    <div>
      <p class="text-4xl subtitle">Our Sponsors</p>
      <p class="text-sm text-amber-900 mt-1">Thanks to these partners for supporting OpenShelf</p>
    </div>

    <div>
      <a href="/sponsor" class="py-2 px-4 bg-amber-400 hover:bg-amber-500 text-white whitespace-nowrap rounded-none font-semibold">Sponsor us</a>
    </div>
  </div>
</div>

<div class="w-full flex justify-center py-10 px-4">
  <div class="w-full max-w-7xl grid grid-cols-1 md:grid-cols-2 gap-6">
    {#each sponsors as s (s.id)}
      <div class="w-full bg-white rounded-none border border-gray-100 p-6 flex gap-4 items-start">
        <div class="w-28 h-20 flex items-center justify-center bg-gray-50 border border-gray-100 overflow-hidden">
          {#if s.logo}
            <img src={s.logo} alt={s.name} class="w-full h-full object-contain" />
          {:else}
            <div class="text-sm text-gray-500">No logo</div>
          {/if}
        </div>

        <div class="flex-1">
          <div class="flex items-start justify-between gap-4">
            <div>
              <div class="text-lg font-semibold">{s.name}</div>
              {#if s.message}
                <div class="text-sm text-gray-600 mt-1">{s.message}</div>
              {/if}
            </div>

            <div class="text-right">
              {#if s.website}
                <a href={s.website} target="_blank" rel="noopener" class="text-sm text-amber-700 hover:underline">Visit site</a>
              {/if}
              <div class="text-xs text-gray-400 mt-2">Joined {new Date(s.createdAt).toLocaleDateString()}</div>
            </div>
          </div>
        </div>
      </div>
    {/each}
  </div>
</div>
