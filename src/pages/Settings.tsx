// src/pages/Settings.tsx

import { useState, useEffect } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import {
  Building2,
  CreditCard,
  Bell,
  Shield,
  Save,
  Upload,
} from "lucide-react";
import { settingsAPI, authAPI } from "@/lib/api"; // <-- Import authAPI

// ... (Interface SettingsData dan kode di atasnya tetap sama)
interface SettingsData {
  [key: string]: string | boolean;
}

export default function Settings() {
  const { toast } = useToast();
  const [settings, setSettings] = useState<SettingsData>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // --- State untuk ganti password ---
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [savingPassword, setSavingPassword] = useState(false);

  // ... (useEffect untuk fetchSettings tetap sama)
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await settingsAPI.getAll();
        const settingsObject = response.data.reduce((acc: any, setting: any) => {
          acc[setting.key] = setting.value;
          return acc;
        }, {});
        setSettings(settingsObject);
      } catch (error) {
        toast({
          title: "Gagal Memuat",
          description: "Tidak bisa mengambil pengaturan.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, [toast]);

  // ... (handleInputChange tetap sama)
  const handleInputChange = (key: string, value: string | boolean) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  // ... (handleSave untuk settings tetap sama)
  const handleSave = async () => {
    setSaving(true);
    try {
      const updatePromises = Object.keys(settings).map((key) =>
        settingsAPI.update(key, settings[key])
      );
      await Promise.all(updatePromises);
      toast({
        title: "Berhasil Disimpan",
        description: "Semua perubahan telah disimpan.",
      });
    } catch (error) {
      toast({
        title: "Gagal Menyimpan",
        description: "Terjadi kesalahan saat menyimpan perubahan.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  // --- Fungsi baru untuk handle ganti password ---
  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast({
        title: "Error",
        description: "Password baru dan konfirmasi tidak cocok.",
        variant: "destructive",
      });
      return;
    }
    setSavingPassword(true);
    try {
      await authAPI.changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });
      toast({
        title: "Berhasil Diubah",
        description: "Password Anda berhasil diperbarui.",
      });
      // Kosongkan form
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error: any) {
      toast({
        title: "Gagal Mengubah",
        description: error.response?.data?.error || "Terjadi kesalahan.",
        variant: "destructive",
      });
    } finally {
      setSavingPassword(false);
    }
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-96">
          <p>Memuat pengaturan...</p>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-foreground">Pengaturan</h1>
          <p className="text-muted-foreground">Kelola pengaturan aplikasi dan profil ISP Anda</p>
        </div>

        {/* Settings Tabs */}
        <Tabs defaultValue="profile" className="space-y-6">
          {/* ... (TabsList dan TabContent untuk Profile tetap sama) */}
          <TabsList className="bg-muted/50">
            <TabsTrigger value="profile" className="gap-2">
              <Building2 className="h-4 w-4" />
              Profil ISP
            </TabsTrigger>
            <TabsTrigger value="billing" className="gap-2">
              <CreditCard className="h-4 w-4" />
              Pembayaran
            </TabsTrigger>
            <TabsTrigger value="notifications" className="gap-2">
              <Bell className="h-4 w-4" />
              Notifikasi
            </TabsTrigger>
            <TabsTrigger value="security" className="gap-2">
              <Shield className="h-4 w-4" />
              Keamanan
            </TabsTrigger>
          </TabsList>

          {/* ... (TabContent untuk Profile tetap sama) */}
          <TabsContent value="profile">
            {/* ... Isi tab Profile tetap sama ... */}
          </TabsContent>

          {/* --- PERBAIKAN Tab Pembayaran --- */}
          <TabsContent value="billing">
            <Card className="border-border/50 shadow-soft">
              <CardHeader>
                <CardTitle>Pengaturan Invoice</CardTitle>
                <CardDescription>Kelola format dan jatuh tempo invoice</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="invoice_prefix">Prefix Invoice</Label>
                    <Input
                      id="invoice_prefix"
                      value={(settings.invoice_prefix as string) || ""}
                      onChange={(e) => handleInputChange("invoice_prefix", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="due_days">Jatuh Tempo (Hari)</Label>
                    <Input
                      id="due_days"
                      type="number"
                      value={(settings.due_days as string) || ""}
                      onChange={(e) => handleInputChange("due_days", e.target.value)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ... (TabContent untuk Notifications tetap sama) */}
          <TabsContent value="notifications">
            {/* ... Isi tab Notifications tetap sama ... */}
          </TabsContent>

          {/* --- PERBAIKAN Tab Keamanan --- */}
          <TabsContent value="security">
            <Card className="border-border/50 shadow-soft">
              <CardHeader>
                <CardTitle>Keamanan Akun</CardTitle>
                <CardDescription>Ubah password untuk menjaga keamanan akun Anda</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handlePasswordChange} className="space-y-4 max-w-md">
                  <div className="space-y-2">
                    <Label htmlFor="current_password">Password Saat Ini</Label>
                    <Input
                      id="current_password"
                      type="password"
                      value={passwordData.currentPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="new_password">Password Baru</Label>
                    <Input
                      id="new_password"
                      type="password"
                      value={passwordData.newPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirm_password">Konfirmasi Password Baru</Label>
                    <Input
                      id="confirm_password"
                      type="password"
                      value={passwordData.confirmPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                      required
                    />
                  </div>
                  <Button type="submit" disabled={savingPassword}>
                    {savingPassword ? "Menyimpan..." : "Ubah Password"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Global Save Button */}
        <div className="flex justify-end">
          <Button onClick={handleSave} disabled={saving}>
            <Save className="h-4 w-4 mr-2" />
            {saving ? "Menyimpan..." : "Simpan Perubahan Lainnya"}
          </Button>
        </div>
      </div>
    </MainLayout>
  );
}
