export type Sponsor = {
  id: string;
  name: string;
  website?: string;
  logo?: string;
  message?: string;
  createdAt: string;
};

const STORAGE_KEY = "carbonware:sponsors";

function seedIfEmpty() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (raw) return;

  const seeds: Sponsor[] = [
    {
      id: crypto.randomUUID(),
      name: "GitHub",
      website: "https://github.com",
      logo: "https://picsum.photos/seed/github/300/200",
      message: "Supporting community-driven projects",
      createdAt: new Date().toISOString(),
    },
    {
      id: crypto.randomUUID(),
      name: "Vercel",
      website: "https://vercel.com",
      logo: "https://picsum.photos/seed/vercel/300/200",
      message: "Empowering fast, modern web apps",
      createdAt: new Date().toISOString(),
    },
    {
      id: crypto.randomUUID(),
      name: "Supabase",
      website: "https://supabase.com",
      logo: "https://picsum.photos/seed/supabase/300/200",
      message: "Open-source data layer for developers",
      createdAt: new Date().toISOString(),
    },
  ];

  localStorage.setItem(STORAGE_KEY, JSON.stringify(seeds));
}

export function getAllSponsors(): Sponsor[] {
  seedIfEmpty();
  const raw = localStorage.getItem(STORAGE_KEY) ?? "[]";
  try {
    return JSON.parse(raw) as Sponsor[];
  } catch (e) {
    return [];
  }
}

export function getTopSponsors(limit = 3): Sponsor[] {
  const all = getAllSponsors();
  return all
    .slice()
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, limit);
}

export function addSponsor(s: Omit<Sponsor, "id" | "createdAt">) {
  const all = getAllSponsors();
  const sponsor: Sponsor = {
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    ...s,
  };
  all.unshift(sponsor);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
  return sponsor;
}
