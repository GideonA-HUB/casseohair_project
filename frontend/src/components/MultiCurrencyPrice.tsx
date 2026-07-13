import type { CurrencySettings } from '@/types';
import { convertNgnToCurrency } from '@/store/currencyStore';
import { formatForeignPrice, formatNgnCompact } from '@/utils/format';

interface MultiCurrencyPriceProps {
  amountNgn: string | number;
  settings: CurrencySettings;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export default function MultiCurrencyPrice({
  amountNgn,
  settings,
  size = 'sm',
  className = '',
}: MultiCurrencyPriceProps) {
  const ngn = typeof amountNgn === 'string' ? parseFloat(amountNgn) : amountNgn;
  const usd = convertNgnToCurrency(ngn, 'USD', settings);
  const gbp = convertNgnToCurrency(ngn, 'GBP', settings);
  const cad = convertNgnToCurrency(ngn, 'CAD', settings);

  const primaryClass =
    size === 'lg'
      ? 'text-2xl font-semibold text-brand-accent dark:text-white'
      : size === 'md'
        ? 'text-lg font-semibold text-brand-accent dark:text-white'
        : 'text-sm font-semibold text-brand-accent dark:text-white';

  const secondaryClass =
    size === 'lg'
      ? 'text-sm text-brand-accent/50 dark:text-gray-400'
      : 'text-xs text-brand-accent/50 dark:text-gray-400';

  return (
    <div className={`space-y-0.5 ${className}`}>
      <p className={primaryClass}>{formatNgnCompact(ngn)}</p>
      <p className={secondaryClass}>{formatForeignPrice(usd, 'USD')}</p>
      <p className={secondaryClass}>{formatForeignPrice(gbp, 'GBP')}</p>
      <p className={secondaryClass}>{formatForeignPrice(cad, 'CAD')}</p>
    </div>
  );
}
