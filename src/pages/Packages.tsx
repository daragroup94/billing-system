import { useState, useEffect } from "react";
import { Plus, Wifi, Edit, Trash2, Users, Check } from "lucide-react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
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
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface Package {
  id: number;
  name: string;
  speed: string;
  price: number;
  description: string;
  features: string[];
  subscribers?: number;
  is_popular: boolean;
  is_active: boolean;
}

export default function Packages() {
  const [packages, setPackages] = useState<Package[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPackage, setEditingPackage] = useState<Package | null>(null);
  
  const [formData, setFormData] = useState({
    name: "",
    speed: "",
    price: "",
    description: "",
    features: [""],
    is_popular: false,
    is_active: true,
  });

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

  // Load packages
  const loadPackages = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`${API_URL}/packages`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      setPackages(data || []);
    } catch (error) {
      console.error("Error loading packages:", error);
      toast.error("Gagal memuat data paket");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadPackages();
  }, []);

  // Handle submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setIsLoading(true);
      
      const payload = {
        ...formData,
        price: parseFloat(formData.price),
        features: formData.features.filter(f => f.trim() !== ""),
      };

      const url = editingPackage 
        ? `${API_URL}/packages/${editingPackage.id}`
        : `${API_URL}/packages`;
      
      const method = editingPackage ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error('Failed to save package');

      toast.success(editingPackage ? "Paket berhasil diperbarui!" : "Paket berhasil ditambahkan!");
      setIsDialogOpen(false);
      resetForm();
      loadPackages();
    } catch (error) {
      console.error("Error saving package:", error);
      toast.error("Gagal menyimpan data paket");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle delete
  const handleDelete = async (id: number) => {
    if (!confirm("Apakah Anda yakin ingin menghapus paket ini?")) {
      return;
    }

    try {
      const response = await fetch(`${API_URL}/packages/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) throw new Error('Failed to delete package');

      toast.success("Paket berhasil dihapus!");
      loadPackages();
    } catch (error) {
      console.error("Error deleting package:", error);
      toast.error("Gagal menghapus paket");
    }
  };

  // Handle edit
  const handleEdit = (pkg: Package) => {
    setEditingPackage(pkg);
    setFormData({
      name: pkg.name,
      speed: pkg.speed,
      price: pkg.price.toString(),
      description: pkg.description || "",
      features: pkg.features || [""],
      is_popular: pkg.is_popular,
      is_active: pkg.is_active,
    });
    setIsDialogOpen(true);
  };

  // Reset form
  const resetForm = () => {
    setEditingPackage(null);
    setFormData({
      name: "",
      speed: "",
      price: "",
      description: "",
      features: [""],
      is_popular: false,
      is_active: true,
    });
  };

  // Add feature field
  const addFeature = () => {
    setFormData({
      ...formData,
      features: [...formData.features, ""],
    });
  };

  // Remove feature field
  const removeFeature = (index: number) => {
    const newFeatures = formData.features.filter((_, i) => i !== index);
    setFormData({ ...formData, features: newFeatures });
  };

  // Update feature
  const updateFeature = (index: number, value: string) => {
    const newFeatures = [...formData.features];
    newFeatures[index] = value;
    setFormData({ ...formData, features: newFeatures });
  };

  return (
    <MainLayout>
      {/* Page Header */}
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Paket Internet</h1>
          <p className="text-muted-foreground">Kelola paket layanan internet Anda</p>
        </div>
        <Button variant="gradient" className="gap-2" onClick={() => {
          resetForm();
          setIsDialogOpen(true);
        }}>
          <Plus className="h-4 w-4" />
          Tambah Paket
        </Button>
      </div>

      {/* Loading or Empty State or Package Cards */}
      {isLoading && packages.length === 0 ? (
        <div className="rounded-xl bg-card border border-border/50 shadow-soft p-12 text-center">
          <p className="text-muted-foreground">Memuat data...</p>
        </div>
      ) : packages.length === 0 ? (
        <div className="rounded-xl bg-card border border-border/50 shadow-soft p-12 text-center animate-fade-in">
          <div className="flex justify-center mb-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              <Wifi className="h-8 w-8 text-primary" />
            </div>
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-2">Belum Ada Paket</h3>
          <p className="text-muted-foreground mb-6">
            Buat paket internet pertama untuk ditawarkan kepada pelanggan.
          </p>
          <Button variant="gradient" className="gap-2" onClick={() => {
            resetForm();
            setIsDialogOpen(true);
          }}>
            <Plus className="h-4 w-4" />
            Buat Paket Pertama
          </Button>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {packages.map((pkg) => (
            <Card 
              key={pkg.id} 
              className={`border-border/50 shadow-soft transition-all hover:shadow-lg ${
                pkg.is_popular ? 'border-primary ring-2 ring-primary/20' : ''
              }`}
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-xl">{pkg.name}</CardTitle>
                    <CardDescription className="text-lg font-semibold text-foreground mt-1">
                      {pkg.speed}
                    </CardDescription>
                  </div>
                  {pkg.is_popular && (
                    <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold bg-primary text-primary-foreground">
                      Popular
                    </span>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-3xl font-bold text-foreground">
                    Rp {pkg.price.toLocaleString("id-ID")}
                    <span className="text-sm font-normal text-muted-foreground">/bulan</span>
                  </p>
                </div>
                
                {pkg.description && (
                  <p className="text-sm text-muted-foreground">{pkg.description}</p>
                )}

                <div className="space-y-2">
                  {Array.isArray(pkg.features) && pkg.features.map((feature, index) => (
                    <div key={index} className="flex items-start gap-2">
                      <Check className="h-4 w-4 text-success mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-foreground">{feature}</span>
                    </div>
                  ))}
                </div>

                <div className="flex items-center gap-2 pt-2 border-t">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    {pkg.subscribers || 0} Pelanggan
                  </span>
                </div>
              </CardContent>
              <CardFooter className="flex gap-2">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => handleEdit(pkg)}
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </Button>
                <Button
                  variant="outline"
                  className="text-destructive hover:text-destructive"
                  onClick={() => handleDelete(pkg.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {/* Add/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingPackage ? "Edit Paket" : "Tambah Paket Baru"}
            </DialogTitle>
            <DialogDescription>
              {editingPackage
                ? "Perbarui informasi paket internet"
                : "Buat paket internet baru untuk pelanggan"}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Nama Paket *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Basic, Standard, Premium"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="speed">Kecepatan *</Label>
                  <Input
                    id="speed"
                    value={formData.speed}
                    onChange={(e) => setFormData({ ...formData, speed: e.target.value })}
                    placeholder="10 Mbps"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="price">Harga/Bulan (Rp) *</Label>
                  <Input
                    id="price"
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    placeholder="150000"
                    required
                  />
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="description">Deskripsi</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Paket internet untuk browsing"
                  rows={3}
                />
              </div>

              <div className="grid gap-2">
                <Label>Fitur</Label>
                {formData.features.map((feature, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      value={feature}
                      onChange={(e) => updateFeature(index, e.target.value)}
                      placeholder="e.g. Unlimited kuota"
                    />
                    {formData.features.length > 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => removeFeature(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addFeature}
                  className="w-fit"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Tambah Fitur
                </Button>
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Paket Popular</Label>
                  <p className="text-sm text-muted-foreground">
                    Tandai sebagai paket rekomendasi
                  </p>
                </div>
                <Switch
                  checked={formData.is_popular}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, is_popular: checked })
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Status Aktif</Label>
                  <p className="text-sm text-muted-foreground">
                    Paket dapat dipilih pelanggan
                  </p>
                </div>
                <Switch
                  checked={formData.is_active}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, is_active: checked })
                  }
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
                {isLoading ? "Menyimpan..." : "Simpan"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
}
