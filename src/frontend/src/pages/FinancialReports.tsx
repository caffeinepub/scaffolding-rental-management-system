import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp } from 'lucide-react';

export default function FinancialReports() {
  return (
    <div 
      className="space-y-6 min-h-screen bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: 'url(/assets/generated/financial-bg.dim_800x600.png)', backgroundAttachment: 'fixed' }}
    >
      <div className="backdrop-blur-sm bg-background/80 p-6 rounded-lg">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Laporan Keuangan
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-12 text-muted-foreground">
              <p>Modul laporan keuangan (Laba Rugi, Neraca, Arus Kas) akan segera tersedia.</p>
              <p className="text-sm mt-2">Fitur ini memerlukan backend tambahan untuk pembuatan laporan keuangan.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
