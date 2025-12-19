import { useState, useEffect } from "react";
import { Plus, Search, Filter, Users, Edit, Trash2, Eye } from "lucide-react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/sonner";
import { customerAPI } from "@/lib/api";

interface Customer {
  id: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  package_id: number;
  package_name?: string;
  package_speed?: string;
  status: "active" | "inactive";
  join_date: string;
  monthly_fee: number;
}

interface Package {
  id: number;
  name: string;
  speed: string;
  price: number;
}

export default function Customers() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [packages, setPackages] = useState<Package[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  
  // Form state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    package_id: "",
    status: "active",
  });

  // Load customers
  const loadCustomers = async () => {
    try {
      setIsLoading(true);
      const response = await customerAPI.getAll({ search: searchQuery });
      setCustomers(response.data.data || []);
    } catch (error) {
      console.error("Error loading customers:", error);
      toast.error("Gagal memuat data pelanggan");
    } finally {
      setIsLoading(false);
    }
  };

  // Load packages
  const loadPackages = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3000/api'}/packages`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      setPackages(data || []);
    } catch (error) {
      console.error("Error loading packages:", error);
    }
  };

  useEffect(() => {
    loadCustomers();
    loadPackages();
  }, [searchQuery]);

  const filteredCustomers = customers.filter(
    (customer) =>
      customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.phone.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Handle form submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setIsLoading(true);
      
      if (editingCustomer) {
        // Update existing customer
        await customerAPI.update(editingCustomer.id, formData);
        toast.success("Pelanggan berhasil diperbarui!");
      } else {
        // Create new customer
        await customerAPI.create(formData);
        toast.success("Pelanggan berhasil ditambahkan!");
      }
      
      setIsDialogOpen(false);
      resetForm();
      loadCustomers();
    } catch (error: any) {
      console.error("Error saving customer:", error);
      toast.error(error.response?.data?.error || "Gagal menyimpan data pelanggan");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle delete
  const handleDelete = async (id: number) => {
    if (!confirm("Apakah Anda yakin ingin menghapus pelanggan ini?")) {
      return;
    }

    try {
      await customerAPI.delete(id);
      toast.success("Pelanggan berhasil dihapus!");
      loadCustomers();
    } catch (error) {
      console.error("Error deleting customer:", error);
      toast.error("Gagal menghapus pelanggan");
    }
  };

  // Handle edit
  const handleEdit = (customer: Customer) => {
    setEditingCustomer(customer);
    setFormData({
      name: customer.name,
      email: customer.email || "",
      phone: customer.phone,
      address: customer.address,
      package_id: customer.package_id.toString(),
      status: customer.status,
    });
    setIsDialogOpen(true);
  };

  // Reset form
  const resetForm = () => {
    setEditingCustomer(null);
    setFormData({
      name: "",
      email: "",
      phone: "",
      address: "",
      package_id: "",
      status: "active",
    });
  };

  // Open add dialog
  const handleAddClick = () => {
    resetForm();
    setIsDialogOpen(true);
  };

  return (
    <MainLayout>
      {/* Page Header */}
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Pelanggan</h1>
          <p className="text-muted-foreground">Kelola data pelanggan ISP Anda</p>
        </div>
        <Button variant="gradient" className="gap-2" onClick={handleAddClick}>
          <Plus className="h-4 w-4" />
          Tambah Pelanggan
        </Button>
      </div>

      {/* Filters */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Cari pelanggan..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button variant="outline" className="gap-2">
          <Filter className="h-4 w-4" />
          Filter
        </Button>
      </div>

      {/* Empty State or Table */}
      {isLoading ? (
        <div className="rounded-xl bg-card border border-border/50 shadow-soft p-12 text-center">
          <p className="text-muted-foreground">Memuat data...</p>
        </div>
      ) : filteredCustomers.length === 0 ? (
        <div className="rounded-xl bg-card border border-border/50 shadow-soft p-12 text-center animate-fade-in">
          <div className="flex justify-center mb-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              <Users className="h-8 w-8 text-primary" />
            </div>
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-2">
            {searchQuery ? "Tidak ada hasil" : "Belum Ada Pelanggan"}
          </h3>
          <p className="text-muted-foreground mb-6">
            {searchQuery 
              ? "Coba kata kunci lain untuk mencari pelanggan"
              : "Mulai tambahkan pelanggan pertama Anda untuk mengelola bisnis ISP."}
          </p>
          {!searchQuery && (
            <Button variant="gradient" className="gap-2" onClick={handleAddClick}>
              <Plus className="h-4 w-4" />
              Tambah Pelanggan Pertama
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
                    Pelanggan
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                    Kontak
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                    Paket
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                    Biaya/Bulan
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
                {filteredCustomers.map((customer) => (
                  <tr
                    key={customer.id}
                    className="border-b border-border hover:bg-muted/30 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium text-foreground">{customer.name}</p>
                        <p className="text-sm text-muted-foreground">{customer.address}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-sm text-foreground">{customer.phone}</p>
                        {customer.email && (
                          <p className="text-sm text-muted-foreground">{customer.email}</p>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium text-foreground">
                          {customer.package_name || "-"}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {customer.package_speed || "-"}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-medium text-foreground">
                        Rp {customer.monthly_fee?.toLocaleString("id-ID")}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          customer.status === "active"
                            ? "bg-success/10 text-success"
                            : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {customer.status === "active" ? "Aktif" : "Non-Aktif"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(customer)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(customer.id)}
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

      {/* Add/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {editingCustomer ? "Edit Pelanggan" : "Tambah Pelanggan Baru"}
            </DialogTitle>
            <DialogDescription>
              {editingCustomer
                ? "Perbarui informasi pelanggan"
                : "Masukkan data pelanggan baru"}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Nama Lengkap *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="John Doe"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  placeholder="john@example.com"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="phone">Nomor Telepon *</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  placeholder="081234567890"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="address">Alamat *</Label>
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) =>
                    setFormData({ ...formData, address: e.target.value })
                  }
                  placeholder="Jl. Contoh No. 123"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="package">Paket Internet *</Label>
                <Select
                  value={formData.package_id}
                  onValueChange={(value) =>
                    setFormData({ ...formData, package_id: value })
                  }
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih paket" />
                  </SelectTrigger>
                  <SelectContent>
                    {packages.map((pkg) => (
                      <SelectItem key={pkg.id} value={pkg.id.toString()}>
                        {pkg.name} - {pkg.speed} - Rp{" "}
                        {pkg.price.toLocaleString("id-ID")}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="status">Status *</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value: "active" | "inactive") =>
                    setFormData({ ...formData, status: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Aktif</SelectItem>
                    <SelectItem value="inactive">Non-Aktif</SelectItem>
                  </SelectContent>
                </Select>
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
                {isLoading ? "Menyimpan..." : "Simpan"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
}
