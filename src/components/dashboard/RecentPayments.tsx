import { CreditCard } from "lucide-react";

interface Payment {
  id: number;
  customer: string;
  amount: string;
  date: string;
  status: "success" | "pending" | "failed";
  package: string;
}

const payments: Payment[] = [];

export function RecentPayments() {
  return (
    <div className="rounded-xl bg-card p-6 shadow-soft border border-border/50 animate-slide-up">
      <div className="mb-6 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-foreground">Pembayaran Terbaru</h3>
        <button className="text-sm font-medium text-primary hover:underline">
          Lihat Semua
        </button>
      </div>

      {payments.length === 0 ? (
        <div className="py-8 text-center">
          <div className="flex justify-center mb-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <CreditCard className="h-6 w-6 text-primary" />
            </div>
          </div>
          <p className="text-muted-foreground">Belum ada pembayaran terbaru</p>
        </div>
      ) : (
        <div className="space-y-4">
          {payments.map((payment) => (
            <div key={payment.id} className="flex items-center justify-between">
              <div>
                <p className="font-medium text-foreground">{payment.customer}</p>
                <p className="text-sm text-muted-foreground">{payment.date}</p>
              </div>
              <div>
                <p className="font-medium text-foreground">{payment.amount}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
