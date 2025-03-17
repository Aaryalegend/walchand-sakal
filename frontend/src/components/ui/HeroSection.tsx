
import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Play } from "lucide-react";
import { Button } from "@/components/ui/button";

const HeroSection = () => {
  return (
    <section className="min-h-screen relative flex items-center justify-center px-6 md:px-10 pt-24 pb-20 overflow-hidden">
      {/* Background gradient and patterns */}
      <div className="absolute inset-0 bg-gradient-to-b from-accent/30 to-background z-0"></div>
      <div className="absolute top-1/4 -left-20 w-72 h-72 bg-primary/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-primary/10 rounded-full blur-3xl"></div>
      
      {/* Content */}
      <div className="max-w-7xl mx-auto z-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <div className="flex flex-col space-y-8 animate-fade-in [animation-delay:0.2s] opacity-0" style={{animationFillMode: 'forwards'}}>
            {/* Label */}
            <div className="inline-flex items-center space-x-2">
              <div className="h-[1px] w-10 bg-primary"></div>
              <span className="text-sm font-medium text-primary">2025</span>
            </div>
            
            {/* Main heading */}
            <h1 className="elegant-title text-5xl md:text-6xl lg:text-7xl leading-tight">
              Ideas that <br />
              <span className="text-primary font-normal">shape tomorrow</span>
            </h1>
            
            {/* Description */}
            <p className="text-lg text-foreground/70 max-w-lg leading-relaxed">
              Join us for thought-provoking conversations with leading thinkers
              and innovators who are redefining our world through their ideas
              and expertise.
            </p>
            
            {/* CTA buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button asChild size="lg" className="rounded-full px-8 hover:scale-105 transition-transform">
                <Link to="/episodes">
                  Watch Episodes
                  <ArrowRight size={16} className="ml-2" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="rounded-full px-8 hover:shadow-md transition-all">
                <Link to="/speakers">
                  Meet Our Speakers
                </Link>
              </Button>
            </div>
          </div>
          
          {/* Featured video preview */}
          <div className="relative aspect-video rounded-xl overflow-hidden shadow-2xl animate-fade-in [animation-delay:0.4s] opacity-0" style={{animationFillMode: 'forwards'}}>
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent z-10"></div>
            
            <img 
              src="https://images.unsplash.com/photo-1475721027785-f74eccf877e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=1740&q=80" 
              alt="Featured talk with Jane Doe" 
              className="object-cover w-full h-full"
            />
            
            {/* Play button overlay */}
            <div className="absolute inset-0 flex items-center justify-center z-20">
              <button className="bg-white/90 hover:bg-white transition-colors rounded-full p-5 shadow-lg hover:scale-105 transform transition-transform">
                <Play size={24} className="text-primary" fill="currentColor" />
              </button>
            </div>
            
            {/* Video info */}
            <div className="absolute bottom-6 left-6 right-6 z-20">
              <span className="text-sm text-white/80 font-medium">Featured Talk</span>
              <h3 className="text-xl md:text-2xl text-white font-medium mt-1">The Future of Sustainable Technology</h3>
              <p className="text-sm text-white/80 mt-1">Jane Doe • CEO of Green Innovations</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
