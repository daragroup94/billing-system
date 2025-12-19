import { useState, useEffect } from "react";
import { Plus, Search, Filter, Download, CreditCard } from "lucide-react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

interface Payment {
  id: string;
  invoice_id: string;
  invoice_number: string;
  customer_id: number;
  customer: string;
  amount: number;
  method: string;
  payment_date: string;
  status: "success" | "pending" | "failed";
  notes?: string;
}

interface Invoice {
  id: string;
  customer_id: number;
  customer: string;
  amount: number;
  status: string;
}

export default function Payments() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  const [formData, setFormData] = useState({
    invoice_id: "",
    customer_id: "",
    amount: "",
    method: "transfer",
    notes: "",
  });

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

  // Load payments
  const loadPayments = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`${API_URL}/payments?search=${searchQuery}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      setPayments(data.data || []);
    } catch (error) {
      console.error("Error loading payments:", error);
      toast.error("Gagal memuat data pembayaran");
    } finally {
      setIsLoading(false);
    }
  };

  // Load pending invoices
  const loadInvoices = async () => {
    try {
      const response = await fetch(`${API_URL}/invoices?status=pending`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      setInvoices(data.data || []);
    } catch (error) {
      console.error("Error loading invoices:", error);
    }
  };

  useEffect(() => {
    loadPayments();
    loadInvoices();
  }, [searchQuery]);

  const filteredPayments = payments.filter(
    (payment) =>
      payment.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      payment.customer?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Calculate stats
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  
  const monthlyPayments = payments.filter(payment => {
    const paymentDate = new Date(payment.payment_date);
    return paymentDate.getMonth() === currentMonth && 
           paymentDate.getFullYear() === currentYear;
  });

  const totalReceived = monthlyPayments.reduce((sum, p) => sum + (p.amount || 0), 0);
  const successCount = payments.filter(p => p.status === 'success').length;
  const pendingCount = payments.filter(p => p.status === 'pending').length;

  // Handle invoice selection
  const handleInvoiceSelect = (invoiceId: string) => {
    const invoice = invoices.find(inv => inv.id === invoiceId);
    if (invoice) {
      setFormData({
        invoice_id: invoiceId,
        customer_id: invoice.customer_id.toString(),
        amount: invoice.amount.toString(),
        method: "transfer",
        notes: "",
      });
    }
  };

  // Handle submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setIsLoading(true);
      
      const payload = {
        invoice_id: formData.invoice_id,
        customer_id: parseInt(formData.customer_id),
        amount: parseFloat(formData.amount),
        method: formData.method,
        notes: formData.notes,
      };

      const response = await fetch(`${API_URL}/payments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error('Failed to create payment');

      toast.success("Pembayaran berhasil dicatat!");
      setIsDialogOpen(false);
      resetForm();
      loadPayments();
      loadInvoices();
    } catch (error) {
      console.error("Error creating payment:", error);
      toast.error("Gagal mencatat pembayaran");
    } finally {
      setIsLoading(false);
    }
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      invoice_id: "",
      customer_id: "",
      amount: "",
      method: "transfer",
      notes: "",
    });
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // Get status badge color
  const getStatusColor = (status: string) => {
    switch (status) {
      case "success":
        return "bg-success/10 text-success";
      case "pending":
        return "bg-warning/10 text-warning";
      case "failed":
        return "bg-destructive/10 text-destructive";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  // Get status text
  const getStatusText = (status: string) => {
    switch (status) {
      case "success":
        return "Berhasil";
      case "pending":
        return "Pending";
      case "failed":
        return "Gagal";
      default:
        return status;
    }
  };

  // Get method text
  const getMethodText = (method: string) => {
    const methods: { [key: string]: string } = {
      transfer: "Transfer Bank",
      cash: "Tunai",
      ewallet: "E-Wallet",
      qris: "QRIS",
    };
    return methods[method] || method;
  };

  return (
    <MainLayout>
      {/* Page Header */}
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Pembayaran</h1>
          <p className="text-muted-foreground">Riwayat dan kelola pembayaran pelanggan</p>
        </div>
        <Button 
          variant="gradient" 
          className="gap-2"
          onClick={() => {
            resetForm();
            setIsDialogOpen(true);
          }}
        >
          <Plus className="h-4 w-4" />
          Catat Pembayaran
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 sm:grid-cols-3 mb-6">
        <div className="rounded-xl gradient-primary p-6 text-primary-foreground shadow-soft">
          <p className="text-sm opacity-90">Total Diterima Bulan Ini</p>
          <p className="text-3xl font-bold mt-1">Rp {totalReceived.toLocaleString("id-ID")}</p>
          <p className="text-sm opacity-75 mt-2">{monthlyPayments.length} transaksi</p>
        </div>
        <div className="rounded-xl bg-card border border-border/50 p-6 shadow-soft">
          <p className="text-sm text-muted-foreground">Transaksi Sukses</p>
          <p className="text-3xl font-bold text-foreground mt-1">{successCount}</p>
          <p className="text-sm text-muted-foreground mt-2">Total transaksi berhasil</p>
        </div>
        <div className="rounded-xl bg-card border border-border/50 p-6 shadow-soft">
          <p className="text-sm text-muted-foreground">Menunggu Verifikasi</p>
          <p className="text-3xl font-bold text-warning mt-1">{pendingCount}</p>
          <p className="text-sm text-muted-foreground mt-2">Perlu dikonfirmasi</p>
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
      {isLoading && payments.length === 0 ? (
        <div className="rounded-xl bg-card border border-border/50 shadow-soft p-12 text-center">
          <p className="text-muted-foreground">Memuat data...</p>
        </div>
      ) : filteredPayments.length === 0 ? (
        <div className="rounded-xl bg-card border border-border/50 shadow-soft p-12 text-center animate-fade-in">
          <div className="flex justify-center mb-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              <CreditCard className="h-8 w-8 text-primary" />
            </div>
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-2">
            {searchQuery ? "Tidak ada hasil" : "Belum Ada Pembayaran"}
          </h3>
          <p className="text-muted-foreground mb-6">
            {searchQuery
              ? "Coba kata kunci lain untuk mencari pembayaran"
              : "Catat pembayaran pertama dari pelanggan Anda."}
          </p>
          {!searchQuery && (
            <Button 
              variant="gradient" 
              className="gap-2"
              onClick={() => {
                resetForm();
                setIsDialogOpen(true);
              }}
            >
              <Plus className="h-4 w-4" />
              Catat Pembayaran Pertama
            </Button>
          )}
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
                    Invoice
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
                {filteredPayments.map((payment) => (
                  <tr key={payment.id} className="border-b border-border hover:bg-muted/30 transition-colors">
                    <td className="px-6 py-4 text-sm font-medium text-foreground">
                      {payment.id}
                    </td>
                    <td className="px-6 py-4 text-sm text-foreground">
                      {payment.invoice_number}
                    </td>
                    <td className="px-6 py-4 text-sm text-foreground">
                      {payment.customer}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-foreground">
                      Rp {payment.amount?.toLocaleString("id-ID")}
                    </td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">
                      {getMethodText(payment.method)}
                    </td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">
                      {formatDate(payment.payment_date)}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusColor(
                          payment.status
                        )}`}
                      >
                        {getStatusText(payment.status)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Create Payment Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Catat Pembayaran Baru</DialogTitle>
            <DialogDescription>
              Catat pembayaran dari pelanggan
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="invoice">Invoice *</Label>
                <Select
                  value={formData.invoice_id}
                  onValueChange={handleInvoiceSelect}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih invoice yang belum dibayar" />
                  </SelectTrigger>
                  <SelectContent>
                    {invoices.length === 0 ? (
                      <div className="p-2 text-sm text-muted-foreground text-center">
                        Tidak ada invoice pending
                      </div>
                    ) : (
                      invoices.map((invoice) => (
                        <SelectItem key={invoice.id} value={invoice.id}>
                          {invoice.id} - {invoice.customer} (Rp {invoice.amount?.toLocaleString("id-ID")})
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="amount">Jumlah Pembayaran (Rp) *</Label>
                <Input
                  id="amount"
                  type="number"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  placeholder="150000"
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="method">Metode Pembayaran *</Label>
                <Select
                  value={formData.method}
                  onValueChange={(value) => setFormData({ ...formData, method: value })}
                  required
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="transfer">Transfer Bank</SelectItem>
                    <SelectItem value="cash">Tunai</SelectItem>
                    <SelectItem value="ewallet">E-Wallet</SelectItem>
                    <SelectItem value="qris">QRIS</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="notes">Catatan</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Catatan pembayaran..."
                  rows={3}
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
              >
                Batal
              </Button>
              <Button type="submit" variant="gradient" disabled={isLoading || invoices.length === 0}>
                {isLoading ? "Menyimpan..." : "Catat Pembayaran"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
}
