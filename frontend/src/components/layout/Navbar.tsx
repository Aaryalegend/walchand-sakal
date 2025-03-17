import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Menu, X } from "lucide-react";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  // Track scroll position for navbar styling
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Speakers", path: "/speakers" },
    { name: "Episodes", path: "/episodes" },
    { name: "About", path: "/about" },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <>
      {/* Backdrop blur overlay for mobile menu */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-blue-100/30 backdrop-blur-md z-40 md:hidden animate-fade-in"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
      
      <header
        className={cn(
          "fixed top-4 left-0 right-0 z-50 transition-all duration-300 px-6 md:px-10 mx-auto max-w-7xl",
          isScrolled
            ? "py-3 bg-blue-100/70 backdrop-blur-xl shadow-lg border border-blue-200/40 rounded-full"
            : "py-4 bg-blue-100/30 backdrop-blur-lg border border-blue-200/30 rounded-full"
        )}
      >
        <div className="mx-auto flex items-center justify-between">
          {/* Logo */}
          <Link 
            to="/" 
            className="text-xl font-medium tracking-tight flex items-center transition-opacity hover:opacity-80"
          >
            <span className="text-primary mr-1">•</span>
            <span>Walchand-Sakal Lecture Series</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={cn(
                  "text-sm transition-colors duration-200 hover:text-primary relative font-medium",
                  isActive(link.path)
                    ? "text-primary after:absolute after:bottom-[-6px] after:left-0 after:w-full after:h-[2px] after:bg-primary after:rounded-full"
                    : "text-foreground/70"
                )}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-foreground focus:outline-none"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? (
              <X size={24} className="animate-fade-in" />
            ) : (
              <Menu size={24} className="animate-fade-in" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden absolute top-full mt-2 left-0 right-0 bg-blue-100/80 backdrop-blur-xl shadow-lg rounded-2xl border border-blue-200/40 animate-slide-down">
            <nav className="flex flex-col space-y-4 px-6 py-6">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={cn(
                    "text-base py-2 transition-colors duration-200 hover:text-primary",
                    isActive(link.path) ? "text-primary font-medium" : "text-foreground/70"
                  )}
                >
                  {link.name}
                </Link>
              ))}
            </nav>
          </div>
        )}
      </header>
    </>
  );
};

export default Navbar;
