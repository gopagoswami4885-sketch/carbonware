<script lang="ts">
  import { addSponsor } from "../../lib/sponsors";
  import toast from "svelte-french-toast";
  import SponsorCard from "../../components/SponsorCard.svelte";
  import Logo from "../../components/Logo.svelte";
  import { tick } from "svelte";

  let name = "";
  let website = "";
  let logo = "";
  let message = "";

  let logoFileInput: HTMLInputElement | null = null;

  function isValidUrl(v: string) {
    try { new URL(v); return true; } catch (_) { return false; }
  }

  $: websiteValid = website.trim() === "" ? true : isValidUrl(website.trim());
  $: logoValid = logo.trim() === "" ? true : isValidUrl(logo.trim()) || logo.startsWith("data:");

  async function handleLogoUpload(e: Event) {
    const input = e.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;
    const file = input.files[0];
    if (!file.type.startsWith("image/")) { toast.error("Please select an image file"); return; }
    const reader = new FileReader();
    reader.onload = () => {
      logo = String(reader.result);
    };
    reader.readAsDataURL(file);
    await tick();
    if (logoFileInput) logoFileInput.value = "";
  }

  function submit() {
    if (!name.trim()) {
      toast.error("Please enter your name or organisation");
      return;
    }
    if (!websiteValid) {
      toast.error("Please enter a valid website URL");
      return;
    }
    if (!logoValid) {
      toast.error("Please provide a valid logo URL or upload an image");
      return;
    }

    addSponsor({ name: name.trim(), website: website.trim() || undefined, logo: logo.trim() || undefined, message: message.trim() || undefined });

    name = "";
    website = "";
    logo = "";
    message = "";

    toast.success("Thanks — your sponsorship is noted!");
  }
</script>

<div class="w-full py-6 bg-amber-400 text-center">
  <p class="text-4xl subtitle">Sponsor OpenShelf</p>
  <p class="text-sm text-amber-900 mt-1">Thank you for supporting our community project</p>
</div>

<div class="w-full flex justify-center py-10 px-4">
  <div class="w-full max-w-4xl bg-white p-8 rounded-none border border-gray-100 grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
    <div class="form-col">
      <h2 class="text-2xl font-semibold mb-2">Become a Sponsor</h2>
      <p class="text-sm text-gray-500 mb-4">Help keep OpenShelf free and thriving — we appreciate your support.</p>

      <label for="s-name" class="text-xs font-medium text-gray-600">Name or Organization <span class="text-rose-500">*</span></label>
      <input id="s-name" class="input mt-1" placeholder="Your name or organisation" bind:value={name} aria-label="Name or organization" aria-required="true" />

      <label for="s-website" class="text-xs font-medium text-gray-600 mt-3">Website (optional)</label>
      <input id="s-website" type="url" inputmode="url" class="input mt-1" placeholder="https://your-site.com" bind:value={website} aria-describedby="site-help" aria-invalid={!websiteValid} />
      <div id="site-help" class="text-xs mt-1">
        {#if website.trim() && !websiteValid}
          <span class="text-rose-500">Please enter a valid URL</span>
        {:else}
          <span class="text-gray-400">Optional — we link your name to this site</span>
        {/if}
      </div>

      <label for="s-logo" class="text-xs font-medium text-gray-600 mt-3">Logo (URL or upload)</label>
      <div class="flex gap-3 mt-1 items-center">
        <input id="s-logo" class="input flex-1" type="url" placeholder="Logo image URL" bind:value={logo} aria-invalid={!logoValid} />

        <label class="upload-button" for="s-logo-file" role="button" aria-hidden="false">
          📁 Upload
          <input id="s-logo-file" type="file" accept="image/*" class="hidden" bind:this={logoFileInput} on:change={handleLogoUpload} />
        </label>

        {#if logo.trim()}
          <button type="button" class="text-xs px-2 py-1 border border-gray-100 rounded-none" on:click={() => (logo='')}>Clear</button>
        {/if}
      </div>

      {#if logo.trim() && !logoValid}
        <div class="text-xs text-rose-500 mt-1">Invalid image URL</div>
      {/if}
      <div class="text-xs text-gray-400 mt-2">Tip: Uploading a logo converts it to a safe data URL for preview.</div>

      <label for="s-message" class="text-xs font-medium text-gray-600 mt-4">Short message (optional)</label>
      <textarea id="s-message" class="input mt-1" placeholder="A short message or tagline" rows={4} bind:value={message} aria-describedby="msg-help"></textarea>
      <div id="msg-help" class="text-xs text-gray-400 mt-2">Keep it short — 200 characters recommended.</div>

      <div class="flex items-center gap-3 mt-5">
        <button type="button" disabled={!name.trim() || !websiteValid || !logoValid} class="btn-primary" on:click={submit} aria-disabled={!name.trim() || !websiteValid || !logoValid}>
          Sponsor — Thank you
        </button>
        <button type="button" class="px-4 py-3 border border-gray-100 text-sm rounded-none" on:click={() => { name=''; website=''; logo=''; message=''; }}>
          Reset
        </button>
      </div>
    </div>

    <div class="preview-col">
      <h3 class="text-sm font-semibold mb-2">Preview</h3>
      <div class="preview-box mb-4">
        <div class="preview-thumb">
          <Logo src={logo} alt={name || 'Sponsor logo'} class="w-full h-full object-contain" />
        </div>

        <div class="flex-1 ml-3">
          <div class="text-sm font-semibold">{name || 'Your name'}</div>
          <div class="text-xs text-gray-500 mt-1">{message || 'Your message will appear here'}</div>
          {#if website}
            <div class="text-xs text-amber-700 mt-2 truncate"><a href={website} target="_blank" rel="noopener" class="hover:underline">{website}</a></div>
          {/if}
        </div>
      </div>

      <div class="text-xs text-gray-500">
        Your sponsor listing appears on our sponsors page and the homepage (top spots are selected automatically).
      </div>
    </div>
  </div>
</div>

<style>
  .form-col { }
  .preview-col { border-left: none; padding-left: 0; }

  /* Make preview sit below the form on small screens */
  @media (min-width: 768px) {
    .preview-col { border-left: 1px solid #f3f4f6; padding-left: 1.5rem; }
  }

  .btn-primary {
    padding: 0.75rem 1.25rem;
    background: #f59e0b;
    color: white;
    border: none;
    font-weight: 600;
    transition: background-color 120ms ease, transform 120ms ease;
  }
  .btn-primary:hover { background: #d97706; }
  .btn-primary:active { transform: translateY(1px); }

  .upload-button {
    display: inline-flex; align-items: center; gap:0.5rem;
    padding: 0.4rem 0.7rem; border: 1px solid #f3f4f6; background:#fff; cursor:pointer; font-size:0.9rem;
  }

  .preview-box { display:flex; gap:1rem; align-items:flex-start; border-radius:0; padding:0.75rem; background:#fff; border:1px solid #f3f4f6; }
  .preview-thumb { width:76px; height:56px; background:#f8fafc; border:1px solid #f3f4f6; display:flex; align-items:center; justify-content:center; }

  /* improve input readability */
  input.input, textarea.input {
    display:block; width:100%; padding:0.65rem 0.9rem; border:1px solid #eef2f7; background:#fff; transition:box-shadow 120ms ease, border-color 120ms ease; font-size:0.95rem;
  }
  input.input:focus, textarea.input:focus { outline:none; border-color:#f59e0b; box-shadow:0 0 0 6px rgba(245,158,11,0.06); }

  .text-xs.truncate a { display:inline-block; max-width:100%; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
</style>
