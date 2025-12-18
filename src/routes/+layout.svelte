<script lang="ts">
    import "./layout.css";
    import favicon from "$lib/assets/favicon.svg";
    import { Toaster } from "svelte-french-toast";
    import Navbar from "../components/Navbar.svelte";
    let { children } = $props();
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
