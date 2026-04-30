import { type LucideIcon, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { Card } from "./ui/Card";

interface StatsCardProps {
  label: string;
  value: string;
  trend: string;
  isUp: boolean;
  icon: LucideIcon;
  color: string;
  bg: string;
}

export function StatsCard({ label, value, trend, isUp, icon: Icon, color, bg }: StatsCardProps) {
  return (
    <Card className="relative group overflow-hidden p-6 hover:shadow-lg transition-all duration-300">
      {/* Subtle top gradient line */}
      <div className={`absolute top-0 left-0 right-0 h-0.5 ${bg.replace('/10', '')} opacity-50 group-hover:opacity-100 transition-opacity`} />

      <div className="flex justify-between items-start">
        <div className={`p-3 rounded-xl ${bg} ring-1 ring-border/50`}>
          <Icon className={`w-5 h-5 ${color}`} />
        </div>
        <div className={`flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full ${isUp ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'}`}>
          {isUp ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
          {trend}
        </div>
      </div>
      <div className="mt-5">
        <h3 className="text-2xl font-extrabold tracking-tight">{value}</h3>
        <p className="text-sm text-muted-foreground mt-1 font-medium">{label}</p>
      </div>
    </Card>
  );
}
