# Carbonware — OpenShelf

**Hackathon project**: A lightweight, community-first book listing platform for college students to share, list, donate and exchange books — reducing book waste and making textbooks accessible.

## Team
- **Mayukh Chakraborty** (Leader)
- **Biswajit Ray** (Member)
- **Saptarshi Ray** (Member)

## What it does
OpenShelf lets students:
- List books for sale with price and contact info
- Browse and search listings by title, author, genre and price
- Exchange books with other students
- Request donations and offer books for donation
- Contact listers via a simple mail flow

The app is built with SvelteKit and uses IndexedDB (client-side) for storage and offline support. For the hackathon MVP we keep data in the browser.

## Quickstart (required)
To run the project locally:

1. Install dependencies (the project currently uses a few dev-time peer deps — use force to ensure a clean install):

```sh
npm install --force
```

2. Start the dev server:

```sh
npm run dev
```

3. Open `http://localhost:5173` (Vite default) in your browser.

> On first run the app will seed the local IndexedDB with 5 sample books (only if your IndexedDB store is empty) so you can explore the UI immediately.

## Development notes
- UI: SvelteKit + Tailwind-like utility classes (project uses utility tokens). See `src/routes` and `src/components` for pages and components.
- Data: IndexedDB helpers live in `src/lib/db.ts`. Validation helpers are in `src/lib/validators.ts`.
- Mail helper: `src/lib/mail.ts` centralizes mailto creation.
- Global layout & styles: `src/routes/+layout.svelte` and `src/routes/layout.css`.

---

Thanks for checking out Carbonware — enjoy exploring the app!
