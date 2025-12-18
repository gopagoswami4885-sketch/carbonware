<script lang="ts">
    let menuOpen = false;
</script>

<header class="w-full bg-white">
  <div class="relative w-full max-w-7xl mx-auto h-18 md:h-25 flex items-center justify-between px-4">
    <a href="/" class="flex items-center gap-3 md:gap-4">
      <img src="/logo.jpg" class="h-12 md:h-16 w-auto" alt="OpenShelf logo" />
      <div class="flex flex-col justify-center">
        <p class="text-xl md:text-2xl title">OpenShelf</p>
        <p class="text-xs md:text-sm subtitle">Read. Return. Repeat.</p>
      </div>
    </a>

    <nav class="hidden md:flex items-center gap-6" aria-label="Primary">
      <a href="/search" class="flex items-center gap-2 text-sm font-medium hover:underline" aria-label="Find Books"> <span aria-hidden="true">🔍</span> <span class="ml-1">Find Books</span> </a>
      <a href="/listing" class="flex items-center gap-2 text-sm font-medium hover:underline" aria-label="List Books"> <span aria-hidden="true">➕</span> <span class="ml-1">List Books</span> </a>
      <a href="/exchange" class="flex items-center gap-2 text-sm font-medium hover:underline" aria-label="Exchange Books"> <span aria-hidden="true">🔄</span> <span class="ml-1">Exchange Books</span> </a>
      <a href="/donate" class="flex items-center gap-2 text-sm font-medium hover:underline" aria-label="Donate Books"> <span aria-hidden="true">🎁</span> <span class="ml-1">Donate Books</span> </a>
    </nav>

    <button class="md:hidden p-2 text-2xl" on:click={() => (menuOpen = !menuOpen)} aria-expanded={menuOpen} aria-label="Toggle navigation">{menuOpen ? '✖' : '☰'}</button>

    {#if menuOpen}
      <div class="md:hidden absolute left-4 right-4 top-full mt-2 bg-white border border-gray-100 z-40">
        <div class="flex flex-col py-2">
          <a href="/search" class="px-4 py-3 text-sm font-medium border-b" on:click={() => (menuOpen = false)}>🔍 Find Books</a>
          <a href="/listing" class="px-4 py-3 text-sm font-medium border-b" on:click={() => (menuOpen = false)}>➕ List Books</a>
          <a href="/exchange" class="px-4 py-3 text-sm font-medium border-b" on:click={() => (menuOpen = false)}>🔄 Exchange Books</a>
          <a href="/donate" class="px-4 py-3 text-sm font-medium" on:click={() => (menuOpen = false)}>🎁 Donate Books</a>
        </div>
      </div>
    {/if}
  </div>
</header>
