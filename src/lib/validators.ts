// Reusable validation utilities for the app

export function isNonEmptyString(v: unknown): v is string {
  return typeof v === "string" && v.trim().length > 0;
}

export function isValidEmail(email: string): boolean {
  if (!isNonEmptyString(email)) return false;
  // Simple but practical RFC-like email regex (not fully RFC compliant but sufficient here)
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email.trim());
}

export function isValidPrice(value: string): boolean {
  if (!isNonEmptyString(value)) return false;
  const n = Number(value);
  return !isNaN(n) && isFinite(n) && n >= 0;
}

/**
 * Returns true if listingPrice does not exceed originalPrice.
 * If originalPrice is empty (seller didn't provide), treat as valid.
 */
export function priceNotExceed(originalPrice: string, listingPrice: string): boolean {
  if (!isNonEmptyString(listingPrice)) return false; // listing required elsewhere
  if (!isNonEmptyString(originalPrice)) return true; // nothing to compare against

  if (!isValidPrice(originalPrice) || !isValidPrice(listingPrice)) return false;

  const op = Number(originalPrice);
  const lp = Number(listingPrice);
  return lp <= op;
}
