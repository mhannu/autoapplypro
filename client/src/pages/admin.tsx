import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import AdPlaceholder from "@/components/ads/ad-placeholder";
import MetricsCards from "@/components/admin/metrics-cards";
import UsageChart from "@/components/admin/usage-chart";
import { Users, Send, Bot, TrendingUp, User } from "lucide-react";

export default function Admin() {
  const { data: metrics } = useQuery<{totalUsers: number, applicationsSent: number, totalTokenUsage: number, successRate: number}>({
    queryKey: ["/api/admin/metrics"],
  });

  const { data: tokenUsage = [] } = useQuery<any[]>({
    queryKey: ["/api/admin/token-usage"],
  });

  const { data: recentUsers = [] } = useQuery<any[]>({
    queryKey: ["/api/admin/recent-users"],
  });

  const metricsData = [
    {
      title: "Total Users",
      value: metrics?.totalUsers || 0,
      change: "+12.5%",
      changeLabel: "from last month",
      icon: Users,
      color: "bg-blue-500"
    },
    {
      title: "Applications Sent", 
      value: metrics?.applicationsSent || 0,
      change: "+8.2%",
      changeLabel: "from last week",
      icon: Send,
      color: "bg-green-500"
    },
    {
      title: "AI Token Usage",
      value: `${(metrics?.totalTokenUsage / 1000000 || 0).toFixed(1)}M`,
      change: "+24.1%", 
      changeLabel: "high usage today",
      icon: Bot,
      color: "bg-purple-500"
    },
    {
      title: "Success Rate",
      value: `${metrics?.successRate || 0}%`,
      change: "+2.1%",
      changeLabel: "improvement", 
      icon: TrendingUp,
      color: "bg-orange-500"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Admin Dashboard</h2>
          <p className="text-gray-600 dark:text-gray-300 mt-1">
            Monitor users, system performance, and analytics
          </p>
        </div>

        {/* Metrics Cards */}
        <MetricsCards metrics={metricsData} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
          {/* Charts Section */}
          <div className="lg:col-span-2 space-y-8">
            {/* Usage Analytics Chart */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0">
                <CardTitle>Usage Analytics</CardTitle>
                <Select defaultValue="7d">
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="7d">Last 7 days</SelectItem>
                    <SelectItem value="30d">Last 30 days</SelectItem>
                    <SelectItem value="90d">Last 90 days</SelectItem>
                  </SelectContent>
                </Select>
              </CardHeader>
              <CardContent>
                <UsageChart />
              </CardContent>
            </Card>

            {/* Token Usage by Agent */}
            <Card>
              <CardHeader>
                <CardTitle>Token Usage by Agent</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {tokenUsage.map((agent: any, index: number) => {
                    const maxTokens = Math.max(...tokenUsage.map((a: any) => a.totalTokens));
                    const percentage = (agent.totalTokens / maxTokens) * 100;
                    const colors = ['bg-blue-500', 'bg-green-500', 'bg-orange-500', 'bg-purple-500', 'bg-red-500'];
                    
                    return (
                      <div key={agent.agent} className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className={`w-3 h-3 ${colors[index % colors.length]} rounded-full`}></div>
                          <span className="text-gray-900 dark:text-white capitalize">
                            {agent.agent.replace('-', ' ')}
                          </span>
                        </div>
                        <div className="flex items-center space-x-4">
                          <div className="w-32 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                            <div 
                              className={`${colors[index % colors.length]} h-2 rounded-full`}
                              style={{ width: `${percentage}%` }}
                            ></div>
                          </div>
                          <span className="text-sm text-gray-600 dark:text-gray-300 w-16 text-right">
                            {agent.totalTokens > 1000 ? `${Math.round(agent.totalTokens / 1000)}K` : agent.totalTokens}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                  {tokenUsage.length === 0 && (
                    <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                      <Bot className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>No token usage data yet</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Recent Users */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Users</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recentUsers.map((user: any) => (
                    <div key={user.id} className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                        <User className="h-4 w-4 text-white" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {user.firstName} {user.lastName}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Joined {new Date(user.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))}
                  {recentUsers.length === 0 && (
                    <div className="text-center py-4 text-gray-500 dark:text-gray-400">
                      <Users className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">No recent users</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* System Health */}
            <Card>
              <CardHeader>
                <CardTitle>System Health</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 dark:text-gray-300">API Response</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm text-gray-900 dark:text-white">98.5%</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 dark:text-gray-300">Database</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm text-gray-900 dark:text-white">Healthy</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 dark:text-gray-300">AI Services</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                      <span className="text-sm text-gray-900 dark:text-white">Limited</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Admin Ad Placeholder */}
            <AdPlaceholder 
              type="sidebar"
              label="Admin Ad (300x250)"
              description="B2B services, enterprise tools"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
