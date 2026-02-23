import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText } from 'lucide-react';

export default function InvoiceManagement() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Manajemen Faktur & Pembayaran
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12 text-muted-foreground">
            <p>Modul faktur dan pembayaran akan segera tersedia.</p>
            <p className="text-sm mt-2">Fitur ini memerlukan backend tambahan untuk pengelolaan faktur dan tracking pembayaran.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
