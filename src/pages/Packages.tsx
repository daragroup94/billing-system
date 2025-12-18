import { Plus, Edit, Trash2, Wifi, Users, Zap, Crown } from "lucide-react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const packages = [
  {
    id: 1,
    name: "Basic",
    speed: "20 Mbps",
    price: "Rp 250.000",
    description: "Cocok untuk penggunaan rumah tangga dengan kebutuhan internet dasar",
    features: ["Download hingga 20 Mbps", "Upload hingga 5 Mbps", "Kuota Unlimited", "Support 24/7"],
    subscribers: 89,
    icon: Wifi,
    color: "bg-muted",
    popular: false,
  },
  {
    id: 2,
    name: "Premium",
    speed: "50 Mbps",
    price: "Rp 350.000",
    description: "Ideal untuk keluarga dengan multiple device dan streaming HD",
    features: ["Download hingga 50 Mbps", "Upload hingga 15 Mbps", "Kuota Unlimited", "Priority Support", "Free Router"],
    subscribers: 124,
    icon: Zap,
    color: "gradient-primary",
    popular: true,
  },
  {
    id: 3,
    name: "Business",
    speed: "100 Mbps",
    price: "Rp 500.000",
    description: "Solusi terbaik untuk bisnis dengan kebutuhan bandwidth tinggi",
    features: ["Download hingga 100 Mbps", "Upload hingga 50 Mbps", "Kuota Unlimited", "Dedicated Support", "Static IP", "SLA 99.9%"],
    subscribers: 54,
    icon: Crown,
    color: "bg-foreground",
    popular: false,
  },
];

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

      {/* Package Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {packages.map((pkg) => {
          const Icon = pkg.icon;

          return (
            <div
              key={pkg.id}
              className={cn(
                "relative rounded-2xl bg-card border border-border/50 p-6 shadow-soft transition-all duration-300 hover:shadow-lg hover:border-primary/30 animate-scale-in",
                pkg.popular && "ring-2 ring-primary"
              )}
            >
              {pkg.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="rounded-full gradient-primary px-4 py-1 text-xs font-bold text-primary-foreground shadow-soft">
                    POPULER
                  </span>
                </div>
              )}

              {/* Header */}
              <div className="flex items-start justify-between mb-6">
                <div
                  className={cn(
                    "flex h-14 w-14 items-center justify-center rounded-xl",
                    pkg.color,
                    pkg.color === "gradient-primary" && "text-primary-foreground",
                    pkg.color === "bg-foreground" && "text-background",
                    pkg.color === "bg-muted" && "text-foreground"
                  )}
                >
                  <Icon className="h-7 w-7" />
                </div>
                <div className="flex gap-1">
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Info */}
              <div className="mb-6">
                <h3 className="text-xl font-bold text-foreground">{pkg.name}</h3>
                <p className="text-3xl font-bold text-primary mt-2">
                  {pkg.price}
                  <span className="text-sm font-normal text-muted-foreground">/bulan</span>
                </p>
                <p className="text-sm text-muted-foreground mt-2">{pkg.description}</p>
              </div>

              {/* Speed Badge */}
              <div className="mb-6">
                <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-semibold text-primary">
                  <Wifi className="h-4 w-4" />
                  {pkg.speed}
                </span>
              </div>

              {/* Features */}
              <ul className="space-y-3 mb-6">
                {pkg.features.map((feature, index) => (
                  <li key={index} className="flex items-center gap-3 text-sm text-muted-foreground">
                    <div className="flex h-5 w-5 items-center justify-center rounded-full bg-success/10">
                      <svg
                        className="h-3 w-3 text-success"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={3}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </div>
                    {feature}
                  </li>
                ))}
              </ul>

              {/* Subscribers */}
              <div className="flex items-center gap-2 pt-4 border-t border-border">
                <Users className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  <span className="font-semibold text-foreground">{pkg.subscribers}</span> pelanggan aktif
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </MainLayout>
  );
}
