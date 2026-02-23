import { useState } from 'react';
import { useGetAllOrders, useCreateOrder, useUpdateOrder, useDeleteOrder } from '@/hooks/useQueries';
import DataTable from '@/components/DataTable';
import RentalOrderForm from '@/components/RentalOrderForm';
import LoadingSpinner from '@/components/LoadingSpinner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { formatDate } from '@/utils/formatters';
import { toast } from 'sonner';
import { RentalOrderStatus } from '../backend';
import type { RentalOrder } from '../backend';
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

export default function RentalOrderManagement() {
  const { data: orders, isLoading } = useGetAllOrders();
  const createOrder = useCreateOrder();
  const updateOrder = useUpdateOrder();
  const deleteOrder = useDeleteOrder();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingOrder, setEditingOrder] = useState<RentalOrder | null>(null);
  const [deletingOrderId, setDeletingOrderId] = useState<string | null>(null);

  const handleAdd = () => {
    setEditingOrder(null);
    setIsFormOpen(true);
  };

  const handleEdit = (order: RentalOrder) => {
    setEditingOrder(order);
    setIsFormOpen(true);
  };

  const handleDelete = async () => {
    if (!deletingOrderId) return;

    try {
      await deleteOrder.mutateAsync(deletingOrderId);
      toast.success('Pesanan berhasil dihapus');
      setDeletingOrderId(null);
    } catch (error: any) {
      toast.error(error.message || 'Gagal menghapus pesanan');
    }
  };

  const handleSubmit = async (order: RentalOrder) => {
    try {
      if (editingOrder) {
        await updateOrder.mutateAsync({ orderId: editingOrder.orderId, order });
        toast.success('Pesanan berhasil diperbarui');
      } else {
        await createOrder.mutateAsync(order);
        toast.success('Pesanan berhasil dibuat');
      }
      setIsFormOpen(false);
      setEditingOrder(null);
    } catch (error: any) {
      toast.error(error.message || 'Gagal menyimpan pesanan');
    }
  };

  if (isLoading) {
    return <LoadingSpinner text="Memuat data pesanan..." />;
  }

  const getStatusBadge = (status: RentalOrderStatus) => {
    const variants: Record<RentalOrderStatus, 'default' | 'secondary' | 'destructive' | 'outline'> = {
      [RentalOrderStatus.Booked]: 'outline',
      [RentalOrderStatus.QuotationApproved]: 'secondary',
      [RentalOrderStatus.Delivered]: 'default',
      [RentalOrderStatus.Active]: 'default',
      [RentalOrderStatus.Returned]: 'secondary',
    };
    const labels: Record<RentalOrderStatus, string> = {
      [RentalOrderStatus.Booked]: 'Dipesan',
      [RentalOrderStatus.QuotationApproved]: 'Disetujui',
      [RentalOrderStatus.Delivered]: 'Dikirim',
      [RentalOrderStatus.Active]: 'Aktif',
      [RentalOrderStatus.Returned]: 'Dikembalikan',
    };
    return <Badge variant={variants[status]}>{labels[status]}</Badge>;
  };

  const columns = [
    { key: 'orderId', label: 'ID Pesanan' },
    { key: 'customerId', label: 'Pelanggan' },
    { 
      key: 'itemIds', 
      label: 'Jumlah Item',
      render: (order: RentalOrder) => `${order.itemIds.length} item`
    },
    { 
      key: 'startDate', 
      label: 'Tanggal Mulai',
      render: (order: RentalOrder) => formatDate(order.startDate)
    },
    { 
      key: 'endDate', 
      label: 'Tanggal Selesai',
      render: (order: RentalOrder) => formatDate(order.endDate)
    },
    { 
      key: 'status', 
      label: 'Status',
      render: (order: RentalOrder) => getStatusBadge(order.status)
    },
    {
      key: 'actions',
      label: 'Aksi',
      render: (order: RentalOrder) => (
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              handleEdit(order);
            }}
          >
            <Pencil className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              setDeletingOrderId(order.orderId);
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
          <CardTitle>Manajemen Pesanan Sewa</CardTitle>
          <Button onClick={handleAdd}>
            <Plus className="w-4 h-4 mr-2" />
            Buat Pesanan
          </Button>
        </CardHeader>
        <CardContent>
          <DataTable
            data={orders || []}
            columns={columns}
            searchPlaceholder="Cari pesanan..."
          />
        </CardContent>
      </Card>

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingOrder ? 'Edit Pesanan' : 'Buat Pesanan Baru'}
            </DialogTitle>
          </DialogHeader>
          <RentalOrderForm
            order={editingOrder}
            onSubmit={handleSubmit}
            onCancel={() => setIsFormOpen(false)}
            isSubmitting={createOrder.isPending || updateOrder.isPending}
          />
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deletingOrderId} onOpenChange={() => setDeletingOrderId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Konfirmasi Hapus</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin menghapus pesanan ini? Tindakan ini tidak dapat dibatalkan.
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
