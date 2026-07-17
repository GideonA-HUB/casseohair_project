export function formatPrice(amount: string | number, symbol = '₦'): string {
  const num = typeof amount === 'string' ? parseFloat(amount) : amount;
  if (isNaN(num)) return `${symbol}0.00`;
  return `${symbol}${num.toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export function formatForeignPrice(amount: number, currency: 'USD' | 'GBP' | 'CAD'): string {
  if (isNaN(amount)) return `${currency} 0.00`;
  return `${currency} ${amount.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

export function formatNgnCompact(amount: string | number): string {
  const num = typeof amount === 'string' ? parseFloat(amount) : amount;
  if (isNaN(num)) return 'NGN 0';
  return `NGN ${num.toLocaleString('en-NG', { maximumFractionDigits: 0 })}`;
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + '...';
}

export function getLaceTypeLabel(type: string): string {
  const labels: Record<string, string> = {
    hd_lace: 'HD Lace',
    transparent_lace: 'Transparent Lace',
    swiss_lace: 'Swiss Lace',
    frontal: 'Frontal',
    closure: 'Closure',
    fringe: 'Fringe',
    full_lace: 'Full Lace',
    glueless: 'Glueless',
    none: 'None',
  };
  return labels[type] || type;
}

export function getLengthLabel(length: string): string {
  return length ? `${length}"` : '';
}

/** Normalize grams for storefront display — always ends with "g" (e.g. 200g). */
export function formatGrams(value: string): string {
  const trimmed = value.trim();
  if (!trimmed) return '';
  // Drop legacy density % suffixes if still stored
  const cleaned = trimmed.replace(/%$/g, '').trim();
  if (/g$/i.test(cleaned)) {
    return `${cleaned.slice(0, -1).trim()}g`;
  }
  return `${cleaned}g`;
}
