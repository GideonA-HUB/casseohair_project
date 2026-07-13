import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import { siteApi } from '@/api';
import { useCurrencyStore } from '@/store/currencyStore';

export function useCurrencySettings() {
  const setSettings = useCurrencyStore((s) => s.setSettings);
  const settings = useCurrencyStore((s) => s.settings);

  const query = useQuery({
    queryKey: ['currency-settings'],
    queryFn: () => siteApi.currencySettings().then((r) => r.data),
    staleTime: 5 * 60 * 1000,
  });

  useEffect(() => {
    if (query.data) {
      setSettings(query.data);
    }
  }, [query.data, setSettings]);

  return {
    settings: query.data ?? settings,
    isLoading: query.isLoading,
  };
}
