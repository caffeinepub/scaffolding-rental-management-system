import { Link, useRouterState } from '@tanstack/react-router';
import { 
  LayoutDashboard, 
  Users, 
  Package, 
  FileText, 
  DollarSign, 
  Calculator,
  TrendingUp,
  Settings,
  Truck,
  ClipboardList
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useGetCallerUserRole } from '@/hooks/useAuthorization';

export default function NavigationMenu() {
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;
  const { data: userRole } = useGetCallerUserRole();
  const isAdmin = userRole === 'admin';

  const menuItems = [
    { path: '/', label: 'Dashboard', icon: LayoutDashboard, roles: ['admin', 'user'] },
    { 
      label: 'Operasional', 
      icon: ClipboardList,
      roles: ['admin', 'user'],
      children: [
        { path: '/customers', label: 'Pelanggan', icon: Users },
        { path: '/vendors', label: 'Vendor', icon: Truck },
        { path: '/inventory', label: 'Inventori', icon: Package },
        { path: '/rentals', label: 'Pesanan Sewa', icon: FileText },
      ]
    },
    { 
      label: 'Keuangan', 
      icon: DollarSign,
      roles: ['admin', 'user'],
      children: [
        { path: '/invoices', label: 'Faktur & Pembayaran', icon: FileText },
        { path: '/accounting', label: 'Akuntansi', icon: Calculator },
        { path: '/reports', label: 'Laporan Keuangan', icon: TrendingUp },
      ]
    },
    { path: '/tax', label: 'Perpajakan', icon: Calculator, roles: ['admin', 'user'] },
    { path: '/users', label: 'Pengaturan', icon: Settings, roles: ['admin'] },
  ];

  const renderMenuItem = (item: any, depth = 0) => {
    if (item.roles && !item.roles.includes(userRole || 'guest')) {
      return null;
    }

    if (item.children) {
      return (
        <div key={item.label} className="mb-2">
          <div className="px-4 py-2 text-sm font-semibold text-muted-foreground flex items-center gap-2">
            <item.icon className="w-4 h-4" />
            {item.label}
          </div>
          <div className="ml-2">
            {item.children.map((child: any) => renderMenuItem(child, depth + 1))}
          </div>
        </div>
      );
    }

    const isActive = currentPath === item.path;

    return (
      <Link
        key={item.path}
        to={item.path}
        className={cn(
          'flex items-center gap-3 px-4 py-2.5 text-sm rounded-lg transition-colors',
          isActive
            ? 'bg-primary text-primary-foreground font-medium'
            : 'text-foreground hover:bg-accent hover:text-accent-foreground',
          depth > 0 && 'ml-4'
        )}
      >
        <item.icon className="w-4 h-4" />
        {item.label}
      </Link>
    );
  };

  return (
    <aside className="w-64 border-r bg-card p-4 overflow-y-auto">
      <nav className="space-y-1">
        {menuItems.map((item) => renderMenuItem(item))}
      </nav>
    </aside>
  );
}
