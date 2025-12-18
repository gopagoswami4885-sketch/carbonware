<script lang="ts">
  export let src: string | undefined;
  export let alt: string | undefined = "";

  let errored = false;
  function handleError() {
    errored = true;
  }
</script>

{#if src && !errored}
  <img src={src} alt={alt} on:error={handleError} {...$$restProps} />
{:else}
  <div class="placeholder" aria-hidden="true" {...$$restProps}>
    <svg width="40" height="28" viewBox="0 0 40 28" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <rect width="40" height="28" rx="2" fill="#F8FAFC"/>
      <path d="M6 8h28v2H6z" fill="#E6EEF6"/>
      <path d="M6 16h18v2H6z" fill="#E6EEF6"/>
    </svg>
  </div>
{/if}

<style>
  .placeholder {
    display:flex; align-items:center; justify-content:center; width:100%; height:100%; background:#f8fafc; border:1px solid #f3f4f6; color:#94a3b8;
  }
  img { display:block; width:100%; height:100%; object-fit:contain; }
</style>