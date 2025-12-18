import { Users } from "lucide-react";

interface CustomerData {
  month: string;
  count: number;
}

const customerData: CustomerData[] = [];

export function CustomerOverview() {
  return (
    <div className="rounded-xl bg-card p-6 shadow-soft border border-border/50 animate-slide-up">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Pertumbuhan Pelanggan</h3>
          <p className="text-sm text-muted-foreground">6 bulan terakhir</p>
        </div>
      </div>

      {customerData.length === 0 ? (
        <div className="py-8 text-center">
          <div className="flex justify-center mb-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <Users className="h-6 w-6 text-primary" />
            </div>
          </div>
          <p className="text-muted-foreground">Belum ada data pertumbuhan pelanggan</p>
        </div>
      ) : (
        <div className="flex items-end justify-between gap-2 h-40">
          {/* Chart will be rendered here */}
        </div>
      )}

      {/* Stats */}
      <div className="mt-6 grid grid-cols-3 gap-4 border-t border-border pt-4">
        <div className="text-center">
          <p className="text-2xl font-bold text-foreground">0</p>
          <p className="text-xs text-muted-foreground">Total Aktif</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-success">0</p>
          <p className="text-xs text-muted-foreground">Baru Bulan Ini</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-warning">0</p>
          <p className="text-xs text-muted-foreground">Non-Aktif</p>
        </div>
      </div>
    </div>
  );
}
