export function formatCurrency(amount: number | bigint): string {
  const num = typeof amount === 'bigint' ? Number(amount) : amount;
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(num);
}

export function formatNumber(value: number | bigint): string {
  const num = typeof value === 'bigint' ? Number(value) : value;
  return new Intl.NumberFormat('id-ID').format(num);
}

export function formatDate(dateString: string): string {
  try {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('id-ID', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    }).format(date);
  } catch {
    return dateString;
  }
}

export function formatNPWP(npwp: string): string {
  // Format: XX.XXX.XXX.X-XXX.XXX
  const cleaned = npwp.replace(/\D/g, '');
  if (cleaned.length !== 15) return npwp;
  
  return `${cleaned.slice(0, 2)}.${cleaned.slice(2, 5)}.${cleaned.slice(5, 8)}.${cleaned.slice(8, 9)}-${cleaned.slice(9, 12)}.${cleaned.slice(12, 15)}`;
}

export function validateNPWP(npwp: string): boolean {
  const cleaned = npwp.replace(/\D/g, '');
  return cleaned.length === 15;
}
