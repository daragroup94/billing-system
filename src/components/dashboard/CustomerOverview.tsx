import { TrendingUp, TrendingDown, Minus } from "lucide-react";

const customerData = [
  { month: "Jul", count: 180 },
  { month: "Aug", count: 195 },
  { month: "Sep", count: 210 },
  { month: "Oct", count: 225 },
  { month: "Nov", count: 248 },
  { month: "Des", count: 267 },
];

const maxCount = Math.max(...customerData.map((d) => d.count));

export function CustomerOverview() {
  const growth = (
    ((customerData[customerData.length - 1].count - customerData[customerData.length - 2].count) /
      customerData[customerData.length - 2].count) *
    100
  ).toFixed(1);

  return (
    <div className="rounded-xl bg-card p-6 shadow-soft border border-border/50 animate-slide-up">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Pertumbuhan Pelanggan</h3>
          <p className="text-sm text-muted-foreground">6 bulan terakhir</p>
        </div>
        <div className="flex items-center gap-1.5 rounded-full bg-success/10 px-3 py-1 text-sm font-medium text-success">
          <TrendingUp className="h-4 w-4" />
          +{growth}%
        </div>
      </div>

      {/* Simple Bar Chart */}
      <div className="flex items-end justify-between gap-2 h-40">
        {customerData.map((item, index) => (
          <div key={item.month} className="flex flex-1 flex-col items-center gap-2">
            <div className="relative w-full flex justify-center">
              <div
                className="w-8 rounded-t-md gradient-primary transition-all duration-500 hover:opacity-80"
                style={{
                  height: `${(item.count / maxCount) * 120}px`,
                  animationDelay: `${index * 100}ms`,
                }}
              />
            </div>
            <span className="text-xs font-medium text-muted-foreground">{item.month}</span>
          </div>
        ))}
      </div>

      {/* Stats */}
      <div className="mt-6 grid grid-cols-3 gap-4 border-t border-border pt-4">
        <div className="text-center">
          <p className="text-2xl font-bold text-foreground">267</p>
          <p className="text-xs text-muted-foreground">Total Aktif</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-success">19</p>
          <p className="text-xs text-muted-foreground">Baru Bulan Ini</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-warning">5</p>
          <p className="text-xs text-muted-foreground">Non-Aktif</p>
        </div>
      </div>
    </div>
  );
}
