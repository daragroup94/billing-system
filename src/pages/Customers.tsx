import { useState } from "react";
import { Plus, Search, Filter, Users } from "lucide-react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface Customer {
  id: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  package: string;
  status: "active" | "inactive";
  joinDate: string;
  monthlyFee: string;
}

const customers: Customer[] = [];

export default function Customers() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredCustomers = customers.filter(
    (customer) =>
      customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <MainLayout>
      {/* Page Header */}
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Pelanggan</h1>
          <p className="text-muted-foreground">Kelola data pelanggan ISP Anda</p>
        </div>
        <Button variant="gradient" className="gap-2">
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
      {filteredCustomers.length === 0 ? (
        <div className="rounded-xl bg-card border border-border/50 shadow-soft p-12 text-center animate-fade-in">
          <div className="flex justify-center mb-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              <Users className="h-8 w-8 text-primary" />
            </div>
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-2">Belum Ada Pelanggan</h3>
          <p className="text-muted-foreground mb-6">
            Mulai tambahkan pelanggan pertama Anda untuk mengelola bisnis ISP.
          </p>
          <Button variant="gradient" className="gap-2">
            <Plus className="h-4 w-4" />
            Tambah Pelanggan Pertama
          </Button>
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
                {/* Data will be rendered here */}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </MainLayout>
  );
}
