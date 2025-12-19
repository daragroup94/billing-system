import { useState, useEffect } from "react";
import { Plus, Search, Filter, Download, FileText, Eye, Check, Trash2 } from "lucide-react";
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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

interface Invoice {
  id: string;
  customer_id: number;
  customer: string;
  package_id: number;
  package: string;
  amount: number;
  issue_date: string;
  due_date: string;
  status: "paid" | "pending" | "overdue";
  notes?: string;
}

interface Customer {
  id: number;
  name: string;
  package_id: number;
  package_name: string;
  monthly_fee: number;
}

export default function Invoices() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [viewInvoice, setViewInvoice] = useState<Invoice | null>(null);
  const [deleteInvoiceId, setDeleteInvoiceId] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    customer_id: "",
    package_id: "",
    amount: "",
    due_date: "",
    notes: "",
  });

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

  // Load invoices
  const loadInvoices = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`${API_URL}/invoices?search=${searchQuery}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      setInvoices(data.data || []);
    } catch (error) {
      console.error("Error loading invoices:", error);
      toast.error("Gagal memuat data tagihan");
    } finally {
      setIsLoading(false);
    }
  };

  // Load customers
  const loadCustomers = async () => {
    try {
      const response = await fetch(`${API_URL}/customers`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      setCustomers(data.data || []);
    } catch (error) {
      console.error("Error loading customers:", error);
    }
  };

  useEffect(() => {
    loadInvoices();
    loadCustomers();
  }, [searchQuery]);

  const filteredInvoices = invoices.filter(
    (invoice) =>
      invoice.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      invoice.customer?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const stats = {
    total: invoices.length,
    paid: invoices.filter((i) => i.status === "paid").length,
    pending: invoices.filter((i) => i.status === "pending").length,
    overdue: invoices.filter((i) => i.status === "overdue").length,
  };

  // Handle customer selection
  const handleCustomerSelect = (customerId: string) => {
    const customer = customers.find(c => c.id.toString() === customerId);
    if (customer) {
      const dueDate = new Date();
      dueDate.setDate(dueDate.getDate() + 7);
      
      setFormData({
        customer_id: customerId,
        package_id: customer.package_id.toString(),
        amount: customer.monthly_fee.toString(),
        due_date: dueDate.toISOString().split('T')[0],
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
        customer_id: parseInt(formData.customer_id),
        package_id: parseInt(formData.package_id),
        amount: parseFloat(formData.amount),
        due_date: formData.due_date,
        notes: formData.notes,
      };

      const response = await fetch(`${API_URL}/invoices`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error('Failed to create invoice');

      toast.success("Tagihan berhasil dibuat!");
      setIsDialogOpen(false);
      resetForm();
      loadInvoices();
    } catch (error) {
      console.error("Error creating invoice:", error);
      toast.error("Gagal membuat tagihan");
    } finally {
      setIsLoading(false);
    }
  };

  // Mark as paid
  const handleMarkAsPaid = async (invoiceId: string) => {
    try {
      const response = await fetch(`${API_URL}/invoices/${invoiceId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ status: 'paid' }),
      });

      if (!response.ok) throw new Error('Failed to update invoice');

      toast.success("Invoice berhasil ditandai lunas!");
      loadInvoices();
    } catch (error) {
      console.error("Error updating invoice:", error);
      toast.error("Gagal mengupdate invoice");
    }
  };

  // Delete invoice
  const handleDelete = async () => {
    if (!deleteInvoiceId) return;

    try {
      const response = await fetch(`${API_URL}/invoices/${deleteInvoiceId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
      });

      if (!response.ok) throw new Error('Failed to delete invoice');

      toast.success("Invoice berhasil dihapus!");
      setDeleteInvoiceId(null);
      loadInvoices();
    } catch (error) {
      console.error("Error deleting invoice:", error);
      toast.error("Gagal menghapus invoice");
    }
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      customer_id: "",
      package_id: "",
      amount: "",
      due_date: "",
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
      case "paid":
        return "bg-success/10 text-success";
      case "pending":
        return "bg-warning/10 text-warning";
      case "overdue":
        return "bg-destructive/10 text-destructive";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  // Get status text
  const getStatusText = (status: string) => {
    switch (status) {
      case "paid":
        return "Lunas";
      case "pending":
        return "Pending";
      case "overdue":
        return "Jatuh Tempo";
      default:
        return status;
    }
  };

  return (
    <MainLayout>
      {/* Page Header */}
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Tagihan</h1>
          <p className="text-muted-foreground">Kelola tagihan dan invoice pelanggan</p>
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
      {isLoading && invoices.length === 0 ? (
        <div className="rounded-xl bg-card border border-border/50 shadow-soft p-12 text-center">
          <p className="text-muted-foreground">Memuat data...</p>
        </div>
      ) : filteredInvoices.length === 0 ? (
        <div className="rounded-xl bg-card border border-border/50 shadow-soft p-12 text-center animate-fade-in">
          <div className="flex justify-center mb-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              <FileText className="h-8 w-8 text-primary" />
            </div>
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-2">
            {searchQuery ? "Tidak ada hasil" : "Belum Ada Tagihan"}
          </h3>
          <p className="text-muted-foreground mb-6">
            {searchQuery
              ? "Coba kata kunci lain untuk mencari tagihan"
              : "Buat tagihan pertama untuk mulai mengelola pembayaran pelanggan."}
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
              Buat Tagihan Pertama
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
                      Rp {invoice.amount?.toLocaleString("id-ID")}
                    </td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">
                      {formatDate(invoice.due_date)}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusColor(
                          invoice.status
                        )}`}
                      >
                        {getStatusText(invoice.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => setViewInvoice(invoice)}
                          title="Lihat Detail"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        {invoice.status !== 'paid' && (
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleMarkAsPaid(invoice.id)}
                            title="Tandai Lunas"
                            className="text-success hover:text-success"
                          >
                            <Check className="h-4 w-4" />
                          </Button>
                        )}
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => setDeleteInvoiceId(invoice.id)}
                          title="Hapus"
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Create Invoice Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Buat Tagihan Baru</DialogTitle>
            <DialogDescription>
              Buat tagihan untuk pelanggan
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="customer">Pelanggan *</Label>
                <Select
                  value={formData.customer_id}
                  onValueChange={handleCustomerSelect}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih pelanggan" />
                  </SelectTrigger>
                  <SelectContent>
                    {customers.map((customer) => (
                      <SelectItem key={customer.id} value={customer.id.toString()}>
                        {customer.name} - {customer.package_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="amount">Jumlah Tagihan (Rp) *</Label>
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
                <Label htmlFor="due_date">Tanggal Jatuh Tempo *</Label>
                <Input
                  id="due_date"
                  type="date"
                  value={formData.due_date}
                  onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="notes">Catatan</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Catatan tambahan..."
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
              <Button type="submit" variant="gradient" disabled={isLoading}>
                {isLoading ? "Membuat..." : "Buat Tagihan"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* View Invoice Dialog */}
      <Dialog open={!!viewInvoice} onOpenChange={() => setViewInvoice(null)}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Detail Invoice</DialogTitle>
            <DialogDescription>
              Informasi lengkap tagihan
            </DialogDescription>
          </DialogHeader>
          {viewInvoice && (
            <div className="space-y-4">
              <div>
                <Label className="text-muted-foreground">Invoice ID</Label>
                <p className="font-medium">{viewInvoice.id}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Pelanggan</Label>
                <p className="font-medium">{viewInvoice.customer}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Paket</Label>
                <p className="font-medium">{viewInvoice.package}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Jumlah</Label>
                <p className="font-medium text-lg">Rp {viewInvoice.amount?.toLocaleString("id-ID")}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Jatuh Tempo</Label>
                <p className="font-medium">{formatDate(viewInvoice.due_date)}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Status</Label>
                <p>
                  <span
                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusColor(
                      viewInvoice.status
                    )}`}
                  >
                    {getStatusText(viewInvoice.status)}
                  </span>
                </p>
              </div>
              {viewInvoice.notes && (
                <div>
                  <Label className="text-muted-foreground">Catatan</Label>
                  <p className="text-sm">{viewInvoice.notes}</p>
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button onClick={() => setViewInvoice(null)}>Tutup</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteInvoiceId} onOpenChange={() => setDeleteInvoiceId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Invoice?</AlertDialogTitle>
            <AlertDialogDescription>
              Tindakan ini tidak dapat dibatalkan. Invoice akan dihapus permanen dari sistem.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </MainLayout>
  );
}
