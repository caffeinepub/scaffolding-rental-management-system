import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useGetCustomers, useGetInventoryItems, useGetAllOrders } from '@/hooks/useQueries';
import { formatCurrency, formatNumber } from '@/utils/formatters';
import { DollarSign, Package, FileText, TrendingUp } from 'lucide-react';
import { RentalOrderStatus } from '../backend';
import LoadingSpinner from '@/components/LoadingSpinner';

export default function Dashboard() {
  const { data: customers, isLoading: customersLoading } = useGetCustomers();
  const { data: inventory, isLoading: inventoryLoading } = useGetInventoryItems();
  const { data: orders, isLoading: ordersLoading } = useGetAllOrders();

  if (customersLoading || inventoryLoading || ordersLoading) {
    return <LoadingSpinner text="Memuat dashboard..." />;
  }

  const activeOrders = orders?.filter(o => 
    o.status === RentalOrderStatus.Active || 
    o.status === RentalOrderStatus.Delivered
  ) || [];
  
  const totalInventoryValue = inventory?.reduce((sum, item) => sum + Number(item.acquisitionCost) * Number(item.quantity), 0) || 0;
  const totalInventoryItems = inventory?.reduce((sum, item) => sum + Number(item.quantity), 0) || 0;

  const kpiCards = [
    {
      title: 'Total Pelanggan',
      value: formatNumber(customers?.length || 0),
      icon: DollarSign,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'Total Inventori',
      value: formatNumber(totalInventoryItems),
      icon: Package,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      title: 'Pesanan Aktif',
      value: formatNumber(activeOrders.length),
      icon: FileText,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
    {
      title: 'Nilai Inventori',
      value: formatCurrency(totalInventoryValue),
      icon: TrendingUp,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="relative h-48 rounded-lg overflow-hidden mb-8">
        <img
          src="/assets/generated/scaffolding-hero.dim_1200x300.png"
          alt="Scaffolding"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent flex items-center">
          <div className="px-8">
            <h1 className="text-4xl font-bold text-white mb-2">Dashboard</h1>
            <p className="text-white/90 text-lg">Sistem Manajemen Sewa Scaffolding</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpiCards.map((kpi) => (
          <Card key={kpi.title}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {kpi.title}
              </CardTitle>
              <div className={`p-2 rounded-lg ${kpi.bgColor}`}>
                <kpi.icon className={`w-5 h-5 ${kpi.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{kpi.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="w-5 h-5" />
              Ringkasan Inventori
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {inventory?.slice(0, 5).map((item) => (
                <div key={item.itemId} className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">{item.itemId}</p>
                    <p className="text-sm text-muted-foreground">
                      {item.itemType} - {item.condition}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">{formatNumber(item.quantity)} unit</p>
                    <p className="text-sm text-muted-foreground">{formatCurrency(item.acquisitionCost)}</p>
                  </div>
                </div>
              ))}
              {!inventory || inventory.length === 0 && (
                <p className="text-center text-muted-foreground py-4">Belum ada data inventori</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Pesanan Terbaru
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {orders?.slice(0, 5).map((order) => (
                <div key={order.orderId} className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">{order.orderId}</p>
                    <p className="text-sm text-muted-foreground">{order.customerId}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">{order.status}</p>
                    <p className="text-xs text-muted-foreground">{order.itemIds.length} item</p>
                  </div>
                </div>
              ))}
              {!orders || orders.length === 0 && (
                <p className="text-center text-muted-foreground py-4">Belum ada pesanan</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
