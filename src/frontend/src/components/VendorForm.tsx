import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { validateNPWP, validateEmail, validatePhone, validatePositiveNumber } from '@/utils/validation';
import type { Vendor } from '../backend';

interface VendorFormProps {
  vendor: Vendor | null;
  onSubmit: (vendor: Vendor) => void;
  onCancel: () => void;
  isSubmitting: boolean;
}

export default function VendorForm({ vendor, onSubmit, onCancel, isSubmitting }: VendorFormProps) {
  const [formData, setFormData] = useState<Vendor>({
    companyName: '',
    npwp: '',
    address: '',
    contactPerson: '',
    phone: '',
    email: '',
    bankAccount: '',
    paymentTerms: BigInt(30),
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (vendor) {
      setFormData(vendor);
    }
  }, [vendor]);

  const handleChange = (field: keyof Vendor, value: string | bigint) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.companyName.trim()) {
      newErrors.companyName = 'Nama perusahaan tidak boleh kosong';
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

    if (!formData.bankAccount.trim()) {
      newErrors.bankAccount = 'Nomor rekening tidak boleh kosong';
    }

    const termsValidation = validatePositiveNumber(Number(formData.paymentTerms));
    if (!termsValidation.valid) {
      newErrors.paymentTerms = termsValidation.message!;
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
          <Label htmlFor="companyName">Nama Perusahaan *</Label>
          <Input
            id="companyName"
            value={formData.companyName}
            onChange={(e) => handleChange('companyName', e.target.value)}
            placeholder="PT. Vendor Scaffolding"
          />
          {errors.companyName && <p className="text-sm text-destructive">{errors.companyName}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="npwp">NPWP *</Label>
          <Input
            id="npwp"
            value={formData.npwp}
            onChange={(e) => handleChange('npwp', e.target.value)}
            placeholder="01.234.567.8-901.234"
            disabled={!!vendor}
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
          placeholder="Jl. Vendor No. 456, Jakarta"
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
            placeholder="email@vendor.com"
          />
          {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="bankAccount">Nomor Rekening *</Label>
          <Input
            id="bankAccount"
            value={formData.bankAccount}
            onChange={(e) => handleChange('bankAccount', e.target.value)}
            placeholder="1234567890"
          />
          {errors.bankAccount && <p className="text-sm text-destructive">{errors.bankAccount}</p>}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="paymentTerms">Termin Pembayaran (hari) *</Label>
        <Input
          id="paymentTerms"
          type="number"
          value={Number(formData.paymentTerms)}
          onChange={(e) => handleChange('paymentTerms', BigInt(Math.max(0, parseInt(e.target.value) || 0)))}
          placeholder="30"
          min="0"
        />
        {errors.paymentTerms && <p className="text-sm text-destructive">{errors.paymentTerms}</p>}
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
