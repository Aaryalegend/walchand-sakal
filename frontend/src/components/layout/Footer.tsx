
import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-secondary py-12 px-6 md:px-10 mt-auto">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Logo and tagline */}
          <div className="space-y-4">
            <Link to="/" className="text-2xl font-medium tracking-tight flex items-center">
              <span className="text-primary mr-1">•</span>
              <span>Walchand-Sakal Lecture Series</span>
            </Link>
            <p className="text-sm text-foreground/70 mt-2 max-w-xs leading-relaxed">
              Exploring ideas that matter through thought-provoking conversations with leading thinkers and innovators.
            </p>
          </div>

          {/* Quick links */}
          <div className="space-y-4">
            <h4 className="text-base font-medium mb-4">Quick Links</h4>
            <ul className="space-y-3">
              <li>
                <Link to="/" className="text-sm text-foreground/70 hover:text-primary transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/speakers" className="text-sm text-foreground/70 hover:text-primary transition-colors">
                  Speakers
                </Link>
              </li>
              <li>
                <Link to="/episodes" className="text-sm text-foreground/70 hover:text-primary transition-colors">
                  Episodes
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-sm text-foreground/70 hover:text-primary transition-colors">
                  About
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h4 className="text-base font-medium mb-4">Connect</h4>
            <ul className="space-y-3">
              <li>
                <a
                  href="#"
                  className="text-sm text-foreground/70 hover:text-primary transition-colors"
                >
                  Email Us
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-sm text-foreground/70 hover:text-primary transition-colors"
                >
                  Twitter
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-sm text-foreground/70 hover:text-primary transition-colors"
                >
                  Instagram
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-sm text-foreground/70 hover:text-primary transition-colors"
                >
                  YouTube
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border/30 mt-10 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-xs text-foreground/60">
            © {currentYear} Walchand-Sakal Lecture Series. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="text-xs text-foreground/60 hover:text-primary transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="text-xs text-foreground/60 hover:text-primary transition-colors">
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
