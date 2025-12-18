import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bell, MessageSquare, Mail, CheckCircle, AlertCircle, Clock, Trash2 } from "lucide-react";

const notifications = [
  {
    id: 1,
    type: "payment",
    title: "Pembayaran Diterima",
    message: "Ahmad Fauzi telah melakukan pembayaran sebesar Rp 350.000",
    time: "5 menit lalu",
    read: false,
  },
  {
    id: 2,
    type: "overdue",
    title: "Tagihan Jatuh Tempo",
    message: "3 pelanggan memiliki tagihan yang sudah melewati jatuh tempo",
    time: "1 jam lalu",
    read: false,
  },
  {
    id: 3,
    type: "new_customer",
    title: "Pelanggan Baru",
    message: "Dewi Lestari telah mendaftar sebagai pelanggan baru",
    time: "2 jam lalu",
    read: true,
  },
  {
    id: 4,
    type: "reminder",
    title: "Pengingat Tagihan",
    message: "15 pelanggan akan jatuh tempo dalam 3 hari",
    time: "5 jam lalu",
    read: true,
  },
  {
    id: 5,
    type: "system",
    title: "Pemeliharaan Sistem",
    message: "Sistem akan melakukan pemeliharaan pada 20 Desember 2024",
    time: "1 hari lalu",
    read: true,
  },
];

const getNotificationIcon = (type: string) => {
  switch (type) {
    case "payment":
      return <CheckCircle className="h-5 w-5 text-green-500" />;
    case "overdue":
      return <AlertCircle className="h-5 w-5 text-red-500" />;
    case "new_customer":
      return <Bell className="h-5 w-5 text-primary" />;
    case "reminder":
      return <Clock className="h-5 w-5 text-yellow-500" />;
    case "system":
      return <Mail className="h-5 w-5 text-muted-foreground" />;
    default:
      return <Bell className="h-5 w-5 text-muted-foreground" />;
  }
};

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
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <CheckCircle className="h-4 w-4 mr-2" />
              Tandai Semua Dibaca
            </Button>
            <Button variant="outline" size="sm">
              <Trash2 className="h-4 w-4 mr-2" />
              Hapus Semua
            </Button>
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

        {/* Notification List */}
        <Card className="border-border/50 shadow-soft">
          <CardHeader>
            <CardTitle className="text-lg">Semua Notifikasi</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-border">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`flex items-start gap-4 p-4 hover:bg-muted/50 transition-colors cursor-pointer ${
                    !notification.read ? "bg-primary/5" : ""
                  }`}
                >
                  <div className="flex-shrink-0 mt-0.5">
                    {getNotificationIcon(notification.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-foreground">{notification.title}</p>
                      {!notification.read && (
                        <Badge variant="secondary" className="text-xs">
                          Baru
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      {notification.message}
                    </p>
                    <p className="text-xs text-muted-foreground mt-2">{notification.time}</p>
                  </div>
                  <Button variant="ghost" size="icon" className="flex-shrink-0">
                    <Trash2 className="h-4 w-4 text-muted-foreground" />
                  </Button>
                </div>
              ))}
            </div>
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
