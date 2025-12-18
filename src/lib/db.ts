const DB_NAME = "BookExchangeDB";
const DB_VERSION = 1;
const STORE_NAME = "books";

export type BookListing = {
  id: string;
  image: string | null;
  bookName: string;
  bookTitle: string;
  genre: string;
  originalPrice?: string;
  listingPrice: string;
  email?: string; // contact email of lister
  createdAt: string;
};

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: "id" });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function addBook(book: BookListing): Promise<void> {
  const db = await openDB();
  const tx = db.transaction(STORE_NAME, "readwrite");
  const store = tx.objectStore(STORE_NAME);

  return new Promise((resolve, reject) => {
    const req = store.add(book);
    req.onsuccess = () => resolve();
    req.onerror = () => reject(req.error);
  });
}

export async function updateBook(book: BookListing): Promise<void> {
  const db = await openDB();
  const tx = db.transaction(STORE_NAME, "readwrite");
  const store = tx.objectStore(STORE_NAME);

  return new Promise((resolve, reject) => {
    const req = store.put(book);
    req.onsuccess = () => resolve();
    req.onerror = () => reject(req.error);
  });
}

export async function deleteBook(id: string): Promise<void> {
  const db = await openDB();
  const tx = db.transaction(STORE_NAME, "readwrite");
  const store = tx.objectStore(STORE_NAME);

  return new Promise((resolve, reject) => {
    const req = store.delete(id);
    req.onsuccess = () => resolve();
    req.onerror = () => reject(req.error);
  });
}

export async function getAllBooks(): Promise<BookListing[]> {
  const db = await openDB();
  const tx = db.transaction(STORE_NAME, "readonly");
  const store = tx.objectStore(STORE_NAME);

  return new Promise((resolve) => {
    const req = store.getAll();
    req.onsuccess = () => resolve(req.result);
  });
}

export async function ensureSeedBooks(): Promise<void> {
  const existing = await getAllBooks();
  if (existing && existing.length > 0) return;

  const seeds: BookListing[] = [
    {
      id: crypto.randomUUID(),
      image: "https://covers.openlibrary.org/b/isbn/0141439513-L.jpg",
      bookName: "Pride and Prejudice",
      bookTitle: "Jane Austen",
      genre: "Fiction",
      originalPrice: "499",
      listingPrice: "249",
      email: "bookseller@example.com",
      createdAt: new Date().toISOString(),
    },
    {
      id: crypto.randomUUID(),
      image: "https://covers.openlibrary.org/b/isbn/0451524934-L.jpg",
      bookName: "1984",
      bookTitle: "George Orwell",
      genre: "Fiction",
      originalPrice: "399",
      listingPrice: "199",
      email: "orwellfan@example.com",
      createdAt: new Date().toISOString(),
    },
    {
      id: crypto.randomUUID(),
      image: "https://covers.openlibrary.org/b/isbn/054792822X-L.jpg",
      bookName: "The Hobbit",
      bookTitle: "J.R.R. Tolkien",
      genre: "Fantasy",
      originalPrice: "799",
      listingPrice: "349",
      email: "tolkienlover@example.com",
      createdAt: new Date().toISOString(),
    },
    {
      id: crypto.randomUUID(),
      image: "https://covers.openlibrary.org/b/isbn/0061120081-L.jpg",
      bookName: "To Kill a Mockingbird",
      bookTitle: "Harper Lee",
      genre: "Fiction",
      originalPrice: "599",
      listingPrice: "299",
      email: "mockingbird@example.com",
      createdAt: new Date().toISOString(),
    },
    {
      id: crypto.randomUUID(),
      image: "https://covers.openlibrary.org/b/isbn/0316769487-L.jpg",
      bookName: "The Catcher in the Rye",
      bookTitle: "J.D. Salinger",
      genre: "Fiction",
      originalPrice: "449",
      listingPrice: "219",
      email: "salingerfan@example.com",
      createdAt: new Date().toISOString(),
    },
  ];

  for (const s of seeds) {
    // addBook returns a promise
    await addBook(s);
  }
}

export async function getBookById(id: string): Promise<BookListing | null> {
  const db = await openDB();
  const tx = db.transaction(STORE_NAME, "readonly");
  const store = tx.objectStore(STORE_NAME);

  return new Promise((resolve) => {
    const req = store.get(id);
    req.onsuccess = () => resolve(req.result ?? null);
  });
}
