import { ReactNode } from 'react';
import NavigationMenu from './NavigationMenu';
import LoginButton from './LoginButton';
import { SiFacebook } from 'react-icons/si';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const currentYear = new Date().getFullYear();
  const appIdentifier = encodeURIComponent(window.location.hostname || 'scaffolding-rental');

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="border-b bg-card sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <h1 className="text-2xl font-bold text-primary">Sistem Manajemen Sewa Scaffolding</h1>
          </div>
          <LoginButton />
        </div>
      </header>

      <div className="flex flex-1">
        <NavigationMenu />
        <main className="flex-1 p-6 overflow-auto">
          {children}
        </main>
      </div>

      <footer className="border-t bg-card py-4 mt-auto">
        <div className="container mx-auto px-6 text-center text-sm text-muted-foreground">
          <p>
            © {currentYear} Sistem Manajemen Sewa Scaffolding. Built with{' '}
            <SiFacebook className="inline w-3 h-3 text-red-500" /> using{' '}
            <a
              href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${appIdentifier}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}
