export function formatRate(rate: number | string, sign: string = '$') {
  return `${sign}${Number(rate).toFixed(4)}`;
}
