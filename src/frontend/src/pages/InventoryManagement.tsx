import { useState } from 'react';
import { useGetInventoryItems, useAddInventoryItem, useUpdateInventoryItem, useDeleteInventoryItem } from '@/hooks/useQueries';
import DataTable from '@/components/DataTable';
import InventoryForm from '@/components/InventoryForm';
import LoadingSpinner from '@/components/LoadingSpinner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { formatCurrency, formatNumber } from '@/utils/formatters';
import { toast } from 'sonner';
import { ConditionStatus } from '../backend';
import type { InventoryItem } from '../backend';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';

export default function InventoryManagement() {
  const { data: inventory, isLoading } = useGetInventoryItems();
  const addItem = useAddInventoryItem();
  const updateItem = useUpdateInventoryItem();
  const deleteItem = useDeleteInventoryItem();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);
  const [deletingItemId, setDeletingItemId] = useState<string | null>(null);

  const handleAdd = () => {
    setEditingItem(null);
    setIsFormOpen(true);
  };

  const handleEdit = (item: InventoryItem) => {
    setEditingItem(item);
    setIsFormOpen(true);
  };

  const handleDelete = async () => {
    if (!deletingItemId) return;

    try {
      await deleteItem.mutateAsync(deletingItemId);
      toast.success('Item berhasil dihapus');
      setDeletingItemId(null);
    } catch (error: any) {
      toast.error(error.message || 'Gagal menghapus item');
    }
  };

  const handleSubmit = async (item: InventoryItem) => {
    try {
      if (editingItem) {
        await updateItem.mutateAsync({ itemId: editingItem.itemId, item });
        toast.success('Item berhasil diperbarui');
      } else {
        await addItem.mutateAsync(item);
        toast.success('Item berhasil ditambahkan');
      }
      setIsFormOpen(false);
      setEditingItem(null);
    } catch (error: any) {
      toast.error(error.message || 'Gagal menyimpan item');
    }
  };

  if (isLoading) {
    return <LoadingSpinner text="Memuat data inventori..." />;
  }

  const getConditionBadge = (condition: ConditionStatus) => {
    const variants: Record<ConditionStatus, 'default' | 'secondary' | 'destructive' | 'outline'> = {
      [ConditionStatus.New]: 'default',
      [ConditionStatus.Good]: 'secondary',
      [ConditionStatus.Fair]: 'outline',
      [ConditionStatus.Damaged]: 'destructive',
    };
    const labels: Record<ConditionStatus, string> = {
      [ConditionStatus.New]: 'Baru',
      [ConditionStatus.Good]: 'Baik',
      [ConditionStatus.Fair]: 'Cukup',
      [ConditionStatus.Damaged]: 'Rusak',
    };
    return <Badge variant={variants[condition]}>{labels[condition]}</Badge>;
  };

  const columns = [
    { key: 'itemId', label: 'ID Item' },
    { 
      key: 'itemType', 
      label: 'Tipe',
      render: (item: InventoryItem) => item.itemType
    },
    { 
      key: 'quantity', 
      label: 'Jumlah',
      render: (item: InventoryItem) => formatNumber(item.quantity)
    },
    { 
      key: 'condition', 
      label: 'Kondisi',
      render: (item: InventoryItem) => getConditionBadge(item.condition)
    },
    { key: 'location', label: 'Lokasi' },
    { 
      key: 'acquisitionCost', 
      label: 'Harga Satuan',
      render: (item: InventoryItem) => formatCurrency(item.acquisitionCost)
    },
    {
      key: 'actions',
      label: 'Aksi',
      render: (item: InventoryItem) => (
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              handleEdit(item);
            }}
          >
            <Pencil className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              setDeletingItemId(item.itemId);
            }}
          >
            <Trash2 className="w-4 h-4 text-destructive" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Manajemen Inventori</CardTitle>
          <Button onClick={handleAdd}>
            <Plus className="w-4 h-4 mr-2" />
            Tambah Item
          </Button>
        </CardHeader>
        <CardContent>
          <DataTable
            data={inventory || []}
            columns={columns}
            searchPlaceholder="Cari item..."
          />
        </CardContent>
      </Card>

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingItem ? 'Edit Item Inventori' : 'Tambah Item Inventori'}
            </DialogTitle>
          </DialogHeader>
          <InventoryForm
            item={editingItem}
            onSubmit={handleSubmit}
            onCancel={() => setIsFormOpen(false)}
            isSubmitting={addItem.isPending || updateItem.isPending}
          />
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deletingItemId} onOpenChange={() => setDeletingItemId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Konfirmasi Hapus</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin menghapus item ini? Tindakan ini tidak dapat dibatalkan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground">
              Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
