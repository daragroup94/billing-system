import { useState } from "react";
import { Plus, Search, Filter, Download, CheckCircle, Clock, XCircle } from "lucide-react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const payments = [
  {
    id: "PAY-001",
    invoiceId: "INV-2024-001",
    customer: "Ahmad Fauzi",
    amount: "Rp 350.000",
    method: "Transfer Bank",
    date: "10 Des 2024",
    status: "success",
  },
  {
    id: "PAY-002",
    invoiceId: "INV-2024-003",
    customer: "Budi Santoso",
    amount: "Rp 500.000",
    method: "E-Wallet",
    date: "12 Des 2024",
    status: "success",
  },
  {
    id: "PAY-003",
    invoiceId: "INV-2024-006",
    customer: "Rina Wati",
    amount: "Rp 350.000",
    method: "Transfer Bank",
    date: "14 Des 2024",
    status: "success",
  },
  {
    id: "PAY-004",
    invoiceId: "INV-2024-002",
    customer: "Siti Rahayu",
    amount: "Rp 250.000",
    method: "QRIS",
    date: "15 Des 2024",
    status: "pending",
  },
  {
    id: "PAY-005",
    invoiceId: "INV-2024-004",
    customer: "Dewi Lestari",
    amount: "Rp 350.000",
    method: "Transfer Bank",
    date: "16 Des 2024",
    status: "failed",
  },
];

const statusConfig = {
  success: {
    label: "Berhasil",
    icon: CheckCircle,
    className: "bg-success/10 text-success",
  },
  pending: {
    label: "Pending",
    icon: Clock,
    className: "bg-warning/10 text-warning",
  },
  failed: {
    label: "Gagal",
    icon: XCircle,
    className: "bg-destructive/10 text-destructive",
  },
};

const methodColors: Record<string, string> = {
  "Transfer Bank": "bg-primary/10 text-primary",
  "E-Wallet": "bg-accent/10 text-accent",
  "QRIS": "bg-success/10 text-success",
};

export default function Payments() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredPayments = payments.filter(
    (payment) =>
      payment.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      payment.customer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalSuccess = payments
    .filter((p) => p.status === "success")
    .reduce((acc, p) => acc + parseInt(p.amount.replace(/\D/g, "")), 0);

  return (
    <MainLayout>
      {/* Page Header */}
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Pembayaran</h1>
          <p className="text-muted-foreground">Riwayat dan kelola pembayaran pelanggan</p>
        </div>
        <Button variant="gradient" className="gap-2">
          <Plus className="h-4 w-4" />
          Catat Pembayaran
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 sm:grid-cols-3 mb-6">
        <div className="rounded-xl gradient-primary p-6 text-primary-foreground shadow-soft">
          <p className="text-sm opacity-90">Total Diterima Bulan Ini</p>
          <p className="text-3xl font-bold mt-1">Rp {(totalSuccess / 1000000).toFixed(1)}jt</p>
          <p className="text-sm opacity-75 mt-2">+12% dari bulan lalu</p>
        </div>
        <div className="rounded-xl bg-card border border-border/50 p-6 shadow-soft">
          <p className="text-sm text-muted-foreground">Transaksi Sukses</p>
          <p className="text-3xl font-bold text-foreground mt-1">
            {payments.filter((p) => p.status === "success").length}
          </p>
          <p className="text-sm text-success mt-2">
            {((payments.filter((p) => p.status === "success").length / payments.length) * 100).toFixed(0)}% success rate
          </p>
        </div>
        <div className="rounded-xl bg-card border border-border/50 p-6 shadow-soft">
          <p className="text-sm text-muted-foreground">Menunggu Verifikasi</p>
          <p className="text-3xl font-bold text-warning mt-1">
            {payments.filter((p) => p.status === "pending").length}
          </p>
          <p className="text-sm text-muted-foreground mt-2">Perlu ditindaklanjuti</p>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Cari pembayaran..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button variant="outline" className="gap-2">
          <Filter className="h-4 w-4" />
          Filter
        </Button>
        <Button variant="outline" className="gap-2">
          <Download className="h-4 w-4" />
          Export
        </Button>
      </div>

      {/* Table */}
      <div className="rounded-xl bg-card border border-border/50 shadow-soft overflow-hidden animate-fade-in">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                  ID Pembayaran
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                  Pelanggan
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                  Jumlah
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                  Metode
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                  Tanggal
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredPayments.map((payment) => {
                const status = statusConfig[payment.status as keyof typeof statusConfig];
                const StatusIcon = status.icon;

                return (
                  <tr
                    key={payment.id}
                    className="border-b border-border/50 transition-colors hover:bg-muted/30"
                  >
                    <td className="px-6 py-4">
                      <p className="font-medium text-primary">{payment.id}</p>
                      <p className="text-sm text-muted-foreground">{payment.invoiceId}</p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 font-semibold text-primary text-sm">
                          {payment.customer.charAt(0)}
                        </div>
                        <p className="font-medium text-foreground">{payment.customer}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-semibold text-foreground">{payment.amount}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={cn(
                          "rounded-full px-3 py-1 text-sm font-medium",
                          methodColors[payment.method] || "bg-muted text-muted-foreground"
                        )}
                      >
                        {payment.method}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-muted-foreground">{payment.date}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={cn(
                          "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-medium",
                          status.className
                        )}
                      >
                        <StatusIcon className="h-3.5 w-3.5" />
                        {status.label}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </MainLayout>
  );
}
