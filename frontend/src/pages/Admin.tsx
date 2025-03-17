import React, { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { PlusCircle, Search, Edit, Trash2, Check, X } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import AdminEpisodeForm from "@/components/admin/AdminEpisodeForm";
import AdminLogin from "@/components/admin/AdminLogin";
import AdminEpisodeList from "@/components/admin/AdminEpisodeList";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

// Mock function to check if user is logged in (in a real app, use proper authentication)
const useAdminAuth = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    const savedAuth = localStorage.getItem("admin-auth");
    return savedAuth === "true";
  });

  const login = (password: string) => {
    // In a real application, this would be a proper authentication system
    // This is just for demonstration purposes
    if (password === "admin123") {
      localStorage.setItem("admin-auth", "true");
      setIsLoggedIn(true);
      return true;
    }
    return false;
  };

  const logout = () => {
    localStorage.removeItem("admin-auth");
    setIsLoggedIn(false);
  };

  return { isLoggedIn, login, logout };
};

const Admin = () => {
  const { isLoggedIn, login, logout } = useAdminAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedEpisode, setSelectedEpisode] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/admin/dashboard");
    } else {
      navigate("/admin/login");
    }
  }, [isAuthenticated, navigate]);

  if (!isLoggedIn) {
    return <AdminLogin onLogin={login} />;
  }

  const handleAddNew = () => {
    setSelectedEpisode(null);
    setIsEditing(true);
  };

  const handleEditEpisode = (episode: any) => {
    setSelectedEpisode(episode);
    setIsEditing(true);
  };

  const handleSaveEpisode = (episode: any) => {
    // In a real application, this would save to a database
    console.log("Saving episode:", episode);
    
    toast({
      title: episode.id ? "Episode Updated" : "Episode Added",
      description: `Successfully ${episode.id ? "updated" : "added"} "${episode.title}"`,
    });
    
    setIsEditing(false);
    
    // Force a refresh to see the changes (in a real app, this would be handled by state management)
    setTimeout(() => {
      window.location.reload();
    }, 1500);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
  };

  const handleDeleteEpisode = (episode: any) => {
    // In a real application, this would delete from a database
    console.log("Deleting episode:", episode);
    
    // Show confirmation dialog
    if (window.confirm(`Are you sure you want to delete "${episode.title}"?`)) {
      toast({
        title: "Episode Deleted",
        description: `Successfully deleted "${episode.title}"`,
      });
      
      // Force a refresh to see the changes (in a real app, this would be handled by state management)
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    }
  };

  const handleLogout = () => {
    logout();
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    });
  };

  return (
    <>
      <Navbar />
      <main className="flex-1 pt-24 pb-20">
        {/* Header */}
        <section className="bg-secondary/30 py-10 px-6 md:px-10">
          <div className="max-w-7xl mx-auto">
            <div className="flex justify-between items-center">
              <h1 className="text-3xl md:text-4xl font-medium">Admin Dashboard</h1>
              <Button variant="outline" onClick={handleLogout}>Logout</Button>
            </div>
            <p className="text-foreground/70 mt-2">
              Manage your episodes, speakers, and content from this dashboard.
            </p>
          </div>
        </section>

        {/* Main Content */}
        <section className="py-8 px-6 md:px-10">
          <div className="max-w-7xl mx-auto">
            {isEditing ? (
              <AdminEpisodeForm 
                episode={selectedEpisode} 
                onSave={handleSaveEpisode} 
                onCancel={handleCancelEdit}
              />
            ) : (
              <>
                {/* Controls */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                  <div className="relative w-full md:w-96">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                      <Search size={18} className="text-foreground/50" />
                    </div>
                    <input
                      type="text"
                      placeholder="Search episodes..."
                      className="w-full py-2 pl-11 pr-4 rounded-lg border border-border bg-white focus:outline-none focus:ring-2 focus:ring-primary/20"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <Button onClick={handleAddNew}>
                    <PlusCircle className="mr-2" size={18} />
                    Add New Episode
                  </Button>
                </div>

                {/* Episode List */}
                <AdminEpisodeList 
                  searchQuery={searchQuery}
                  onEdit={handleEditEpisode}
                  onDelete={handleDeleteEpisode}
                />
              </>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default Admin;
