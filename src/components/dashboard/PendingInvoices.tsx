import { FileText, Send } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Invoice {
  id: string;
  customer: string;
  amount: string;
  dueDate: string;
  daysLeft: number;
}

const invoices: Invoice[] = [];

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

      {invoices.length === 0 ? (
        <div className="py-8 text-center">
          <div className="flex justify-center mb-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <FileText className="h-6 w-6 text-primary" />
            </div>
          </div>
          <p className="text-muted-foreground">Tidak ada tagihan pending</p>
        </div>
      ) : (
        <div className="space-y-3">
          {/* Invoices will be rendered here */}
        </div>
      )}
    </div>
  );
}
