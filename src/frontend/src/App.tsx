import { createRouter, createRoute, createRootRoute, RouterProvider, Outlet } from '@tanstack/react-router';
import { ThemeProvider } from 'next-themes';
import { Toaster } from '@/components/ui/sonner';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import CustomerManagement from './pages/CustomerManagement';
import VendorManagement from './pages/VendorManagement';
import InventoryManagement from './pages/InventoryManagement';
import RentalOrderManagement from './pages/RentalOrderManagement';
import InvoiceManagement from './pages/InvoiceManagement';
import TaxCompliance from './pages/TaxCompliance';
import Accounting from './pages/Accounting';
import FinancialReports from './pages/FinancialReports';
import UserManagement from './pages/UserManagement';
import AuthGuard from './components/AuthGuard';

const rootRoute = createRootRoute({
  component: () => (
    <AuthGuard>
      <Layout>
        <Outlet />
      </Layout>
    </AuthGuard>
  ),
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: Dashboard,
});

const customersRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/customers',
  component: CustomerManagement,
});

const vendorsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/vendors',
  component: VendorManagement,
});

const inventoryRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/inventory',
  component: InventoryManagement,
});

const rentalsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/rentals',
  component: RentalOrderManagement,
});

const invoicesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/invoices',
  component: InvoiceManagement,
});

const taxRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/tax',
  component: TaxCompliance,
});

const accountingRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/accounting',
  component: Accounting,
});

const reportsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/reports',
  component: FinancialReports,
});

const usersRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/users',
  component: UserManagement,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  customersRoute,
  vendorsRoute,
  inventoryRoute,
  rentalsRoute,
  invoicesRoute,
  taxRoute,
  accountingRoute,
  reportsRoute,
  usersRoute,
]);

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <RouterProvider router={router} />
      <Toaster />
    </ThemeProvider>
  );
}
