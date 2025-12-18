<script lang="ts">
    import "./layout.css";
    import favicon from "$lib/assets/favicon.svg";
    import { Toaster } from "svelte-french-toast";
    import Navbar from "../components/Navbar.svelte";
    import { onMount } from "svelte";
    import { afterNavigate } from "$app/navigation";
    let { children } = $props();

    function maybeScrollToHash() {
        try {
            const id = location.hash ? location.hash.slice(1) : '';
            if (!id) return;
            const el = document.getElementById(id);
            if (el) {
                // slight delay to allow content to render
                setTimeout(() => el.scrollIntoView({ behavior: 'smooth', block: 'center' }), 50);
            }
        } catch (e) {
            // safe no-op on server or in strange envs
        }
    }

    onMount(() => {
        maybeScrollToHash();
        window.addEventListener('hashchange', maybeScrollToHash);
        afterNavigate(() => maybeScrollToHash());
        return () => window.removeEventListener('hashchange', maybeScrollToHash);
    });
</script>

<Toaster
    position="top-right"
    toastOptions={{
        duration: 3000,
    }}
/>
<svelte:head><link rel="icon" href={favicon} /></svelte:head>

<!-- Global navbar (rendered on every page) -->
<Navbar />

{@render children()} 
