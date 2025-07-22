import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Send, FileText, User, Bot } from "lucide-react";

interface Activity {
  id: number;
  type: string;
  description: string;
  createdAt: string;
}

interface RecentActivityProps {
  activities: Activity[];
}

const getActivityIcon = (type: string) => {
  switch (type) {
    case "resume_generated":
    case "resume_updated":
      return FileText;
    case "application_submitted":
      return Send;
    case "profile_extracted":
      return User;
    case "job_matched":
      return Bot;
    default:
      return CheckCircle;
  }
};

const getActivityColor = (type: string) => {
  switch (type) {
    case "resume_generated":
    case "resume_updated":
      return "bg-blue-500";
    case "application_submitted":
      return "bg-green-500";
    case "profile_extracted":
      return "bg-purple-500";
    case "job_matched":
      return "bg-orange-500";
    default:
      return "bg-gray-500";
  }
};

export default function RecentActivity({ activities }: RecentActivityProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.length === 0 ? (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              <CheckCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No recent activity</p>
            </div>
          ) : (
            activities.map((activity) => {
              const Icon = getActivityIcon(activity.type);
              const colorClass = getActivityColor(activity.type);
              
              return (
                <div key={activity.id} className="flex items-center space-x-4">
                  <div className={`w-8 h-8 ${colorClass} rounded-full flex items-center justify-center`}>
                    <Icon className="text-white h-4 w-4" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-900 dark:text-white">
                      {activity.description}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {new Date(activity.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </CardContent>
    </Card>
  );
}
