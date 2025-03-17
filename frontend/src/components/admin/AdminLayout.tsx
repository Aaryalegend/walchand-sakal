import React, { useState } from "react";
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { 
  Home, Settings, Users, Video, Film, BarChart3, LogOut,
  Menu, X, ChevronDown, ChevronUp, FileText
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const AdminLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  const toggleDropdown = (key: string) => {
    setActiveDropdown(activeDropdown === key ? null : key);
  };

  const handleLogout = () => {
    logout();
    navigate("/admin/login");
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  return (
    <div className="flex h-screen bg-secondary/5">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/50 lg:hidden" 
          onClick={closeSidebar}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={`fixed top-0 left-0 z-50 w-64 h-screen transition-transform duration-300 ease-in-out bg-white border-r shadow-sm lg:relative lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Sidebar header */}
        <div className="flex items-center justify-between h-16 px-4 border-b">
          <h1 className="text-xl font-semibold">Admin Dashboard</h1>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={closeSidebar}
            className="lg:hidden"
          >
            <X size={20} />
          </Button>
        </div>

        {/* Sidebar content */}
        <div className="p-4 space-y-1">
          <NavLink 
            to="/admin/dashboard" 
            onClick={closeSidebar}
            className={({ isActive }) => 
              `flex items-center px-3 py-2 rounded-md text-sm ${
                isActive 
                  ? "bg-primary text-white" 
                  : "text-foreground hover:bg-secondary/50"
              }`
            }
          >
            <Home size={18} className="mr-2" />
            Dashboard
          </NavLink>

          {/* Content Management */}
          <div>
            <button
              onClick={() => toggleDropdown("content")}
              className="flex items-center justify-between w-full px-3 py-2 text-sm rounded-md text-foreground hover:bg-secondary/50"
            >
              <div className="flex items-center">
                <Film size={18} className="mr-2" />
                Content Management
              </div>
              {activeDropdown === "content" ? (
                <ChevronUp size={16} />
              ) : (
                <ChevronDown size={16} />
              )}
            </button>

            {activeDropdown === "content" && (
              <div className="pl-8 mt-1 space-y-1">
                <NavLink
                  to="/admin/featured-talks"
                  onClick={closeSidebar}
                  className={({ isActive }) =>
                    `block px-3 py-2 rounded-md text-sm ${
                      isActive
                        ? "bg-primary/10 text-primary"
                        : "text-foreground hover:bg-secondary/30"
                    }`
                  }
                >
                  Featured Talks
                </NavLink>
                <NavLink
                  to="/admin/featured-speakers"
                  onClick={closeSidebar}
                  className={({ isActive }) =>
                    `block px-3 py-2 rounded-md text-sm ${
                      isActive
                        ? "bg-primary/10 text-primary"
                        : "text-foreground hover:bg-secondary/30"
                    }`
                  }
                >
                  Featured Speakers
                </NavLink>
                <NavLink
                  to="/admin/episodes"
                  onClick={closeSidebar}
                  className={({ isActive }) =>
                    `block px-3 py-2 rounded-md text-sm ${
                      isActive
                        ? "bg-primary/10 text-primary"
                        : "text-foreground hover:bg-secondary/30"
                    }`
                  }
                >
                  Episodes
                </NavLink>
                <NavLink
                  to="/admin/speakers"
                  onClick={closeSidebar}
                  className={({ isActive }) =>
                    `block px-3 py-2 rounded-md text-sm ${
                      isActive
                        ? "bg-primary/10 text-primary"
                        : "text-foreground hover:bg-secondary/30"
                    }`
                  }
                >
                  Speakers
                </NavLink>
              </div>
            )}
          </div>

          {/* About Page */}
          <div>
            <button
              onClick={() => toggleDropdown("about")}
              className="flex items-center justify-between w-full px-3 py-2 text-sm rounded-md text-foreground hover:bg-secondary/50"
            >
              <div className="flex items-center">
                <Users size={18} className="mr-2" />
                About Page
              </div>
              {activeDropdown === "about" ? (
                <ChevronUp size={16} />
              ) : (
                <ChevronDown size={16} />
              )}
            </button>

            {activeDropdown === "about" && (
              <div className="pl-8 mt-1 space-y-1">
                <NavLink
                  to="/admin/team"
                  onClick={closeSidebar}
                  className={({ isActive }) =>
                    `block px-3 py-2 rounded-md text-sm ${
                      isActive
                        ? "bg-primary/10 text-primary"
                        : "text-foreground hover:bg-secondary/30"
                    }`
                  }
                >
                  Team Members
                </NavLink>
                <NavLink
                  to="/admin/stats"
                  onClick={closeSidebar}
                  className={({ isActive }) =>
                    `block px-3 py-2 rounded-md text-sm ${
                      isActive
                        ? "bg-primary/10 text-primary"
                        : "text-foreground hover:bg-secondary/30"
                    }`
                  }
                >
                  Stats
                </NavLink>
              </div>
            )}
          </div>

          <NavLink
            to="/admin/settings"
            onClick={closeSidebar}
            className={({ isActive }) =>
              `flex items-center px-3 py-2 rounded-md text-sm ${
                isActive
                  ? "bg-primary text-white"
                  : "text-foreground hover:bg-secondary/50"
              }`
            }
          >
            <Settings size={18} className="mr-2" />
            Settings
          </NavLink>

          <NavLink
            to="/admin/about-content"
            onClick={closeSidebar}
            className={({ isActive }) =>
              `flex items-center px-3 py-2 rounded-md text-sm ${
                isActive
                  ? "bg-primary text-white"
                  : "text-foreground hover:bg-secondary/50"
              }`
            }
          >
            <FileText size={18} className="mr-2" />
            About Content
          </NavLink>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Navbar */}
        <header className="h-16 bg-white border-b shadow-sm">
          <div className="flex items-center justify-between h-full px-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden"
            >
              <Menu size={20} />
            </Button>

            <div className="flex items-center ml-auto space-x-4">
              <div className="flex items-center space-x-2">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-primary text-white">
                    {user?.name?.charAt(0) || "A"}
                  </AvatarFallback>
                </Avatar>
                <span className="text-sm font-medium hidden md:inline">
                  {user?.name || "Admin User"}
                </span>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleLogout}
                title="Logout"
              >
                <LogOut size={18} />
              </Button>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout; 