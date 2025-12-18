import { AlertCircle, Calendar, Send } from "lucide-react";
import { Button } from "@/components/ui/button";

const invoices = [
  {
    id: "INV-001",
    customer: "Ahmad Fauzi",
    amount: "Rp 350.000",
    dueDate: "20 Des 2024",
    daysLeft: 2,
  },
  {
    id: "INV-002",
    customer: "Siti Rahayu",
    amount: "Rp 250.000",
    dueDate: "21 Des 2024",
    daysLeft: 3,
  },
  {
    id: "INV-003",
    customer: "Budi Santoso",
    amount: "Rp 500.000",
    dueDate: "22 Des 2024",
    daysLeft: 4,
  },
  {
    id: "INV-004",
    customer: "Dewi Lestari",
    amount: "Rp 350.000",
    dueDate: "15 Des 2024",
    daysLeft: -3,
  },
];

export function PendingInvoices() {
  return (
    <div className="rounded-xl bg-card p-6 shadow-soft border border-border/50 animate-slide-up">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h3 className="text-lg font-semibold text-foreground">Tagihan Pending</h3>
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-warning/10 text-xs font-bold text-warning">
            {invoices.length}
          </span>
        </div>
        <Button variant="outline" size="sm" className="gap-2">
          <Send className="h-4 w-4" />
          Kirim Pengingat
        </Button>
      </div>

      <div className="space-y-3">
        {invoices.map((invoice) => (
          <div
            key={invoice.id}
            className="flex items-center justify-between rounded-lg border border-border/50 p-4 transition-all hover:border-primary/30 hover:shadow-sm"
          >
            <div className="flex items-center gap-4">
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-lg ${
                  invoice.daysLeft < 0
                    ? "bg-destructive/10 text-destructive"
                    : invoice.daysLeft <= 2
                    ? "bg-warning/10 text-warning"
                    : "bg-primary/10 text-primary"
                }`}
              >
                {invoice.daysLeft < 0 ? (
                  <AlertCircle className="h-5 w-5" />
                ) : (
                  <Calendar className="h-5 w-5" />
                )}
              </div>
              <div>
                <p className="font-medium text-foreground">{invoice.customer}</p>
                <p className="text-sm text-muted-foreground">{invoice.id}</p>
              </div>
            </div>

            <div className="text-right">
              <p className="font-semibold text-foreground">{invoice.amount}</p>
              <p
                className={`text-sm ${
                  invoice.daysLeft < 0
                    ? "text-destructive"
                    : invoice.daysLeft <= 2
                    ? "text-warning"
                    : "text-muted-foreground"
                }`}
              >
                {invoice.daysLeft < 0
                  ? `Terlambat ${Math.abs(invoice.daysLeft)} hari`
                  : `${invoice.daysLeft} hari lagi`}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
