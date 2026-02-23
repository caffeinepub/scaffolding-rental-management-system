import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calculator } from 'lucide-react';

export default function Accounting() {
  return (
    <div 
      className="space-y-6 min-h-screen bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: 'url(/assets/generated/financial-bg.dim_800x600.png)', backgroundAttachment: 'fixed' }}
    >
      <div className="backdrop-blur-sm bg-background/80 p-6 rounded-lg">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calculator className="w-5 h-5" />
              Sistem Akuntansi
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-12 text-muted-foreground">
              <p>Modul akuntansi (Chart of Accounts, Journal Entry, General Ledger) akan segera tersedia.</p>
              <p className="text-sm mt-2">Fitur ini memerlukan backend tambahan untuk double-entry bookkeeping.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
