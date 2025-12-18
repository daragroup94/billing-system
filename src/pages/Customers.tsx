import { useState } from "react";
import { Plus, Search, Filter, MoreVertical, CheckCircle, XCircle, Edit, Trash2 } from "lucide-react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

const customers = [
  {
    id: 1,
    name: "Ahmad Fauzi",
    email: "ahmad@email.com",
    phone: "081234567890",
    address: "Jl. Merdeka No. 123, Jakarta",
    package: "Premium 50 Mbps",
    status: "active",
    joinDate: "12 Jan 2024",
    monthlyFee: "Rp 350.000",
  },
  {
    id: 2,
    name: "Siti Rahayu",
    email: "siti@email.com",
    phone: "081234567891",
    address: "Jl. Sudirman No. 45, Jakarta",
    package: "Basic 20 Mbps",
    status: "active",
    joinDate: "15 Feb 2024",
    monthlyFee: "Rp 250.000",
  },
  {
    id: 3,
    name: "Budi Santoso",
    email: "budi@email.com",
    phone: "081234567892",
    address: "Jl. Gatot Subroto No. 78, Jakarta",
    package: "Business 100 Mbps",
    status: "active",
    joinDate: "20 Mar 2024",
    monthlyFee: "Rp 500.000",
  },
  {
    id: 4,
    name: "Dewi Lestari",
    email: "dewi@email.com",
    phone: "081234567893",
    address: "Jl. Kuningan No. 90, Jakarta",
    package: "Premium 50 Mbps",
    status: "inactive",
    joinDate: "05 Apr 2024",
    monthlyFee: "Rp 350.000",
  },
  {
    id: 5,
    name: "Rudi Hermawan",
    email: "rudi@email.com",
    phone: "081234567894",
    address: "Jl. Thamrin No. 12, Jakarta",
    package: "Basic 20 Mbps",
    status: "active",
    joinDate: "10 May 2024",
    monthlyFee: "Rp 250.000",
  },
  {
    id: 6,
    name: "Rina Wati",
    email: "rina@email.com",
    phone: "081234567895",
    address: "Jl. Rasuna Said No. 34, Jakarta",
    package: "Premium 50 Mbps",
    status: "active",
    joinDate: "22 Jun 2024",
    monthlyFee: "Rp 350.000",
  },
];

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

      {/* Table */}
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
                  className="border-b border-border/50 transition-colors hover:bg-muted/30"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 font-semibold text-primary">
                        {customer.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{customer.name}</p>
                        <p className="text-sm text-muted-foreground">
                          Bergabung {customer.joinDate}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-foreground">{customer.email}</p>
                    <p className="text-sm text-muted-foreground">{customer.phone}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className="rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
                      {customer.package}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-medium text-foreground">{customer.monthlyFee}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={cn(
                        "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-medium",
                        customer.status === "active"
                          ? "bg-success/10 text-success"
                          : "bg-destructive/10 text-destructive"
                      )}
                    >
                      {customer.status === "active" ? (
                        <CheckCircle className="h-3.5 w-3.5" />
                      ) : (
                        <XCircle className="h-3.5 w-3.5" />
                      )}
                      {customer.status === "active" ? "Aktif" : "Non-Aktif"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem className="gap-2">
                          <Edit className="h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem className="gap-2 text-destructive">
                          <Trash2 className="h-4 w-4" />
                          Hapus
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </MainLayout>
  );
}
