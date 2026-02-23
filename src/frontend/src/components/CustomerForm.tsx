import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { validateNPWP, validateEmail, validatePhone, validatePositiveNumber } from '@/utils/validation';
import type { Customer } from '../backend';

interface CustomerFormProps {
  customer: Customer | null;
  onSubmit: (customer: Customer) => void;
  onCancel: () => void;
  isSubmitting: boolean;
}

export default function CustomerForm({ customer, onSubmit, onCancel, isSubmitting }: CustomerFormProps) {
  const [formData, setFormData] = useState<Customer>({
    name: '',
    npwp: '',
    address: '',
    contactPerson: '',
    phone: '',
    email: '',
    creditLimit: BigInt(0),
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (customer) {
      setFormData(customer);
    }
  }, [customer]);

  const handleChange = (field: keyof Customer, value: string | bigint) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Nama perusahaan tidak boleh kosong';
    }

    const npwpValidation = validateNPWP(formData.npwp);
    if (!npwpValidation.valid) {
      newErrors.npwp = npwpValidation.message!;
    }

    if (!formData.address.trim()) {
      newErrors.address = 'Alamat tidak boleh kosong';
    }

    if (!formData.contactPerson.trim()) {
      newErrors.contactPerson = 'Kontak person tidak boleh kosong';
    }

    const phoneValidation = validatePhone(formData.phone);
    if (!phoneValidation.valid) {
      newErrors.phone = phoneValidation.message!;
    }

    const emailValidation = validateEmail(formData.email);
    if (!emailValidation.valid) {
      newErrors.email = emailValidation.message!;
    }

    const creditValidation = validatePositiveNumber(Number(formData.creditLimit));
    if (!creditValidation.valid) {
      newErrors.creditLimit = creditValidation.message!;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onSubmit(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Nama Perusahaan *</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => handleChange('name', e.target.value)}
            placeholder="PT. Contoh Perusahaan"
          />
          {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="npwp">NPWP *</Label>
          <Input
            id="npwp"
            value={formData.npwp}
            onChange={(e) => handleChange('npwp', e.target.value)}
            placeholder="01.234.567.8-901.234"
            disabled={!!customer}
          />
          {errors.npwp && <p className="text-sm text-destructive">{errors.npwp}</p>}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="address">Alamat *</Label>
        <Textarea
          id="address"
          value={formData.address}
          onChange={(e) => handleChange('address', e.target.value)}
          placeholder="Jl. Contoh No. 123, Jakarta"
          rows={3}
        />
        {errors.address && <p className="text-sm text-destructive">{errors.address}</p>}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="contactPerson">Kontak Person *</Label>
          <Input
            id="contactPerson"
            value={formData.contactPerson}
            onChange={(e) => handleChange('contactPerson', e.target.value)}
            placeholder="Nama Lengkap"
          />
          {errors.contactPerson && <p className="text-sm text-destructive">{errors.contactPerson}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">Telepon *</Label>
          <Input
            id="phone"
            value={formData.phone}
            onChange={(e) => handleChange('phone', e.target.value)}
            placeholder="08123456789"
          />
          {errors.phone && <p className="text-sm text-destructive">{errors.phone}</p>}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email *</Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => handleChange('email', e.target.value)}
            placeholder="email@perusahaan.com"
          />
          {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="creditLimit">Limit Kredit (IDR) *</Label>
          <Input
            id="creditLimit"
            type="number"
            value={Number(formData.creditLimit)}
            onChange={(e) => handleChange('creditLimit', BigInt(Math.max(0, parseInt(e.target.value) || 0)))}
            placeholder="0"
            min="0"
          />
          {errors.creditLimit && <p className="text-sm text-destructive">{errors.creditLimit}</p>}
        </div>
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
          Batal
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Menyimpan...' : 'Simpan'}
        </Button>
      </div>
    </form>
  );
}
