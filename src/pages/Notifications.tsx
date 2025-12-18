import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bell, MessageSquare, CheckCircle, Clock } from "lucide-react";

interface Notification {
  id: number;
  type: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
}

const notifications: Notification[] = [];

export default function Notifications() {
  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Notifikasi</h1>
            <p className="text-muted-foreground">Kelola notifikasi dan pemberitahuan sistem</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="border-border/50 shadow-soft">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <Bell className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Notifikasi</p>
                  <p className="text-xl font-bold text-foreground">{notifications.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-border/50 shadow-soft">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-yellow-500/10">
                  <Clock className="h-5 w-5 text-yellow-500" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Belum Dibaca</p>
                  <p className="text-xl font-bold text-foreground">
                    {notifications.filter((n) => !n.read).length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-border/50 shadow-soft">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-500/10">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Sudah Dibaca</p>
                  <p className="text-xl font-bold text-foreground">
                    {notifications.filter((n) => n.read).length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Empty State or Notification List */}
        <Card className="border-border/50 shadow-soft">
          <CardHeader>
            <CardTitle className="text-lg">Semua Notifikasi</CardTitle>
          </CardHeader>
          <CardContent>
            {notifications.length === 0 ? (
              <div className="p-8 text-center">
                <div className="flex justify-center mb-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                    <Bell className="h-8 w-8 text-primary" />
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">Belum Ada Notifikasi</h3>
                <p className="text-muted-foreground">
                  Notifikasi tentang tagihan, pembayaran, dan pelanggan akan muncul di sini.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-border">
                {/* Notifications will be rendered here */}
              </div>
            )}
          </CardContent>
        </Card>

        {/* WhatsApp Integration Card */}
        <Card className="border-border/50 shadow-soft">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-green-500" />
              Integrasi WhatsApp
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Kirim notifikasi tagihan dan pengingat pembayaran langsung ke WhatsApp pelanggan.
            </p>
            <Button variant="gradient">
              <MessageSquare className="h-4 w-4 mr-2" />
              Aktifkan WhatsApp
            </Button>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
