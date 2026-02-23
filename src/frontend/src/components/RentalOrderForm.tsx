import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useGetCustomers, useGetInventoryItems } from '@/hooks/useQueries';
import { validateDateRange } from '@/utils/validation';
import { RentalOrderStatus } from '../backend';
import type { RentalOrder } from '../backend';
import { Checkbox } from '@/components/ui/checkbox';

interface RentalOrderFormProps {
  order: RentalOrder | null;
  onSubmit: (order: RentalOrder) => void;
  onCancel: () => void;
  isSubmitting: boolean;
}

export default function RentalOrderForm({ order, onSubmit, onCancel, isSubmitting }: RentalOrderFormProps) {
  const { data: customers } = useGetCustomers();
  const { data: inventory } = useGetInventoryItems();

  const [formData, setFormData] = useState<RentalOrder>({
    orderId: '',
    customerId: '',
    itemIds: [],
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0],
    status: RentalOrderStatus.Booked,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (order) {
      setFormData(order);
    }
  }, [order]);

  const handleChange = (field: keyof RentalOrder, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  const handleItemToggle = (itemId: string, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      itemIds: checked
        ? [...prev.itemIds, itemId]
        : prev.itemIds.filter((id) => id !== itemId),
    }));
    setErrors((prev) => ({ ...prev, itemIds: '' }));
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.orderId.trim()) {
      newErrors.orderId = 'ID pesanan tidak boleh kosong';
    }

    if (!formData.customerId) {
      newErrors.customerId = 'Pelanggan harus dipilih';
    }

    if (formData.itemIds.length === 0) {
      newErrors.itemIds = 'Minimal satu item harus dipilih';
    }

    const dateValidation = validateDateRange(formData.startDate, formData.endDate);
    if (!dateValidation.valid) {
      newErrors.dates = dateValidation.message!;
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

  const getStatusLabel = (status: RentalOrderStatus): string => {
    const labels: Record<RentalOrderStatus, string> = {
      [RentalOrderStatus.Booked]: 'Dipesan',
      [RentalOrderStatus.QuotationApproved]: 'Disetujui',
      [RentalOrderStatus.Delivered]: 'Dikirim',
      [RentalOrderStatus.Active]: 'Aktif',
      [RentalOrderStatus.Returned]: 'Dikembalikan',
    };
    return labels[status];
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="orderId">ID Pesanan *</Label>
          <Input
            id="orderId"
            value={formData.orderId}
            onChange={(e) => handleChange('orderId', e.target.value)}
            placeholder="ORD-001"
            disabled={!!order}
          />
          {errors.orderId && <p className="text-sm text-destructive">{errors.orderId}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="customerId">Pelanggan *</Label>
          <Select
            value={formData.customerId}
            onValueChange={(value) => handleChange('customerId', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Pilih pelanggan" />
            </SelectTrigger>
            <SelectContent>
              {customers?.map((customer) => (
                <SelectItem key={customer.npwp} value={customer.npwp}>
                  {customer.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.customerId && <p className="text-sm text-destructive">{errors.customerId}</p>}
        </div>
      </div>

      <div className="space-y-2">
        <Label>Item yang Disewa *</Label>
        <div className="border rounded-lg p-4 max-h-48 overflow-y-auto space-y-2">
          {inventory?.map((item) => (
            <div key={item.itemId} className="flex items-center gap-2">
              <Checkbox
                id={item.itemId}
                checked={formData.itemIds.includes(item.itemId)}
                onCheckedChange={(checked) => handleItemToggle(item.itemId, checked as boolean)}
              />
              <Label htmlFor={item.itemId} className="flex-1 cursor-pointer">
                {item.itemId} - {item.itemType} ({Number(item.quantity)} tersedia)
              </Label>
            </div>
          ))}
          {!inventory || inventory.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-2">Tidak ada item tersedia</p>
          )}
        </div>
        {errors.itemIds && <p className="text-sm text-destructive">{errors.itemIds}</p>}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="startDate">Tanggal Mulai *</Label>
          <Input
            id="startDate"
            type="date"
            value={formData.startDate}
            onChange={(e) => handleChange('startDate', e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="endDate">Tanggal Selesai *</Label>
          <Input
            id="endDate"
            type="date"
            value={formData.endDate}
            onChange={(e) => handleChange('endDate', e.target.value)}
          />
        </div>
      </div>
      {errors.dates && <p className="text-sm text-destructive">{errors.dates}</p>}

      <div className="space-y-2">
        <Label htmlFor="status">Status *</Label>
        <Select
          value={formData.status}
          onValueChange={(value) => handleChange('status', value as RentalOrderStatus)}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {Object.values(RentalOrderStatus).map((status) => (
              <SelectItem key={status} value={status}>
                {getStatusLabel(status)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
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
