import { Plus, Wifi } from "lucide-react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";

interface Package {
  id: number;
  name: string;
  speed: string;
  price: string;
  description: string;
  features: string[];
  subscribers: number;
  popular: boolean;
}

const packages: Package[] = [];

export default function Packages() {
  return (
    <MainLayout>
      {/* Page Header */}
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Paket Internet</h1>
          <p className="text-muted-foreground">Kelola paket layanan internet Anda</p>
        </div>
        <Button variant="gradient" className="gap-2">
          <Plus className="h-4 w-4" />
          Tambah Paket
        </Button>
      </div>

      {/* Empty State or Package Cards */}
      {packages.length === 0 ? (
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
          <Button variant="gradient" className="gap-2">
            <Plus className="h-4 w-4" />
            Buat Paket Pertama
          </Button>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Package cards will be rendered here */}
        </div>
      )}
    </MainLayout>
  );
}
