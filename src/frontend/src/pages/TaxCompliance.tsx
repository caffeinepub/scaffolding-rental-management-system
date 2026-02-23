import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calculator } from 'lucide-react';

export default function TaxCompliance() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="w-5 h-5" />
            Perpajakan Indonesia
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12 text-muted-foreground">
            <p>Modul perpajakan (PPN 11%, PPh 23, e-Faktur) akan segera tersedia.</p>
            <p className="text-sm mt-2">Fitur ini memerlukan backend tambahan untuk perhitungan pajak dan pembuatan faktur pajak.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
