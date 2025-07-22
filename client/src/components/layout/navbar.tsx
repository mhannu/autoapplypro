import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/components/layout/theme-provider";
import { Moon, Sun, Menu, X } from "lucide-react";
import { Link, useLocation } from "wouter";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [location] = useLocation();
  const { theme, toggleTheme } = useTheme();

  // Mock auth state - TODO: Replace with actual authentication
  const isLoggedIn = false; // Set to true to test logged-in state
  const isAdmin = false; // Set to true to test admin state

  const navLinks = [
    { href: "/", label: "Home", id: "home", showAlways: true },
    { href: "/dashboard", label: "Dashboard", id: "dashboard", showAlways: false, requiresAuth: true },
    { href: "/admin", label: "Admin", id: "admin", showAlways: false, requiresAdmin: true },
  ].filter(link => 
    link.showAlways || 
    (link.requiresAuth && isLoggedIn) || 
    (link.requiresAdmin && isAdmin)
  );

  const isActive = (href: string) => {
    if (href === "/" && location === "/") return true;
    if (href !== "/" && location.startsWith(href)) return true;
    return false;
  };

  return (
    <nav className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-8">
            <div className="flex-shrink-0">
              <Link href="/">
                <h1 className="text-xl font-bold text-primary cursor-pointer">
                  AutoApply Pro
                </h1>
              </Link>
            </div>
            <div className="hidden md:block">
              <div className="flex space-x-8">
                {navLinks.map((link) => (
                  <Link key={link.id} href={link.href}>
                    <span
                      className={`px-1 pb-4 text-sm font-medium transition-colors border-b-2 cursor-pointer ${
                        isActive(link.href)
                          ? "text-primary border-primary"
                          : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 border-transparent hover:border-gray-300"
                      }`}
                    >
                      {link.label}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700"
            >
              {theme === "dark" ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </Button>
            
            <div className="hidden md:block">
              {!isLoggedIn ? (
                <Link href="/dashboard">
                  <Button className="bg-primary text-white hover:bg-blue-700">
                    Get Started
                  </Button>
                </Link>
              ) : (
                <Button className="bg-red-600 text-white hover:bg-red-700">
                  Logout
                </Button>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t border-gray-200 dark:border-gray-700">
              {navLinks.map((link) => (
                <Link key={link.id} href={link.href}>
                  <span
                    className={`block px-3 py-2 rounded-md text-base font-medium transition-colors cursor-pointer ${
                      isActive(link.href)
                        ? "text-primary bg-blue-50 dark:bg-blue-900/20"
                        : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700"
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {link.label}
                  </span>
                </Link>
              ))}
              <div className="pt-4 pb-3 border-t border-gray-200 dark:border-gray-700">
                <Link href="/dashboard">
                  <Button className="w-full bg-primary text-white hover:bg-blue-700">
                    Get Started
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
