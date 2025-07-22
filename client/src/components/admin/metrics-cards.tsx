import StatsCard from "@/components/dashboard/stats-card";

interface Metric {
  title: string;
  value: string | number;
  change: string;
  changeLabel: string;
  icon: any;
  color: string;
}

interface MetricsCardsProps {
  metrics: Metric[];
}

export default function MetricsCards({ metrics }: MetricsCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {metrics.map((metric, index) => (
        <StatsCard key={index} {...metric} />
      ))}
    </div>
  );
}