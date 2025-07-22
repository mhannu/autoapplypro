import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string | number;
  change?: string;
  changeLabel?: string;
  icon: LucideIcon;
  color?: string;
}

export default function StatsCard({ 
  title, 
  value, 
  change, 
  changeLabel, 
  icon: Icon,
  color = "bg-blue-500"
}: StatsCardProps) {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-600 dark:text-gray-300 text-sm">{title}</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
          </div>
          <div className={`w-12 h-12 ${color} rounded-lg flex items-center justify-center`}>
            <Icon className="text-white h-6 w-6" />
          </div>
        </div>
        {change && changeLabel && (
          <div className="mt-4 flex items-center">
            <span className="text-green-500 text-sm">{change}</span>
            <span className="text-gray-500 dark:text-gray-400 text-sm ml-2">{changeLabel}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
