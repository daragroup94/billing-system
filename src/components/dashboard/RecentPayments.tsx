import { CheckCircle, Clock, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";

const payments = [
  {
    id: 1,
    customer: "Ahmad Fauzi",
    amount: "Rp 350.000",
    date: "18 Des 2024",
    status: "success",
    package: "Premium 50 Mbps",
  },
  {
    id: 2,
    customer: "Siti Rahayu",
    amount: "Rp 250.000",
    date: "18 Des 2024",
    status: "pending",
    package: "Basic 20 Mbps",
  },
  {
    id: 3,
    customer: "Budi Santoso",
    amount: "Rp 500.000",
    date: "17 Des 2024",
    status: "success",
    package: "Business 100 Mbps",
  },
  {
    id: 4,
    customer: "Dewi Lestari",
    amount: "Rp 350.000",
    date: "17 Des 2024",
    status: "failed",
    package: "Premium 50 Mbps",
  },
  {
    id: 5,
    customer: "Rudi Hermawan",
    amount: "Rp 250.000",
    date: "16 Des 2024",
    status: "success",
    package: "Basic 20 Mbps",
  },
];

const statusConfig = {
  success: {
    label: "Lunas",
    icon: CheckCircle,
    className: "text-success bg-success/10",
  },
  pending: {
    label: "Pending",
    icon: Clock,
    className: "text-warning bg-warning/10",
  },
  failed: {
    label: "Gagal",
    icon: XCircle,
    className: "text-destructive bg-destructive/10",
  },
};

export function RecentPayments() {
  return (
    <div className="rounded-xl bg-card p-6 shadow-soft border border-border/50 animate-slide-up">
      <div className="mb-6 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-foreground">Pembayaran Terbaru</h3>
        <button className="text-sm font-medium text-primary hover:underline">
          Lihat Semua
        </button>
      </div>

      <div className="space-y-4">
        {payments.map((payment) => {
          const status = statusConfig[payment.status as keyof typeof statusConfig];
          const StatusIcon = status.icon;

          return (
            <div
              key={payment.id}
              className="flex items-center justify-between rounded-lg p-3 transition-colors hover:bg-muted/50"
            >
              <div className="flex items-center gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 font-semibold text-primary">
                  {payment.customer.charAt(0)}
                </div>
                <div>
                  <p className="font-medium text-foreground">{payment.customer}</p>
                  <p className="text-sm text-muted-foreground">{payment.package}</p>
                </div>
              </div>

              <div className="text-right">
                <p className="font-semibold text-foreground">{payment.amount}</p>
                <div className="flex items-center justify-end gap-1.5 mt-1">
                  <span
                    className={cn(
                      "flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium",
                      status.className
                    )}
                  >
                    <StatusIcon className="h-3 w-3" />
                    {status.label}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
