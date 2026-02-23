import { useState } from 'react';
import { useGetCustomers, useAddCustomer, useUpdateCustomer, useDeleteCustomer } from '@/hooks/useQueries';
import DataTable from '@/components/DataTable';
import CustomerForm from '@/components/CustomerForm';
import LoadingSpinner from '@/components/LoadingSpinner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { formatCurrency, formatNPWP } from '@/utils/formatters';
import { toast } from 'sonner';
import type { Customer } from '../backend';
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

export default function CustomerManagement() {
  const { data: customers, isLoading } = useGetCustomers();
  const addCustomer = useAddCustomer();
  const updateCustomer = useUpdateCustomer();
  const deleteCustomer = useDeleteCustomer();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [deletingNpwp, setDeletingNpwp] = useState<string | null>(null);

  const handleAdd = () => {
    setEditingCustomer(null);
    setIsFormOpen(true);
  };

  const handleEdit = (customer: Customer) => {
    setEditingCustomer(customer);
    setIsFormOpen(true);
  };

  const handleDelete = async () => {
    if (!deletingNpwp) return;

    try {
      await deleteCustomer.mutateAsync(deletingNpwp);
      toast.success('Pelanggan berhasil dihapus');
      setDeletingNpwp(null);
    } catch (error: any) {
      toast.error(error.message || 'Gagal menghapus pelanggan');
    }
  };

  const handleSubmit = async (customer: Customer) => {
    try {
      if (editingCustomer) {
        await updateCustomer.mutateAsync({ npwp: editingCustomer.npwp, customer });
        toast.success('Pelanggan berhasil diperbarui');
      } else {
        await addCustomer.mutateAsync(customer);
        toast.success('Pelanggan berhasil ditambahkan');
      }
      setIsFormOpen(false);
      setEditingCustomer(null);
    } catch (error: any) {
      toast.error(error.message || 'Gagal menyimpan pelanggan');
    }
  };

  if (isLoading) {
    return <LoadingSpinner text="Memuat data pelanggan..." />;
  }

  const columns = [
    { key: 'name', label: 'Nama Perusahaan' },
    { 
      key: 'npwp', 
      label: 'NPWP',
      render: (customer: Customer) => formatNPWP(customer.npwp)
    },
    { key: 'contactPerson', label: 'Kontak Person' },
    { key: 'phone', label: 'Telepon' },
    { 
      key: 'creditLimit', 
      label: 'Limit Kredit',
      render: (customer: Customer) => formatCurrency(customer.creditLimit)
    },
    {
      key: 'actions',
      label: 'Aksi',
      render: (customer: Customer) => (
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              handleEdit(customer);
            }}
          >
            <Pencil className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              setDeletingNpwp(customer.npwp);
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
          <CardTitle>Manajemen Pelanggan</CardTitle>
          <Button onClick={handleAdd}>
            <Plus className="w-4 h-4 mr-2" />
            Tambah Pelanggan
          </Button>
        </CardHeader>
        <CardContent>
          <DataTable
            data={customers || []}
            columns={columns}
            searchPlaceholder="Cari pelanggan..."
          />
        </CardContent>
      </Card>

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingCustomer ? 'Edit Pelanggan' : 'Tambah Pelanggan'}
            </DialogTitle>
          </DialogHeader>
          <CustomerForm
            customer={editingCustomer}
            onSubmit={handleSubmit}
            onCancel={() => setIsFormOpen(false)}
            isSubmitting={addCustomer.isPending || updateCustomer.isPending}
          />
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deletingNpwp} onOpenChange={() => setDeletingNpwp(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Konfirmasi Hapus</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin menghapus pelanggan ini? Tindakan ini tidak dapat dibatalkan.
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
