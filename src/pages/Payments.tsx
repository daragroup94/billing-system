import { useState } from "react";
import { Plus, Search, Filter, Download, CreditCard } from "lucide-react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface Payment {
  id: string;
  invoiceId: string;
  customer: string;
  amount: string;
  method: string;
  date: string;
  status: "success" | "pending" | "failed";
}

const payments: Payment[] = [];

export default function Payments() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredPayments = payments.filter(
    (payment) =>
      payment.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      payment.customer.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
          <p className="text-3xl font-bold mt-1">Rp 0</p>
          <p className="text-sm opacity-75 mt-2">Belum ada data</p>
        </div>
        <div className="rounded-xl bg-card border border-border/50 p-6 shadow-soft">
          <p className="text-sm text-muted-foreground">Transaksi Sukses</p>
          <p className="text-3xl font-bold text-foreground mt-1">0</p>
          <p className="text-sm text-muted-foreground mt-2">Belum ada transaksi</p>
        </div>
        <div className="rounded-xl bg-card border border-border/50 p-6 shadow-soft">
          <p className="text-sm text-muted-foreground">Menunggu Verifikasi</p>
          <p className="text-3xl font-bold text-warning mt-1">0</p>
          <p className="text-sm text-muted-foreground mt-2">Tidak ada pending</p>
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

      {/* Empty State or Table */}
      {filteredPayments.length === 0 ? (
        <div className="rounded-xl bg-card border border-border/50 shadow-soft p-12 text-center animate-fade-in">
          <div className="flex justify-center mb-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              <CreditCard className="h-8 w-8 text-primary" />
            </div>
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-2">Belum Ada Pembayaran</h3>
          <p className="text-muted-foreground mb-6">
            Catat pembayaran pertama dari pelanggan Anda.
          </p>
          <Button variant="gradient" className="gap-2">
            <Plus className="h-4 w-4" />
            Catat Pembayaran Pertama
          </Button>
        </div>
      ) : (
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
                {/* Data will be rendered here */}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </MainLayout>
  );
}
