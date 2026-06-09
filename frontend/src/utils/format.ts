export function formatPrice(amount: string | number, symbol = '₦'): string {
  const num = typeof amount === 'string' ? parseFloat(amount) : amount;
  if (isNaN(num)) return `${symbol}0.00`;
  return `${symbol}${num.toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
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
    full_lace: 'Full Lace',
    glueless: 'Glueless',
    none: 'None',
  };
  return labels[type] || type;
}

export function getLengthLabel(length: string): string {
  return length ? `${length}"` : '';
}
