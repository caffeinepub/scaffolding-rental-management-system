import { ReactNode, useEffect } from 'react';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useGetCallerUserProfile } from '@/hooks/useAuthorization';
import ProfileSetupModal from './ProfileSetupModal';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

interface AuthGuardProps {
  children: ReactNode;
}

export default function AuthGuard({ children }: AuthGuardProps) {
  const { identity, loginStatus } = useInternetIdentity();
  const isAuthenticated = !!identity;
  
  const { 
    data: userProfile, 
    isLoading: profileLoading, 
    isFetched 
  } = useGetCallerUserProfile();

  const showProfileSetup = isAuthenticated && !profileLoading && isFetched && userProfile === null;

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

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Card className="w-96">
          <CardContent className="pt-6 text-center space-y-4">
            <h2 className="text-2xl font-bold">Selamat Datang</h2>
            <p className="text-muted-foreground">
              Silakan masuk untuk mengakses Sistem Manajemen Sewa Scaffolding
            </p>
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
