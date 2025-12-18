import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Building2,
  CreditCard,
  Bell,
  Shield,
  Palette,
  Save,
  Upload,
} from "lucide-react";

export default function Settings() {
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

          {/* Profile Tab */}
          <TabsContent value="profile">
            <Card className="border-border/50 shadow-soft">
              <CardHeader>
                <CardTitle>Profil ISP</CardTitle>
                <CardDescription>
                  Informasi dasar tentang bisnis ISP Anda
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center gap-6">
                  <div className="flex h-20 w-20 items-center justify-center rounded-xl bg-primary/10 border-2 border-dashed border-primary/30">
                    <Upload className="h-8 w-8 text-primary/50" />
                  </div>
                  <div>
                    <Button variant="outline" size="sm">
                      Upload Logo
                    </Button>
                    <p className="text-xs text-muted-foreground mt-1">
                      PNG, JPG max 2MB
                    </p>
                  </div>
                </div>

                <Separator />

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="company_name">Nama Perusahaan</Label>
                    <Input
                      id="company_name"
                      placeholder="PT. Internet Cepat Indonesia"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Bisnis</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="info@example.com"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Nomor Telepon</Label>
                    <Input
                      id="phone"
                      placeholder="+62 812 3456 7890"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="website">Website</Label>
                    <Input
                      id="website"
                      placeholder="https://www.example.com"
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="address">Alamat</Label>
                    <Input
                      id="address"
                      placeholder="Jl. Contoh No. 123, Jakarta"
                    />
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button variant="gradient">
                    <Save className="h-4 w-4 mr-2" />
                    Simpan Perubahan
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Billing Tab */}
          <TabsContent value="billing">
            <Card className="border-border/50 shadow-soft">
              <CardHeader>
                <CardTitle>Pengaturan Pembayaran</CardTitle>
                <CardDescription>
                  Kelola metode pembayaran dan pengaturan invoice
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="font-medium">Metode Pembayaran Aktif</h3>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="flex items-center justify-between p-4 rounded-lg border border-border">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                          <CreditCard className="h-5 w-5 text-blue-500" />
                        </div>
                        <div>
                          <p className="font-medium">Transfer Bank</p>
                          <p className="text-sm text-muted-foreground">BCA, Mandiri, BNI, BRI</p>
                        </div>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between p-4 rounded-lg border border-border">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg bg-green-500/10 flex items-center justify-center">
                          <CreditCard className="h-5 w-5 text-green-500" />
                        </div>
                        <div>
                          <p className="font-medium">E-Wallet</p>
                          <p className="text-sm text-muted-foreground">GoPay, OVO, DANA</p>
                        </div>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between p-4 rounded-lg border border-border">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg bg-orange-500/10 flex items-center justify-center">
                          <CreditCard className="h-5 w-5 text-orange-500" />
                        </div>
                        <div>
                          <p className="font-medium">QRIS</p>
                          <p className="text-sm text-muted-foreground">Scan & Pay</p>
                        </div>
                      </div>
                      <Switch />
                    </div>
                    <div className="flex items-center justify-between p-4 rounded-lg border border-border">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
                          <CreditCard className="h-5 w-5 text-purple-500" />
                        </div>
                        <div>
                          <p className="font-medium">Tunai</p>
                          <p className="text-sm text-muted-foreground">Cash Payment</p>
                        </div>
                      </div>
                      <Switch defaultChecked />
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h3 className="font-medium">Pengaturan Invoice</h3>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="invoice_prefix">Prefix Invoice</Label>
                      <Input id="invoice_prefix" defaultValue="INV-" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="due_days">Jatuh Tempo (Hari)</Label>
                      <Input id="due_days" type="number" defaultValue="7" />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button variant="gradient">
                    <Save className="h-4 w-4 mr-2" />
                    Simpan Perubahan
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notifications Tab */}
          <TabsContent value="notifications">
            <Card className="border-border/50 shadow-soft">
              <CardHeader>
                <CardTitle>Pengaturan Notifikasi</CardTitle>
                <CardDescription>
                  Atur bagaimana dan kapan notifikasi dikirim
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Notifikasi Email</p>
                      <p className="text-sm text-muted-foreground">
                        Kirim notifikasi tagihan via email
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Notifikasi WhatsApp</p>
                      <p className="text-sm text-muted-foreground">
                        Kirim notifikasi tagihan via WhatsApp
                      </p>
                    </div>
                    <Switch />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Pengingat Jatuh Tempo</p>
                      <p className="text-sm text-muted-foreground">
                        Kirim pengingat 3 hari sebelum jatuh tempo
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Notifikasi Pembayaran</p>
                      <p className="text-sm text-muted-foreground">
                        Kirim konfirmasi saat pembayaran diterima
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button variant="gradient">
                    <Save className="h-4 w-4 mr-2" />
                    Simpan Perubahan
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Security Tab */}
          <TabsContent value="security">
            <Card className="border-border/50 shadow-soft">
              <CardHeader>
                <CardTitle>Keamanan Akun</CardTitle>
                <CardDescription>
                  Kelola keamanan dan akses akun Anda
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="font-medium">Ubah Password</h3>
                  <div className="grid gap-4 max-w-md">
                    <div className="space-y-2">
                      <Label htmlFor="current_password">Password Saat Ini</Label>
                      <Input id="current_password" type="password" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="new_password">Password Baru</Label>
                      <Input id="new_password" type="password" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirm_password">Konfirmasi Password</Label>
                      <Input id="confirm_password" type="password" />
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Autentikasi 2 Faktor</p>
                      <p className="text-sm text-muted-foreground">
                        Tambahkan lapisan keamanan ekstra
                      </p>
                    </div>
                    <Switch />
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button variant="gradient">
                    <Save className="h-4 w-4 mr-2" />
                    Simpan Perubahan
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
}
