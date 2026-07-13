import { useCurrencyStore } from '@/store/currencyStore';
import type { DisplayCurrency } from '@/types';

const CURRENCIES: { code: DisplayCurrency; flag: string }[] = [
  { code: 'NGN', flag: '🇳🇬' },
  { code: 'USD', flag: '🇺🇸' },
  { code: 'GBP', flag: '🇬🇧' },
  { code: 'CAD', flag: '🇨🇦' },
];

interface CurrencySelectorProps {
  compact?: boolean;
  variant?: 'dark' | 'light';
}

export default function CurrencySelector({ compact = false, variant = 'dark' }: CurrencySelectorProps) {
  const displayCurrency = useCurrencyStore((s) => s.displayCurrency);
  const setDisplayCurrency = useCurrencyStore((s) => s.setDisplayCurrency);
  const current = CURRENCIES.find((c) => c.code === displayCurrency) ?? CURRENCIES[0];
  const isLight = variant === 'light';

  return (
    <div className="relative">
      <select
        value={displayCurrency}
        onChange={(e) => setDisplayCurrency(e.target.value as DisplayCurrency)}
        aria-label="Display currency"
        className={`appearance-none cursor-pointer rounded-lg border outline-none transition-colors ${
          compact ? 'pl-2 pr-6 py-1 text-xs' : 'pl-2.5 pr-7 py-1.5 text-xs'
        } ${
          isLight
            ? 'border-brand-gray-200 bg-white text-brand-accent hover:border-brand-pink/40 dark:border-white/15 dark:bg-dark-elevated dark:text-gray-200'
            : 'border-white/15 bg-white/10 text-white hover:bg-white/15 focus:border-white/30'
        }`}
      >
        {CURRENCIES.map((currency) => (
          <option key={currency.code} value={currency.code} className="text-brand-black">
            {currency.flag} {currency.code}
          </option>
        ))}
      </select>
      <span
        className={`pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 ${
          compact ? 'text-[10px]' : 'text-xs'
        } ${isLight ? 'text-brand-accent/50' : 'text-white/70'}`}
      >
        ▾
      </span>
      {!compact && (
        <span className="sr-only">
          {current.flag} {current.code}
        </span>
      )}
    </div>
  );
}
