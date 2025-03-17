import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const NotFound = () => {
  return (
    <>
      <Navbar />
      <main className="container mx-auto px-4 py-24 min-h-[70vh] flex flex-col items-center justify-center text-center">
        <h1 className="text-5xl md:text-7xl font-bold mb-6">404</h1>
        <h2 className="text-2xl md:text-3xl font-semibold mb-8">Page Not Found</h2>
        <p className="text-muted-foreground mb-8 max-w-md">
          The page you are looking for might have been removed, had its name changed, 
          or is temporarily unavailable.
        </p>
        <Button asChild size="lg">
          <Link to="/">Return to Homepage</Link>
        </Button>
      </main>
      <Footer />
    </>
  );
};

export default NotFound;
