import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Settings } from 'lucide-react';
import { useGetCallerUserProfile } from '@/hooks/useAuthorization';
import LoadingSpinner from '@/components/LoadingSpinner';

export default function UserManagement() {
  const { data: profile, isLoading } = useGetCallerUserProfile();

  if (isLoading) {
    return <LoadingSpinner text="Memuat profil..." />;
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Pengaturan Pengguna
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">Profil Saya</h3>
              <div className="space-y-2 text-sm">
                <p><span className="font-medium">Nama:</span> {profile?.name}</p>
                <p><span className="font-medium">Email:</span> {profile?.email}</p>
                <p><span className="font-medium">Role:</span> {Object.keys(profile?.role || {})[0]}</p>
              </div>
            </div>
            <div className="pt-4 border-t">
              <p className="text-sm text-muted-foreground">
                Modul manajemen pengguna lengkap (role assignment, approval workflow) akan segera tersedia.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
