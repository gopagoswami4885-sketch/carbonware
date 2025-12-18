<script lang="ts">
  import { buildMailto } from "../lib/mail";
  import { isValidEmail } from "../lib/validators";
  import toast from "svelte-french-toast";

  let name = "";
  let email = "";
  let message = "";

  function reset() {
    name = "";
    email = "";
    message = "";
  }

  function submit() {
    if (!name.trim()) {
      toast.error("Please enter your name");
      return;
    }
    if (!isValidEmail(email)) {
      toast.error("Please enter a valid email address");
      return;
    }
    if (!message.trim()) {
      toast.error("Please enter a short message");
      return;
    }

    const to = "hello@openshelf.example";
    const subject = `OpenShelf contact from ${name.trim()}`;
    const body = `${message.trim()}\n\nFrom: ${name.trim()} <${email.trim()}>`;
    const mailto = buildMailto({ to, subject, body });

    // Open user's mail client
    window.location.href = mailto;

    toast.success("Opening your mail client — thanks for reaching out!");
    reset();
  }
</script>

<section id="contact" class="w-full py-10 bg-white">
  <div class="w-full max-w-7xl mx-auto px-4">
    <div class="w-full bg-white border border-gray-100 p-6 rounded-none grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <h3 class="text-lg font-semibold">Contact Us</h3>
        <p class="text-sm text-gray-500 mt-1">Have feedback or want to sponsor OpenShelf? Drop us a line and we'll get back to you.</p>

        <div class="mt-4">
          <label class="text-xs font-medium text-gray-600">Your name</label>
          <input class="input mt-1" placeholder="Full name" bind:value={name} />

          <label class="text-xs font-medium text-gray-600 mt-3">Email</label>
          <input class="input mt-1" type="email"  placeholder="you@example.com" bind:value={email} aria-invalid={!isValidEmail(email) && email.trim().length > 0} />

          <label class="text-xs font-medium text-gray-600 mt-3">Message</label>
          <textarea class="input mt-1" rows={4} placeholder="How can we help?" bind:value={message}></textarea>

          <div class="flex gap-3 mt-4">
            <button class="btn-primary" on:click={submit}>Send message</button>
            <button class="px-4 py-3 border border-gray-100 text-sm rounded-none" on:click={reset}>Reset</button>
          </div>
        </div>
      </div>

      <div class="text-sm text-gray-500">
        <h4 class="font-semibold">Quick info</h4>
        <p class="mt-2">Email: <a href="mailto:hello@openshelf.example" class="text-amber-600 hover:underline">hello@openshelf.example</a></p>
        <p class="mt-2">We typically respond within 2 business days.</p>

        <div class="mt-6 bg-gray-50 border border-gray-100 p-3 text-xs">
          If your message is about a specific listing, please include the listing id or a link so we can help faster.
        </div>
      </div>
    </div>
  </div>
</section>

<style>
  .input { display:block; width:100%; padding:0.65rem 0.9rem; border:1px solid #eef2f7; background:#fff; transition:box-shadow 120ms ease, border-color 120ms ease; font-size:0.95rem; }
  .input:focus { outline:none; border-color:#f59e0b; box-shadow:0 0 0 6px rgba(245,158,11,0.06); }

  .btn-primary { padding:0.65rem 1.1rem; background:#f59e0b; color:white; border:none; font-weight:600; }
  .btn-primary:hover { background:#d97706; }
</style>