'use client';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@repo/ui/components/ui/select';

import { useRatesSelect } from '~/app/hooks/use-rates-select';

export function RatesSelect() {
  const { rate, handleRateChange } = useRatesSelect();

  return (
    <Select onValueChange={handleRateChange}>
      <SelectTrigger className="ml-1 w-32">
        <SelectValue placeholder={rate} />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="usd">USD</SelectItem>
        <SelectItem value="aud">AUD</SelectItem>
        <SelectItem value="gbp">GBP</SelectItem>
      </SelectContent>
    </Select>
  );
}
