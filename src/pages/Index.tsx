// src/pages/Index.tsx

import { useState, useEffect } from "react";
import { Users, FileText, CreditCard, TrendingUp, AlertTriangle } from "lucide-react";
import { MainLayout } from "@/components/layout/MainLayout";
import { StatCard } from "@/components/dashboard/StatCard";
import { RecentPayments } from "@/components/dashboard/RecentPayments";
import { RevenueChart } from "@/components/dashboard/RevenueChart"; // Import chart baru
import { PendingInvoices } from "@/components/dashboard/PendingInvoices";
import { dashboardAPI } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

// Definisikan tipe data untuk statistik
interface DashboardStats {
  totalCustomers: number;
  monthlyRevenue: number;
  pendingInvoices: number;
  dueTodayInvoices: number;
}

const Index = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await dashboardAPI.getStats();
        setStats(response.data);
      } catch (error: any) {
        console.error("Gagal mengambil data dashboard:", error);
        toast({
          title: 'Error',
          description: 'Gagal memuat data dashboard. Periksa koneksi Anda.',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-96">
          <p>Memuat data dashboard...</p>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground">Selamat datang! Berikut ringkasan bisnis ISP Anda.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        <StatCard
          title="Total Pelanggan"
          value={stats ? stats.totalCustomers.toString() : "0"}
          change={stats && stats.totalCustomers > 0 ? "Data tersinkron" : "Belum ada data"}
          changeType="neutral"
          icon={Users}
          iconColor="bg-primary/10 text-primary"
        />
        <StatCard
          title="Pendapatan Bulan Ini"
          value={stats ? `Rp ${stats.monthlyRevenue.toLocaleString('id-ID')}` : "Rp 0"}
          change={stats && stats.monthlyRevenue > 0 ? "Sudah tercatat" : "Belum ada data"}
          changeType="neutral"
          icon={TrendingUp}
          iconColor="bg-success/10 text-success"
        />
        <StatCard
          title="Tagihan Pending"
          value={stats ? stats.pendingInvoices.toString() : "0"}
          change={stats && stats.pendingInvoices > 0 ? "Perlu ditindak" : "Tidak ada tagihan"}
          changeType="neutral"
          icon={FileText}
          iconColor="bg-warning/10 text-warning"
        />
        <StatCard
          title="Jatuh Tempo Hari Ini"
          value={stats ? stats.dueTodayInvoices.toString() : "0"}
          change={stats && stats.dueTodayInvoices > 0 ? "Ada yang jatuh tempo!" : "Tidak ada"}
          changeType="neutral"
          icon={AlertTriangle}
          iconColor="bg-destructive/10 text-destructive"
        />
      </div>

      {/* Charts and Tables - Layout Baru */}
      <div className="grid gap-6 lg:grid-cols-1 mb-8">
        <RevenueChart />
        <PendingInvoices />
      </div>

      {/* Recent Activity */}
      <div className="grid gap-6 lg:grid-cols-1">
        <RecentPayments />
      </div>
    </MainLayout>
  );
};

export default Index;
