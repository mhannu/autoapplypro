import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

import AdPlaceholder from "@/components/ads/ad-placeholder";
import ResumePreview from "@/components/resume/resume-preview";
import StatsCard from "@/components/dashboard/stats-card";
import RecentActivity from "@/components/dashboard/recent-activity";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { 
  Plus, Edit, Download, Eye, Send, FileText, 
  Briefcase, Settings, User 
} from "lucide-react";

export default function Dashboard() {
  const [selectedResume, setSelectedResume] = useState<any>(null);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Queries
  const { data: userProfile } = useQuery<{user: any, profile: any}>({
    queryKey: ["/api/user/profile"],
  });

  const { data: resumes = [] } = useQuery<any[]>({
    queryKey: ["/api/resumes"],
  });

  const { data: stats } = useQuery<{applicationsSent: number, responses: number, interviews: number}>({
    queryKey: ["/api/dashboard/stats"],
  });

  const { data: activities = [] } = useQuery<any[]>({
    queryKey: ["/api/activities"],
  });

  const { data: applications = [] } = useQuery<any[]>({
    queryKey: ["/api/applications"],
  });

  const { data: jobMatches = [] } = useQuery<any[]>({
    queryKey: ["/api/job-matches"],
  });

  // Mutations
  const generateResumeMutation = useMutation({
    mutationFn: async (data: { jobTitle: string; jobDescription: string }) => {
      return await apiRequest("POST", "/api/resumes/generate", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/resumes"] });
      toast({
        title: "Success",
        description: "Resume generated successfully!",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const matchJobsMutation = useMutation({
    mutationFn: async () => {
      return await apiRequest("POST", "/api/jobs/match");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/job-matches"] });
      toast({
        title: "Success",
        description: "Found new job matches!",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error", 
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleGenerateResume = () => {
    generateResumeMutation.mutate({
      jobTitle: "Software Engineer",
      jobDescription: "Full-stack development position"
    });
  };

  const handleFindJobs = () => {
    matchJobsMutation.mutate();
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="lg:w-80">
            {/* User Profile Card */}
            <Card className="mb-6">
              <CardContent className="pt-6">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center">
                    <User className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      {userProfile?.user?.firstName} {userProfile?.user?.lastName}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 text-sm">
                      {userProfile?.user?.title || "Job Seeker"}
                    </p>
                    <div className="flex items-center mt-1">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                      <span className="text-xs text-green-500">Active</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="text-lg">Quick Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-300 text-sm">Applications Sent</span>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {stats?.applicationsSent || 0}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-300 text-sm">Responses</span>
                  <span className="font-semibold text-green-500">
                    {stats?.responses || 0}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-300 text-sm">Interviews</span>
                  <span className="font-semibold text-primary">
                    {stats?.interviews || 0}
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Sidebar Ad */}
            <AdPlaceholder 
              type="sidebar"
              label="Sidebar Ad (300x250)"
              description="Career coaching ads, courses, etc."
            />
          </div>

          {/* Main Content */}
          <div className="flex-1">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h2>
              <p className="text-gray-600 dark:text-gray-300 mt-1">
                Manage your job applications and track progress
              </p>
            </div>

            <Tabs defaultValue="resumes" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="resumes">Resume Manager</TabsTrigger>
                <TabsTrigger value="jobs">Job Matches</TabsTrigger>
                <TabsTrigger value="applications">Applications</TabsTrigger>
                <TabsTrigger value="settings">Settings</TabsTrigger>
              </TabsList>

              {/* Resume Manager Tab */}
              <TabsContent value="resumes" className="space-y-8">
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                  {/* Resume List */}
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                      <CardTitle>Your Resumes</CardTitle>
                      <Button 
                        onClick={handleGenerateResume}
                        disabled={generateResumeMutation.isPending}
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        {generateResumeMutation.isPending ? "Generating..." : "New Resume"}
                      </Button>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {resumes.length === 0 ? (
                          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                            <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                            <p>No resumes yet. Generate your first resume!</p>
                          </div>
                        ) : (
                          resumes.map((resume: any) => (
                            <div 
                              key={resume.id}
                              className={`border border-gray-200 dark:border-gray-700 rounded-lg p-4 transition-colors cursor-pointer ${
                                selectedResume?.id === resume.id ? "bg-blue-50 dark:bg-blue-900/20 border-primary" : "hover:bg-gray-50 dark:hover:bg-gray-800"
                              }`}
                              onClick={() => setSelectedResume(resume)}
                            >
                              <div className="flex justify-between items-start mb-2">
                                <div>
                                  <h4 className="font-medium text-gray-900 dark:text-white">
                                    {resume.title}
                                  </h4>
                                  <p className="text-sm text-gray-600 dark:text-gray-300">
                                    Updated {new Date(resume.updatedAt).toLocaleDateString()}
                                  </p>
                                </div>
                                <div className="flex space-x-2">
                                  <Button size="sm" variant="ghost">
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                  <Button size="sm" variant="ghost">
                                    <Download className="h-4 w-4" />
                                  </Button>
                                </div>
                              </div>
                              <div className="flex items-center space-x-4 text-xs text-gray-500 dark:text-gray-400">
                                <span>
                                  <Eye className="h-3 w-3 inline mr-1" />
                                  ATS Score: {resume.atsScore || 0}%
                                </span>
                                <span>
                                  <Send className="h-3 w-3 inline mr-1" />
                                  Used in {resume.usageCount || 0} applications
                                </span>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Resume Preview */}
                  <ResumePreview resume={selectedResume} />
                </div>

                {/* Recent Activity */}
                <RecentActivity activities={activities} />
              </TabsContent>

              {/* Job Matches Tab */}
              <TabsContent value="jobs" className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold">Job Matches</h3>
                  <Button 
                    onClick={handleFindJobs}
                    disabled={matchJobsMutation.isPending}
                  >
                    <Briefcase className="h-4 w-4 mr-2" />
                    {matchJobsMutation.isPending ? "Finding Jobs..." : "Find New Matches"}
                  </Button>
                </div>

                <div className="grid gap-4">
                  {jobMatches.length === 0 ? (
                    <Card>
                      <CardContent className="text-center py-12">
                        <Briefcase className="h-12 w-12 mx-auto mb-4 opacity-50 text-gray-400" />
                        <p className="text-gray-500 dark:text-gray-400 mb-4">
                          No job matches yet. Let AI find perfect opportunities for you!
                        </p>
                        <Button onClick={handleFindJobs} disabled={matchJobsMutation.isPending}>
                          Find Job Matches
                        </Button>
                      </CardContent>
                    </Card>
                  ) : (
                    jobMatches.map((match: any) => (
                      <Card key={match.id} className="hover:shadow-md transition-shadow">
                        <CardContent className="p-6">
                          <div className="flex justify-between items-start mb-4">
                            <div>
                              <h4 className="font-semibold text-gray-900 dark:text-white">
                                {match.job.title}
                              </h4>
                              <p className="text-gray-600 dark:text-gray-300">
                                {match.job.company} • {match.job.location}
                              </p>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Badge variant="secondary">
                                {Math.round(parseFloat(match.matchScore || "0") * 100)}% match
                              </Badge>
                              <Button size="sm">Apply</Button>
                            </div>
                          </div>
                          {match.matchReasons && (
                            <div className="text-sm text-gray-600 dark:text-gray-300">
                              <strong>Match reasons:</strong> {match.matchReasons.join(", ")}
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    ))
                  )}
                </div>
              </TabsContent>

              {/* Applications Tab */}
              <TabsContent value="applications" className="space-y-6">
                <h3 className="text-lg font-semibold">Your Applications</h3>
                
                <div className="grid gap-4">
                  {applications.length === 0 ? (
                    <Card>
                      <CardContent className="text-center py-12">
                        <Send className="h-12 w-12 mx-auto mb-4 opacity-50 text-gray-400" />
                        <p className="text-gray-500 dark:text-gray-400">
                          No applications yet. Start applying to matched jobs!
                        </p>
                      </CardContent>
                    </Card>
                  ) : (
                    applications.map((application: any) => (
                      <Card key={application.id}>
                        <CardContent className="p-6">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-semibold text-gray-900 dark:text-white">
                                {application.job.title}
                              </h4>
                              <p className="text-gray-600 dark:text-gray-300">
                                {application.job.company} • Applied {new Date(application.appliedAt).toLocaleDateString()}
                              </p>
                              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                                Resume: {application.resume.title}
                              </p>
                            </div>
                            <Badge 
                              variant={
                                application.status === "interview" ? "default" :
                                application.status === "responded" ? "secondary" :
                                "outline"
                              }
                            >
                              {application.status}
                            </Badge>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </div>
              </TabsContent>

              {/* Settings Tab */}
              <TabsContent value="settings" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Account Settings</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-gray-500 dark:text-gray-400">
                      Settings panel coming soon...
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>

      {/* Mobile Ad Bar */}
      <div className="lg:hidden">
        <AdPlaceholder 
          type="mobile"
          label="Mobile Banner Ad (320x50)"
          className="fixed bottom-0 left-0 right-0 border-t border-gray-300 dark:border-gray-600"
        />
      </div>
    </div>
  );
}
