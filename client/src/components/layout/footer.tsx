import { Link } from "wouter";
import { Separator } from "@/components/ui/separator";

export default function Footer() {
  return (
    <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
      {/* Main Footer Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-lg font-bold text-primary mb-4">AutoApply Pro</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4 max-w-md">
              Your AI-powered job hunting assistant. Automate resume creation, job matching, 
              and application submissions with intelligent automation.
            </p>
            <div className="flex space-x-4">
              <Link href="/about" className="text-gray-600 dark:text-gray-400 hover:text-primary">
                About
              </Link>
              <Link href="/contact" className="text-gray-600 dark:text-gray-400 hover:text-primary">
                Contact
              </Link>
              <Link href="/privacy" className="text-gray-600 dark:text-gray-400 hover:text-primary">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-gray-600 dark:text-gray-400 hover:text-primary">
                Terms of Service
              </Link>
            </div>
          </div>

          {/* Features */}
          <div>
            <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">Features</h4>
            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <li>AI Resume Generator</li>
              <li>Job Matching</li>
              <li>Application Tracking</li>
              <li>Cover Letter Creation</li>
              <li>Interview Preparation</li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">Support</h4>
            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <li>
                <Link href="/help" className="hover:text-primary">
                  Help Center
                </Link>
              </li>
              <li>
                <Link href="/tutorials" className="hover:text-primary">
                  Tutorials
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-primary">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-primary">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <Separator />

      {/* Copyright Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="text-sm text-gray-600 dark:text-gray-400">
            © {new Date().getFullYear()} AutoApply Pro. All rights reserved.
          </div>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link href="/testimonials" className="text-sm text-gray-600 dark:text-gray-400 hover:text-primary">
              Testimonials
            </Link>
            <Link href="/blog" className="text-sm text-gray-600 dark:text-gray-400 hover:text-primary">
              Blog
            </Link>
            <Link href="/careers" className="text-sm text-gray-600 dark:text-gray-400 hover:text-primary">
              Careers
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}