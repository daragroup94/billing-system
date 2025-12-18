import { useState } from "react";
import { Plus, Search, Filter, Download, FileText } from "lucide-react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface Invoice {
  id: string;
  customer: string;
  package: string;
  amount: string;
  issueDate: string;
  dueDate: string;
  status: "paid" | "pending" | "overdue";
}

const invoices: Invoice[] = [];

export default function Invoices() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredInvoices = invoices.filter(
    (invoice) =>
      invoice.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      invoice.customer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const stats = {
    total: invoices.length,
    paid: invoices.filter((i) => i.status === "paid").length,
    pending: invoices.filter((i) => i.status === "pending").length,
    overdue: invoices.filter((i) => i.status === "overdue").length,
  };

  return (
    <MainLayout>
      {/* Page Header */}
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Tagihan</h1>
          <p className="text-muted-foreground">Kelola tagihan dan invoice pelanggan</p>
        </div>
        <Button variant="gradient" className="gap-2">
          <Plus className="h-4 w-4" />
          Buat Tagihan
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-4 mb-6">
        <div className="rounded-lg bg-card border border-border/50 p-4 shadow-soft">
          <p className="text-sm text-muted-foreground">Total Tagihan</p>
          <p className="text-2xl font-bold text-foreground">{stats.total}</p>
        </div>
        <div className="rounded-lg bg-success/5 border border-success/20 p-4">
          <p className="text-sm text-success">Lunas</p>
          <p className="text-2xl font-bold text-success">{stats.paid}</p>
        </div>
        <div className="rounded-lg bg-warning/5 border border-warning/20 p-4">
          <p className="text-sm text-warning">Pending</p>
          <p className="text-2xl font-bold text-warning">{stats.pending}</p>
        </div>
        <div className="rounded-lg bg-destructive/5 border border-destructive/20 p-4">
          <p className="text-sm text-destructive">Jatuh Tempo</p>
          <p className="text-2xl font-bold text-destructive">{stats.overdue}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Cari invoice..."
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
      {filteredInvoices.length === 0 ? (
        <div className="rounded-xl bg-card border border-border/50 shadow-soft p-12 text-center animate-fade-in">
          <div className="flex justify-center mb-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              <FileText className="h-8 w-8 text-primary" />
            </div>
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-2">Belum Ada Tagihan</h3>
          <p className="text-muted-foreground mb-6">
            Buat tagihan pertama untuk mulai mengelola pembayaran pelanggan.
          </p>
          <Button variant="gradient" className="gap-2">
            <Plus className="h-4 w-4" />
            Buat Tagihan Pertama
          </Button>
        </div>
      ) : (
        <div className="rounded-xl bg-card border border-border/50 shadow-soft overflow-hidden animate-fade-in">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                    Invoice
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                    Pelanggan
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                    Paket
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                    Jumlah
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                    Jatuh Tempo
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                    Status
                  </th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-foreground">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredInvoices.map((invoice) => (
                  <tr key={invoice.id} className="border-b border-border hover:bg-muted/30 transition-colors">
                    <td className="px-6 py-4 text-sm font-medium text-foreground">
                      {invoice.id}
                    </td>
                    <td className="px-6 py-4 text-sm text-foreground">
                      {invoice.customer}
                    </td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">
                      {invoice.package}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-foreground">
                      {invoice.amount}
                    </td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">
                      {invoice.dueDate}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          invoice.status === "paid"
                            ? "bg-success/10 text-success"
                            : invoice.status === "pending"
                            ? "bg-warning/10 text-warning"
                            : "bg-destructive/10 text-destructive"
                        }`}
                      >
                        {invoice.status === "paid"
                          ? "Lunas"
                          : invoice.status === "pending"
                          ? "Pending"
                          : "Jatuh Tempo"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Button variant="ghost" size="sm">
                        Detail
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </MainLayout>
  );
}
