import { ReactNode } from 'react';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useGetCallerUserProfile } from '@/hooks/useAuthorization';
import ProfileSetupModal from './ProfileSetupModal';
import LoginButton from './LoginButton';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2, AlertCircle } from 'lucide-react';

interface AuthGuardProps {
  children: ReactNode;
}

export default function AuthGuard({ children }: AuthGuardProps) {
  const { identity, loginStatus, loginError } = useInternetIdentity();
  const isAuthenticated = !!identity;
  
  const { 
    data: userProfile, 
    isLoading: profileLoading, 
    isFetched 
  } = useGetCallerUserProfile();

  const showProfileSetup = isAuthenticated && !profileLoading && isFetched && userProfile === null;

  // Show loading only during initialization, not on error
  if (loginStatus === 'initializing' || (isAuthenticated && profileLoading)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Card className="w-96">
          <CardContent className="pt-6 flex flex-col items-center gap-4">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground">Memuat...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Show login interface for unauthenticated users, even if there was an initialization error
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Card className="w-[480px]">
          <CardContent className="pt-8 pb-8 text-center space-y-6">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tight">Selamat Datang</h2>
              <p className="text-muted-foreground text-base">
                Silakan masuk untuk mengakses Sistem Manajemen Sewa Scaffolding
              </p>
            </div>
            
            {/* Show optional warning if there was an initialization issue */}
            {loginStatus === 'loginError' && loginError && (
              <div className="flex items-center gap-2 text-sm text-amber-600 dark:text-amber-500 bg-amber-50 dark:bg-amber-950/20 p-3 rounded-md">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <p className="text-left">
                  Terjadi masalah saat inisialisasi. Silakan coba masuk untuk melanjutkan.
                </p>
              </div>
            )}
            
            <div className="flex justify-center pt-2">
              <LoginButton />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <>
      {showProfileSetup && <ProfileSetupModal />}
      {children}
    </>
  );
}
