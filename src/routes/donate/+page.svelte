<script lang="ts">
    import Navbar from "../../components/Navbar.svelte";
    import toast from "svelte-french-toast";
    import { Plus, Trash2, Gift, Mail, X } from "@lucide/svelte";

    /* ===================== UTIL ===================== */

    function clone<T>(data: T): T {
        return JSON.parse(JSON.stringify(data));
    }

    /* ===================== TYPES ===================== */

    type DonationListing = {
        id: string;
        donorName: string;
        requestedBooks: string[];
        address: string;
        email: string;
        createdAt: string;
    };

    /* ===================== INDEXED DB (DONATION ONLY) ===================== */

    const DB_NAME = "donation-db";
    const STORE = "donations";

    function openDB(): Promise<IDBDatabase> {
        return new Promise((resolve, reject) => {
            const req = indexedDB.open(DB_NAME, 1);

            req.onupgradeneeded = () => {
                const db = req.result;
                if (!db.objectStoreNames.contains(STORE)) {
                    db.createObjectStore(STORE, { keyPath: "id" });
                }
            };

            req.onsuccess = () => resolve(req.result);
            req.onerror = () => reject(req.error);
        });
    }

    async function addDonation(donation: DonationListing) {
        const db = await openDB();
        const tx = db.transaction(STORE, "readwrite");
        tx.objectStore(STORE).add(clone(donation));
        return tx.complete;
    }

    async function getDonations(): Promise<DonationListing[]> {
        const db = await openDB();
        const tx = db.transaction(STORE, "readonly");
        const store = tx.objectStore(STORE);

        return new Promise((resolve) => {
            const req = store.getAll();
            req.onsuccess = () => resolve(clone(req.result));
        });
    }

    /* ===================== UI STATE ===================== */

    let activeTab = $state<"create" | "honour">("create");

    /* ---------- CREATE ---------- */
    let donorName = $state("");
    let email = $state("");
    let address = $state("");
    let requestedBooks = $state<string[]>([]);
    let bookInput = $state("");

    function addBook() {
        if (!bookInput.trim()) return;
        requestedBooks = [...requestedBooks, bookInput.trim()];
        bookInput = "";
    }

    function removeBook(index: number) {
        requestedBooks = requestedBooks.filter((_, i) => i !== index);
    }

    async function submitDonation() {
        if (!donorName || !email || requestedBooks.length === 0) {
            toast.error("Please complete required fields");
            return;
        }

        const donation: DonationListing = {
            id: crypto.randomUUID(),
            donorName,
            requestedBooks,
            address,
            email,
            createdAt: new Date().toISOString(),
        };

        await addDonation(donation);

        donorName = "";
        email = "";
        address = "";
        requestedBooks = [];
        bookInput = "";

        toast.success("Donation request listed 🎁");
    }

    /* ---------- HONOUR ---------- */
    let donations = $state<DonationListing[]>([]);
    let selectedDonation = $state<DonationListing | null>(null);
    let showModal = $state(false);

    async function loadDonations() {
        donations = clone(await getDonations());
    }

    $effect(() => {
        loadDonations();
    });

    function openModal(donation: DonationListing) {
        selectedDonation = clone(donation);
        showModal = true;
    }

    function honourDonation() {
        if (!selectedDonation) return;

        const subject = encodeURIComponent(
            "Honouring your book donation request",
        );

        const body = encodeURIComponent(
            `Hello ${selectedDonation.donorName},\n\n` +
                `I would like to honour your donation request.\n\n` +
                `Requested books:\n` +
                selectedDonation.requestedBooks
                    .map((b) => `• ${b}`)
                    .join("\n") +
                `\n\nPlease let me know how to proceed.\n`,
        );

        window.location.href = `mailto:${selectedDonation.email}?subject=${subject}&body=${body}`;

        showModal = false;
        toast.success("Email opened in mail client 📧");
    }
</script>

<div class="w-full flex justify-center">
    <Navbar />
</div>

<div class="w-full max-w-[1280px] mx-auto py-10">
    <!-- Tabs -->
    <div class="flex justify-center gap-4 mb-10">
        <button
            class="tab"
            class:active={activeTab === "create"}
            onclick={() => (activeTab = "create")}
        >
            List for Donation
        </button>
        <button
            class="tab"
            class:active={activeTab === "honour"}
            onclick={() => (activeTab = "honour")}
        >
            Honour Donation
        </button>
    </div>

    <!-- CREATE TAB -->
    {#if activeTab === "create"}
        <section class="max-w-2xl mx-auto bg-white p-8 rounded-3xl shadow-lg">
            <h2 class="text-2xl font-semibold text-center mb-6">
                Request Books for Donation 🎁
            </h2>

            <div class="flex flex-col gap-4">
                <input
                    class="input"
                    placeholder="Your Name *"
                    bind:value={donorName}
                />
                <input
                    class="input"
                    type="email"
                    placeholder="Email *"
                    bind:value={email}
                />
                <input
                    class="input"
                    placeholder="Address (optional)"
                    bind:value={address}
                />

                <div class="flex gap-2">
                    <input
                        class="input flex-1"
                        placeholder="Book you need"
                        bind:value={bookInput}
                        onkeydown={(e) => e.key === "Enter" && addBook()}
                    />
                    <button class="icon-btn" onclick={addBook}>
                        <Plus />
                    </button>
                </div>

                {#if requestedBooks.length}
                    <ul class="space-y-2">
                        {#each requestedBooks as book, i}
                            <li
                                class="flex justify-between items-center bg-gray-100 px-4 py-2 rounded-xl"
                            >
                                {book}
                                <button onclick={() => removeBook(i)}>
                                    <Trash2 size={16} />
                                </button>
                            </li>
                        {/each}
                    </ul>
                {/if}

                <button
                    class="mt-6 py-3 rounded-xl bg-amber-400 hover:bg-amber-500 font-semibold"
                    onclick={submitDonation}
                >
                    Submit Donation Request
                </button>
            </div>
        </section>
    {/if}

    <!-- HONOUR TAB -->
    {#if activeTab === "honour"}
        <section>
            <div class="flex flex-wrap gap-12 justify-center">
                {#each donations as donation (donation.id)}
                    <div
                        class="w-72 bg-zinc-100 p-5 rounded-2xl shadow cursor-pointer hover:shadow-lg"
                        onclick={() => openModal(donation)}
                    >
                        <Gift class="text-amber-500 mb-3" />
                        <h3 class="font-semibold">{donation.donorName}</h3>
                        <p class="text-sm text-gray-500">
                            Needs {donation.requestedBooks.length} book(s)
                        </p>
                    </div>
                {/each}
            </div>

            {#if donations.length === 0}
                <p class="text-center text-gray-500 mt-8">
                    No donation requests yet 🤍
                </p>
            {/if}
        </section>
    {/if}

    <!-- MODAL -->
    {#if showModal && selectedDonation}
        <div
            class="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
        >
            <div class="bg-white w-full max-w-md rounded-2xl p-6 relative">
                <button
                    class="absolute top-4 right-4"
                    onclick={() => (showModal = false)}
                >
                    <X />
                </button>

                <h3 class="text-xl font-semibold mb-4">Honour Donation</h3>

                <p class="font-medium mb-2">Requested Books:</p>
                <ul class="list-disc ml-5 mb-4">
                    {#each selectedDonation.requestedBooks as book}
                        <li>{book}</li>
                    {/each}
                </ul>

                <button
                    class="w-full py-3 bg-green-500 text-white rounded-xl font-semibold flex items-center justify-center gap-2"
                    onclick={honourDonation}
                >
                    <Mail size={18} />
                    Send Email
                </button>
            </div>
        </div>
    {/if}
</div>

<style>
    .input {
        padding: 0.75rem 1rem;
        border-radius: 0.75rem;
        border: 1px solid #e5e7eb;
    }

    .input:focus {
        outline: none;
        border-color: #f59e0b;
        box-shadow: 0 0 0 2px #fde68a;
    }

    .tab {
        padding: 0.75rem 1.5rem;
        border-radius: 999px;
        background: #f3f4f6;
        font-weight: 600;
    }

    .tab.active {
        background: #fbbf24;
    }

    .icon-btn {
        padding: 0.75rem;
        border-radius: 0.75rem;
        background: #f3f4f6;
    }
</style>
