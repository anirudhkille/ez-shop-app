/**
 * Currency and small display helpers.
 *
 * Every screen was formatting money by hand, which is why the app shipped
 * both "₹712", "₹8599.00" and "$7998.00" for the same kind of value. All
 * money now goes through here so there is exactly one format.
 */

/** Groups a number's integer part, e.g. 129900 -> "1,29,900" (Indian grouping). */
function group(intPart: string): string {
  const negative = intPart.startsWith("-");
  const digits = negative ? intPart.slice(1) : intPart;
  if (digits.length <= 3) return (negative ? "-" : "") + digits;

  const last3 = digits.slice(-3);
  const rest = digits.slice(0, -3);
  const grouped = rest.replace(/\B(?=(\d{2})+(?!\d))/g, ",");

  return `${negative ? "-" : ""}${grouped},${last3}`;
}

/**
 * Rupee amount for display. Whole amounts drop the decimals; fractional
 * amounts keep two. Deliberately avoids Intl so it behaves the same on
 * Hermes, JSC and react-native-web.
 */
export function formatPrice(value?: number | null): string {
  const amount = Number(value ?? 0);
  if (!Number.isFinite(amount)) return "\u20B9 0";

  const rounded = Math.round(Math.abs(amount) * 100) / 100;
  const sign = amount < 0 ? "-" : "";
  const whole = Math.floor(rounded);
  const cents = Math.round((rounded - whole) * 100);
  const body = cents > 0 ? `${group(String(whole))}.${String(cents).padStart(2, "0")}` : group(String(whole));

  return `${sign}\u20B9${body}`;
}

/** Whole-percent saving for a discounted product, or null when not on sale. */
export function discountPercent(price?: number, discountPrice?: number): number | null {
  if (!price || !discountPrice || discountPrice >= price) return null;
  return Math.round((1 - discountPrice / price) * 100);
}

/** "12 Oct 2026" - stable across platforms, unlike toLocaleDateString. */
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export function formatDate(value?: string | number | Date | null): string {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return `${date.getDate()} ${MONTHS[date.getMonth()]} ${date.getFullYear()}`;
}

interface AddressLike {
  addressLine1?: string | null;
  addressLine2?: string | null;
  city?: string | null;
  state?: string | null;
  zipCode?: string | null;
  country?: string | null;
}

/**
 * Addresses were assembled inline with fields that do not exist on the model
 * (`street`, `area`), so the joined string started with a stray comma and each
 * screen showed a different pile of lines.
 */
export function formatAddress(address?: AddressLike | null): string {
  if (!address) return "";
  const line1 = [address.addressLine1, address.addressLine2].filter(Boolean).join(", ");
  const line2 = [address.city, address.state].filter(Boolean).join(", ");
  const line3 = [address.zipCode, address.country].filter(Boolean).join(" ");
  return [line1, line2, line3].filter(Boolean).join(", ");
}

/** Roomier two-line variant for detail cards. */
export function formatAddressLines(address?: AddressLike | null): string[] {
  if (!address) return [];
  return [
    [address.addressLine1, address.addressLine2].filter(Boolean).join(", "),
    [address.city, address.state, address.zipCode].filter(Boolean).join(", "),
    address.country ?? "",
  ].filter(Boolean);
}

/** "Men" from "men", leaving already-capitalised words alone. */
export function titleCase(value?: string | null): string {
  if (!value) return "";
  return value
    .split(/[\s-_]+/)
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}
