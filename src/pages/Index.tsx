import { Users, FileText, CreditCard, TrendingUp, AlertTriangle } from "lucide-react";
import { MainLayout } from "@/components/layout/MainLayout";
import { StatCard } from "@/components/dashboard/StatCard";
import { RecentPayments } from "@/components/dashboard/RecentPayments";
import { CustomerOverview } from "@/components/dashboard/CustomerOverview";
import { PendingInvoices } from "@/components/dashboard/PendingInvoices";

const Index = () => {
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
          value="0"
          change="Belum ada data"
          changeType="neutral"
          icon={Users}
          iconColor="bg-primary/10 text-primary"
        />
        <StatCard
          title="Pendapatan Bulan Ini"
          value="Rp 0"
          change="Belum ada data"
          changeType="neutral"
          icon={TrendingUp}
          iconColor="bg-success/10 text-success"
        />
        <StatCard
          title="Tagihan Pending"
          value="0"
          change="Tidak ada tagihan"
          changeType="neutral"
          icon={FileText}
          iconColor="bg-warning/10 text-warning"
        />
        <StatCard
          title="Jatuh Tempo Hari Ini"
          value="0"
          change="Tidak ada"
          changeType="neutral"
          icon={AlertTriangle}
          iconColor="bg-destructive/10 text-destructive"
        />
      </div>

      {/* Charts and Tables */}
      <div className="grid gap-6 lg:grid-cols-2 mb-8">
        <CustomerOverview />
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
