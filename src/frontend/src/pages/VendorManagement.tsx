import { useState } from 'react';
import { useGetVendors, useAddVendor, useUpdateVendor, useDeleteVendor } from '@/hooks/useQueries';
import DataTable from '@/components/DataTable';
import VendorForm from '@/components/VendorForm';
import LoadingSpinner from '@/components/LoadingSpinner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { formatNPWP } from '@/utils/formatters';
import { toast } from 'sonner';
import type { Vendor } from '../backend';
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

export default function VendorManagement() {
  const { data: vendors, isLoading } = useGetVendors();
  const addVendor = useAddVendor();
  const updateVendor = useUpdateVendor();
  const deleteVendor = useDeleteVendor();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingVendor, setEditingVendor] = useState<Vendor | null>(null);
  const [deletingNpwp, setDeletingNpwp] = useState<string | null>(null);

  const handleAdd = () => {
    setEditingVendor(null);
    setIsFormOpen(true);
  };

  const handleEdit = (vendor: Vendor) => {
    setEditingVendor(vendor);
    setIsFormOpen(true);
  };

  const handleDelete = async () => {
    if (!deletingNpwp) return;

    try {
      await deleteVendor.mutateAsync(deletingNpwp);
      toast.success('Vendor berhasil dihapus');
      setDeletingNpwp(null);
    } catch (error: any) {
      toast.error(error.message || 'Gagal menghapus vendor');
    }
  };

  const handleSubmit = async (vendor: Vendor) => {
    try {
      if (editingVendor) {
        await updateVendor.mutateAsync({ npwp: editingVendor.npwp, vendor });
        toast.success('Vendor berhasil diperbarui');
      } else {
        await addVendor.mutateAsync(vendor);
        toast.success('Vendor berhasil ditambahkan');
      }
      setIsFormOpen(false);
      setEditingVendor(null);
    } catch (error: any) {
      toast.error(error.message || 'Gagal menyimpan vendor');
    }
  };

  if (isLoading) {
    return <LoadingSpinner text="Memuat data vendor..." />;
  }

  const columns = [
    { key: 'companyName', label: 'Nama Perusahaan' },
    { 
      key: 'npwp', 
      label: 'NPWP',
      render: (vendor: Vendor) => formatNPWP(vendor.npwp)
    },
    { key: 'contactPerson', label: 'Kontak Person' },
    { key: 'phone', label: 'Telepon' },
    { 
      key: 'paymentTerms', 
      label: 'Termin Pembayaran',
      render: (vendor: Vendor) => `${vendor.paymentTerms} hari`
    },
    {
      key: 'actions',
      label: 'Aksi',
      render: (vendor: Vendor) => (
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              handleEdit(vendor);
            }}
          >
            <Pencil className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              setDeletingNpwp(vendor.npwp);
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
          <CardTitle>Manajemen Vendor</CardTitle>
          <Button onClick={handleAdd}>
            <Plus className="w-4 h-4 mr-2" />
            Tambah Vendor
          </Button>
        </CardHeader>
        <CardContent>
          <DataTable
            data={vendors || []}
            columns={columns}
            searchPlaceholder="Cari vendor..."
          />
        </CardContent>
      </Card>

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingVendor ? 'Edit Vendor' : 'Tambah Vendor'}
            </DialogTitle>
          </DialogHeader>
          <VendorForm
            vendor={editingVendor}
            onSubmit={handleSubmit}
            onCancel={() => setIsFormOpen(false)}
            isSubmitting={addVendor.isPending || updateVendor.isPending}
          />
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deletingNpwp} onOpenChange={() => setDeletingNpwp(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Konfirmasi Hapus</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin menghapus vendor ini? Tindakan ini tidak dapat dibatalkan.
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
