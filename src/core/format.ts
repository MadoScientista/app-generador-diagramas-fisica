export function formatValue(value: number): string {
  const rounded = Math.round(value * 1000) / 1000;
  const str = rounded.toString();
  if (Number.isInteger(rounded)) {
    return rounded.toString();
  }
  const parts = str.split('.');
  if (parts.length === 2) {
    const trimmed = parts[1].replace(/0+$/, '');
    if (trimmed.length === 0) return parts[0];
    return `${parts[0]}.${trimmed}`;
  }
  return str;
}
