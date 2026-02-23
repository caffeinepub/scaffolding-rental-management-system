import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { LogIn, LogOut, Loader2 } from 'lucide-react';

export default function LoginButton() {
  const { login, clear, loginStatus, identity } = useInternetIdentity();
  const queryClient = useQueryClient();

  const isAuthenticated = !!identity;
  const disabled = loginStatus === 'logging-in' || loginStatus === 'initializing';

  const handleAuth = async () => {
    if (isAuthenticated) {
      await clear();
      queryClient.clear();
    } else {
      // Simply call login - the hook now handles errors gracefully
      login();
    }
  };

  return (
    <Button
      onClick={handleAuth}
      disabled={disabled}
      variant={isAuthenticated ? 'outline' : 'default'}
      size="lg"
      className="gap-2 min-w-[160px] min-h-[48px] text-base font-semibold"
    >
      {loginStatus === 'logging-in' ? (
        <>
          <Loader2 className="w-5 h-5 animate-spin" />
          Sedang masuk...
        </>
      ) : loginStatus === 'initializing' ? (
        <>
          <Loader2 className="w-5 h-5 animate-spin" />
          Memuat...
        </>
      ) : isAuthenticated ? (
        <>
          <LogOut className="w-5 h-5" />
          Keluar
        </>
      ) : (
        <>
          <LogIn className="w-5 h-5" />
          Masuk
        </>
      )}
    </Button>
  );
}
