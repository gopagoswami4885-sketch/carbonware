<script lang="ts">
    import toast from "svelte-french-toast";
    import { ImagePlus, Mail, X, Plus } from "@lucide/svelte";
    import { isValidEmail } from "../../lib/validators";
import { buildMailto } from "../../lib/mail";

    /* ===================== UTIL ===================== */
    function clone<T>(v: T): T {
        return JSON.parse(JSON.stringify(v));
    }

    /* ===================== TYPES ===================== */
    type ExchangeListing = {
        id: string;
        image: string | null;
        bookName: string;
        bookTitle: string;
        genre: string;
        exchangeAddress: string;
        exchangeEmail: string;
        createdAt: string;
    };

    /* ===================== INDEXED DB ===================== */
    const DB_NAME = "exchange-db";
    const STORE_NAME = "exchanges";

    function openDB(): Promise<IDBDatabase> {
        return new Promise((resolve, reject) => {
            const req = indexedDB.open(DB_NAME, 1);

            req.onupgradeneeded = () => {
                const db = req.result;
                if (!db.objectStoreNames.contains(STORE_NAME)) {
                    db.createObjectStore(STORE_NAME, { keyPath: "id" });
                }
            };

            req.onsuccess = () => resolve(req.result);
            req.onerror = () => reject(req.error);
        });
    }

    async function addExchange(exchange: ExchangeListing) {
        const db = await openDB();
        return new Promise<void>((resolve, reject) => {
            const tx = db.transaction(STORE_NAME, "readwrite");
            const store = tx.objectStore(STORE_NAME);
            const req = store.add(clone(exchange));
            tx.oncomplete = () => resolve();
            tx.onerror = () => reject(tx.error);
            req.onerror = () => reject(req.error);
        });
    }

    async function getAllExchanges(): Promise<ExchangeListing[]> {
        const db = await openDB();
        const tx = db.transaction(STORE_NAME, "readonly");
        const store = tx.objectStore(STORE_NAME);

        return new Promise((resolve) => {
            const req = store.getAll();
            req.onsuccess = () => resolve(clone(req.result));
        });
    }

    /* ===================== UI STATE ===================== */
    let activeTab = $state<"create" | "view">("create");

    /* ---------- CREATE ---------- */
    let imagePreview = $state<string | null>(null);
    let bookName = $state("");
    let bookTitle = $state("");
    let genre = $state("");
    let customGenre = $state("");
    let useCustomGenre = $state(false);
    let address = $state("");
    let email = $state("");

    let fileInput = $state<HTMLInputElement | null>(null);

    const genres = [
        "Fiction",
        "Non-Fiction",
        "Academic",
        "Science",
        "Technology",
        "Fantasy",
        "Biography",
        "Self-Help",
        "Other",
    ];

    function handleImage(e: Event) {
        const file = (e.target as HTMLInputElement).files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = () => (imagePreview = reader.result as string);
        reader.readAsDataURL(file);
    }

    async function createExchange() {
        const finalGenre = useCustomGenre ? customGenre : genre;

        if (!bookName || !bookTitle || !finalGenre || !email) {
            toast.error("Please fill all required fields");
            return;
        }

        if (!isValidEmail(email)) {
            toast.error("Please provide a valid email address");
            return;
        }

        const exchange: ExchangeListing = {
            id: crypto.randomUUID(),
            image: imagePreview,
            bookName,
            bookTitle,
            genre: finalGenre,
            exchangeAddress: address,
            exchangeEmail: email,
            createdAt: new Date().toISOString(),
        };

        await addExchange(exchange);
        // Refresh the list immediately so users see their new exchange without a full refresh
        await loadExchanges();

        imagePreview = null;
        bookName = "";
        bookTitle = "";
        genre = "";
        customGenre = "";
        useCustomGenre = false;
        address = "";
        email = "";

        toast.success("Exchange listing created 🔄");
    }

    /* ---------- VIEW ---------- */
    let listings = $state<ExchangeListing[]>([]);
    let selectedExchange = $state<ExchangeListing | null>(null);
    let showModal = $state(false);

    async function loadExchanges() {
        listings = await getAllExchanges();
    }

    $effect(() => { if (activeTab === "view") loadExchanges(); });

    function openModal(exchange: ExchangeListing) {
        selectedExchange = clone(exchange);
        showModal = true;
    }

    function initiateExchange() {
        if (!selectedExchange) return;

        const subject = `Book Exchange Request: ${selectedExchange.bookName}`;

        const body = `Hello,\n\n` +
            `I am interested in exchanging books.\n\n` +
            `Book: ${selectedExchange.bookName}\n` +
            `Genre: ${selectedExchange.genre}\n` +
            `Location: ${selectedExchange.exchangeAddress || "To be discussed"}\n\n` +
            `Please let me know if you're interested.\n`;

        window.location.href = buildMailto({ to: selectedExchange.exchangeEmail, subject, body });

        showModal = false;
        toast.success("Email opened in your mail app 📧");
    }
</script>

<!-- ===================== SNIPPET ===================== -->
{#snippet ExchangeCard(exchange: ExchangeListing)}
    <div
        class="w-70 bg-white rounded-none border border-gray-200 hover:border-gray-300 transition cursor-pointer overflow-hidden"
    >
        {#if exchange.image}
            <img
                src={exchange.image}
                alt={exchange.bookName}
                class="w-full aspect-square object-cover"
            />
        {/if}

        <div class="p-4 flex flex-col gap-1">
            <p class="text-lg font-semibold">{exchange.bookName}</p>
            <p class="text-sm text-gray-500">{exchange.bookTitle}</p>
            <span
                class="mt-2 inline-block text-xs px-3 py-1 rounded-none bg-amber-100 text-amber-800 w-fit"
            >
                {exchange.genre}
            </span>
        </div>
    </div>
{/snippet}


<div class="w-full max-w-7xl mx-auto py-10">
    <!-- Tabs -->
    <div class="flex justify-center gap-4 mb-10">
        <button
            class="tab"
            class:active={activeTab === "create"}
            onclick={() => (activeTab = "create")}
        >
            Create Exchange
        </button>
        <button
            class="tab"
            class:active={activeTab === "view"}
            onclick={() => (activeTab = "view")}
        >
            View Exchange Offers
        </button>
    </div>

    <!-- CREATE -->
    {#if activeTab === "create"}
        <section class="max-w-2xl mx-auto bg-white rounded-none border border-gray-200 p-8">
            <h2 class="text-2xl font-semibold text-center mb-6">
                Put a Book Up for Exchange 🔄
            </h2>

            <div class="flex justify-center mb-6">
                <button
                    type="button"
                    class="w-44 aspect-square rounded-none border bg-gray-50 cursor-pointer flex items-center justify-center overflow-hidden"
                    onclick={() => fileInput?.click()}
                >
                    {#if imagePreview}
                        <img
                            src={imagePreview}
                            alt="preview"
                            class="w-full h-full object-cover"
                        />
                    {:else}
                        <ImagePlus size={36} class="text-gray-400" />
                    {/if}
                </button>

                <input
                    bind:this={fileInput}
                    type="file"
                    accept="image/*"
                    class="hidden"
                    onchange={handleImage}
                />
            </div>

            <div class="flex flex-col gap-4">
                <input
                    class="input"
                    placeholder="Book Name"
                    bind:value={bookName}
                />
                <input
                    class="input"
                    placeholder="Book Title / Edition"
                    bind:value={bookTitle}
                />

                {#if !useCustomGenre}
                    <select class="input" bind:value={genre}>
                        <option value="" disabled>Select genre</option>
                        {#each genres as g}<option value={g}>{g}</option>{/each}
                    </select>

                    <button
                        class="text-sm text-amber-700 flex items-center gap-1"
                        onclick={() => (useCustomGenre = true)}
                    >
                        <Plus size={14} /> Add custom genre
                    </button>
                {:else}
                    <input
                        class="input"
                        placeholder="Custom genre"
                        bind:value={customGenre}
                    />
                {/if}

                <input
                    class="input"
                    placeholder="Exchange Address"
                    bind:value={address}
                />
                <input
                    class="input"
                    type="email"
                    placeholder="Contact Email"
                    bind:value={email}
                />

                <button
                    class="mt-4 py-3 rounded-none bg-amber-400 hover:bg-amber-500 font-semibold"
                    onclick={createExchange}
                >
                    Create Exchange Listing
                </button>
            </div>
        </section>
    {/if}

    <!-- VIEW -->
    {#if activeTab === "view"}
        <section class="flex gap-4 flex-wrap justify-center">
            {#each listings as exchange (exchange.id)}
                <button type="button" class="p-0" onclick={() => openModal(exchange)} aria-label={`Open ${exchange.bookName}`}>
                    {@render ExchangeCard(exchange)}
                </button>
            {/each}

            {#if listings.length === 0}
                <p class="text-center text-gray-500 mt-8">
                    No exchange offers yet 📚
                </p>
            {/if}
        </section>
    {/if}

    <!-- MODAL -->
    {#if showModal && selectedExchange}
        <div
            class="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
        >
            <div class="bg-white rounded-none p-6 w-full max-w-md relative">
                <button
                    class="absolute top-4 right-4"
                    onclick={() => (showModal = false)}
                >
                    <X />
                </button>

                <h3 class="text-xl font-semibold mb-4">Initiate Exchange</h3>

                <p><strong>Book:</strong> {selectedExchange.bookName}</p>
                <p><strong>Genre:</strong> {selectedExchange.genre}</p>
                <p>
                    <strong>Location:</strong>
                    {selectedExchange.exchangeAddress}
                </p>

                <button
                    class="mt-6 w-full py-3 rounded-none bg-green-500 text-white font-semibold flex items-center justify-center gap-2"
                    onclick={initiateExchange}
                >
                    <Mail size={18} />
                    Send Exchange Email
                </button>
            </div>
        </div>
    {/if}
</div>

<style>
    .input {
        padding: 0.75rem 1rem;
        border-radius: 0;
        border: 1px solid #f3f4f6;
        background: #ffffff;
        transition: box-shadow 160ms ease, border-color 160ms ease, transform 160ms ease;
    }

    .input:focus {
        outline: none;
        border-color: #f59e0b;
        box-shadow: 0 0 0 6px rgba(245,158,11,0.06);
    }

    .tab {
        padding: 0.75rem 1.5rem;
        border-radius: 0;
        background: #f3f4f6;
        font-weight: 600;
    }

    .tab.active {
        background: #fbbf24;
    }
</style>
