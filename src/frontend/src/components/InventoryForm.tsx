import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { validatePositiveNumber } from '@/utils/validation';
import { ItemType, ConditionStatus } from '../backend';
import type { InventoryItem } from '../backend';

interface InventoryFormProps {
  item: InventoryItem | null;
  onSubmit: (item: InventoryItem) => void;
  onCancel: () => void;
  isSubmitting: boolean;
}

export default function InventoryForm({ item, onSubmit, onCancel, isSubmitting }: InventoryFormProps) {
  const [formData, setFormData] = useState<InventoryItem>({
    itemId: '',
    itemType: ItemType.Frame,
    quantity: BigInt(0),
    condition: ConditionStatus.New,
    location: '',
    acquisitionCost: BigInt(0),
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (item) {
      setFormData(item);
    }
  }, [item]);

  const handleChange = (field: keyof InventoryItem, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.itemId.trim()) {
      newErrors.itemId = 'ID item tidak boleh kosong';
    }

    if (!formData.location.trim()) {
      newErrors.location = 'Lokasi tidak boleh kosong';
    }

    const quantityValidation = validatePositiveNumber(Number(formData.quantity));
    if (!quantityValidation.valid) {
      newErrors.quantity = quantityValidation.message!;
    }

    const costValidation = validatePositiveNumber(Number(formData.acquisitionCost));
    if (!costValidation.valid) {
      newErrors.acquisitionCost = costValidation.message!;
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

  const getItemTypeLabel = (type: ItemType): string => {
    const labels: Record<ItemType, string> = {
      [ItemType.Frame]: 'Frame',
      [ItemType.Board]: 'Board',
      [ItemType.Pipe]: 'Pipe',
      [ItemType.Clamp]: 'Clamp',
      [ItemType.Accessory]: 'Accessory',
    };
    return labels[type];
  };

  const getConditionLabel = (condition: ConditionStatus): string => {
    const labels: Record<ConditionStatus, string> = {
      [ConditionStatus.New]: 'Baru',
      [ConditionStatus.Good]: 'Baik',
      [ConditionStatus.Fair]: 'Cukup',
      [ConditionStatus.Damaged]: 'Rusak',
    };
    return labels[condition];
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="itemId">ID Item *</Label>
          <Input
            id="itemId"
            value={formData.itemId}
            onChange={(e) => handleChange('itemId', e.target.value)}
            placeholder="SCF-001"
            disabled={!!item}
          />
          {errors.itemId && <p className="text-sm text-destructive">{errors.itemId}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="itemType">Tipe Item *</Label>
          <Select
            value={formData.itemType}
            onValueChange={(value) => handleChange('itemType', value as ItemType)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.values(ItemType).map((type) => (
                <SelectItem key={type} value={type}>
                  {getItemTypeLabel(type)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="quantity">Jumlah *</Label>
          <Input
            id="quantity"
            type="number"
            value={Number(formData.quantity)}
            onChange={(e) => handleChange('quantity', BigInt(Math.max(0, parseInt(e.target.value) || 0)))}
            placeholder="0"
            min="0"
          />
          {errors.quantity && <p className="text-sm text-destructive">{errors.quantity}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="condition">Kondisi *</Label>
          <Select
            value={formData.condition}
            onValueChange={(value) => handleChange('condition', value as ConditionStatus)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.values(ConditionStatus).map((condition) => (
                <SelectItem key={condition} value={condition}>
                  {getConditionLabel(condition)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="location">Lokasi *</Label>
          <Input
            id="location"
            value={formData.location}
            onChange={(e) => handleChange('location', e.target.value)}
            placeholder="Gudang A"
          />
          {errors.location && <p className="text-sm text-destructive">{errors.location}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="acquisitionCost">Harga Satuan (IDR) *</Label>
          <Input
            id="acquisitionCost"
            type="number"
            value={Number(formData.acquisitionCost)}
            onChange={(e) => handleChange('acquisitionCost', BigInt(Math.max(0, parseInt(e.target.value) || 0)))}
            placeholder="0"
            min="0"
          />
          {errors.acquisitionCost && <p className="text-sm text-destructive">{errors.acquisitionCost}</p>}
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
