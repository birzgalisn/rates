export function formatDateTime(gmt: string) {
  const iso = gmt.replace(' ', 'T') + 'Z';
  return new Date(iso).toLocaleString('en-US', { timeZone: 'GMT' });
}
