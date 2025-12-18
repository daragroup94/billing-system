import { useState } from "react";
import { Plus, Search, Filter, Download, Eye, CheckCircle, Clock, XCircle } from "lucide-react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const invoices = [
  {
    id: "INV-2024-001",
    customer: "Ahmad Fauzi",
    package: "Premium 50 Mbps",
    amount: "Rp 350.000",
    issueDate: "01 Des 2024",
    dueDate: "15 Des 2024",
    status: "paid",
  },
  {
    id: "INV-2024-002",
    customer: "Siti Rahayu",
    package: "Basic 20 Mbps",
    amount: "Rp 250.000",
    issueDate: "01 Des 2024",
    dueDate: "15 Des 2024",
    status: "pending",
  },
  {
    id: "INV-2024-003",
    customer: "Budi Santoso",
    package: "Business 100 Mbps",
    amount: "Rp 500.000",
    issueDate: "01 Des 2024",
    dueDate: "15 Des 2024",
    status: "paid",
  },
  {
    id: "INV-2024-004",
    customer: "Dewi Lestari",
    package: "Premium 50 Mbps",
    amount: "Rp 350.000",
    issueDate: "01 Des 2024",
    dueDate: "15 Des 2024",
    status: "overdue",
  },
  {
    id: "INV-2024-005",
    customer: "Rudi Hermawan",
    package: "Basic 20 Mbps",
    amount: "Rp 250.000",
    issueDate: "01 Des 2024",
    dueDate: "20 Des 2024",
    status: "pending",
  },
  {
    id: "INV-2024-006",
    customer: "Rina Wati",
    package: "Premium 50 Mbps",
    amount: "Rp 350.000",
    issueDate: "01 Des 2024",
    dueDate: "20 Des 2024",
    status: "paid",
  },
];

const statusConfig = {
  paid: {
    label: "Lunas",
    icon: CheckCircle,
    className: "bg-success/10 text-success",
  },
  pending: {
    label: "Pending",
    icon: Clock,
    className: "bg-warning/10 text-warning",
  },
  overdue: {
    label: "Jatuh Tempo",
    icon: XCircle,
    className: "bg-destructive/10 text-destructive",
  },
};

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

      {/* Table */}
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
              {filteredInvoices.map((invoice) => {
                const status = statusConfig[invoice.status as keyof typeof statusConfig];
                const StatusIcon = status.icon;

                return (
                  <tr
                    key={invoice.id}
                    className="border-b border-border/50 transition-colors hover:bg-muted/30"
                  >
                    <td className="px-6 py-4">
                      <p className="font-medium text-primary">{invoice.id}</p>
                      <p className="text-sm text-muted-foreground">
                        Dibuat {invoice.issueDate}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-medium text-foreground">{invoice.customer}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-muted-foreground">{invoice.package}</span>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-semibold text-foreground">{invoice.amount}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-muted-foreground">{invoice.dueDate}</p>
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
                    <td className="px-6 py-4 text-right">
                      <Button variant="ghost" size="icon">
                        <Eye className="h-4 w-4" />
                      </Button>
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
