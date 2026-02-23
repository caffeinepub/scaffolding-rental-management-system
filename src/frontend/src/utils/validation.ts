export function validateNPWP(npwp: string): { valid: boolean; message?: string } {
  const cleaned = npwp.replace(/\D/g, '');
  
  if (cleaned.length === 0) {
    return { valid: false, message: 'NPWP tidak boleh kosong' };
  }
  
  if (cleaned.length !== 15) {
    return { valid: false, message: 'NPWP harus 15 digit' };
  }
  
  return { valid: true };
}

export function validateEmail(email: string): { valid: boolean; message?: string } {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
  if (!email) {
    return { valid: false, message: 'Email tidak boleh kosong' };
  }
  
  if (!emailRegex.test(email)) {
    return { valid: false, message: 'Format email tidak valid' };
  }
  
  return { valid: true };
}

export function validatePhone(phone: string): { valid: boolean; message?: string } {
  const cleaned = phone.replace(/\D/g, '');
  
  if (cleaned.length === 0) {
    return { valid: false, message: 'Nomor telepon tidak boleh kosong' };
  }
  
  if (cleaned.length < 10 || cleaned.length > 15) {
    return { valid: false, message: 'Nomor telepon harus 10-15 digit' };
  }
  
  return { valid: true };
}

export function validatePositiveNumber(value: number | string): { valid: boolean; message?: string } {
  const num = typeof value === 'string' ? parseFloat(value) : value;
  
  if (isNaN(num)) {
    return { valid: false, message: 'Nilai harus berupa angka' };
  }
  
  if (num < 0) {
    return { valid: false, message: 'Nilai tidak boleh negatif' };
  }
  
  return { valid: true };
}

export function validateDateRange(startDate: string, endDate: string): { valid: boolean; message?: string } {
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  if (isNaN(start.getTime()) || isNaN(end.getTime())) {
    return { valid: false, message: 'Format tanggal tidak valid' };
  }
  
  if (end < start) {
    return { valid: false, message: 'Tanggal akhir harus setelah tanggal mulai' };
  }
  
  return { valid: true };
}
