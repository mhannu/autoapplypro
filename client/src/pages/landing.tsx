import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

import AdPlaceholder from "@/components/ads/ad-placeholder";
import { 
  User, FileText, Search, Mail, Send, BarChart3, 
  CheckCircle, ArrowRight, Play 
} from "lucide-react";
import { Link } from "wouter";

const features = [
  {
    icon: User,
    title: "Profile Agent",
    description: "Extract and parse LinkedIn profiles or uploaded data to build comprehensive professional profiles.",
    color: "bg-blue-500"
  },
  {
    icon: FileText,
    title: "Resume Agent", 
    description: "Generate tailored, ATS-optimized resumes for specific roles with professional formatting.",
    color: "bg-green-500"
  },
  {
    icon: Search,
    title: "Job Match Agent",
    description: "AI-powered job matching based on skills, experience, and career preferences.",
    color: "bg-purple-500"
  },
  {
    icon: Mail,
    title: "Cover Letter Agent",
    description: "Generate personalized cover letters for each application automatically.",
    color: "bg-orange-500"
  },
  {
    icon: Send,
    title: "Application Agent",
    description: "Automate job applications with user consent and track submission status.",
    color: "bg-red-500"
  },
  {
    icon: BarChart3,
    title: "Smart Analytics",
    description: "Track application success rates, optimize strategies, and monitor progress.",
    color: "bg-indigo-500"
  }
];

export default function Landing() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      
      {/* Top Banner Ad */}
      <AdPlaceholder 
        type="banner"
        className="border-b border-gray-200 dark:border-gray-700"
        label="Advertisement Banner (728x90)"
        description="Environment variable: ENABLE_ADS=true"
      />

      {/* Hero Section */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-800 dark:to-gray-900 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 dark:text-white leading-tight">
                Automate Your Job Hunt with <span className="text-primary">AI Agents</span>
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-300 mt-6 leading-relaxed">
                Let specialized AI agents handle your resume creation, job matching, cover letters, and applications. Focus on preparing for interviews while we handle the rest.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row gap-4">
                <Link href="/dashboard">
                  <Button size="lg" className="bg-primary text-white hover:bg-blue-700 px-8 py-4 text-lg font-semibold">
                    Start Free Trial
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="border-2 border-primary text-primary hover:bg-primary hover:text-white px-8 py-4 text-lg font-semibold"
                >
                  <Play className="mr-2 h-5 w-5" />
                  Watch Demo
                </Button>
              </div>
            </div>
            <div className="relative">
              {/* Modern dashboard preview illustration */}
              <Card className="transform rotate-3 shadow-2xl">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex space-x-2">
                      <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                      <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                      <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                    <div className="h-20 bg-gradient-to-r from-primary to-blue-400 rounded"></div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="h-12 bg-green-500 rounded"></div>
                      <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded"></div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white">
              Specialized AI Agents for Every Step
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 mt-4">
              Our modular approach uses dedicated agents for maximum efficiency
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="bg-gray-50 dark:bg-gray-800 hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className={`w-12 h-12 ${feature.color} rounded-lg flex items-center justify-center mb-4`}>
                    <feature.icon className="text-white h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-primary py-20">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
            Ready to Accelerate Your Job Search?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of job seekers who have automated their way to better opportunities.
          </p>
          <Link href="/dashboard">
            <Button size="lg" className="bg-white text-primary hover:bg-gray-100 px-8 py-4 text-lg font-semibold">
              Get Started Now
              <CheckCircle className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
