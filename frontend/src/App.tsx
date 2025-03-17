import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/auth/ProtectedRoute";

// Public pages
import Index from "./pages/Index";
import Speakers from "./pages/Speakers";
import Episodes from "./pages/Episodes";
import About from "./pages/About";
import NotFound from "./pages/NotFound";

// Admin pages
import Login from "./pages/admin/Login";
import AdminLayout from "./components/admin/AdminLayout";
import Dashboard from "./pages/admin/Dashboard";
import FeaturedTalks from "./pages/admin/FeaturedTalks";
import FeaturedTalkForm from "./components/admin/FeaturedTalkForm";
import FeaturedSpeakers from "./pages/admin/FeaturedSpeakers";
import FeaturedSpeakerForm from "./components/admin/FeaturedSpeakerForm";
import ManageEpisodes from "./pages/admin/ManageEpisodes";
import EpisodeForm from "./components/admin/EpisodeForm";
import ManageSpeakers from "./pages/admin/ManageSpeakers";
import SpeakerForm from "./components/admin/SpeakerForm";
import ManageTeam from "./pages/admin/ManageTeam";
import TeamMemberForm from "./components/admin/TeamMemberForm";
import ManageStats from "./pages/admin/ManageStats";
import ManageAboutContent from "./pages/admin/ManageAboutContent";
import ManageSettings from "./pages/admin/ManageSettings";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Index />} />
            <Route path="/speakers" element={<Speakers />} />
            <Route path="/episodes" element={<Episodes />} />
            <Route path="/about" element={<About />} />
            
            {/* Admin Routes */}
            <Route path="/admin/login" element={<Login />} />
            <Route 
              path="/admin" 
              element={
                <ProtectedRoute>
                  <AdminLayout />
                </ProtectedRoute>
              }
            >
              <Route path="dashboard" element={<Dashboard />} />
              
              {/* Featured Talks Management */}
              <Route path="featured-talks" element={<FeaturedTalks />} />
              <Route path="featured-talks/new" element={<FeaturedTalkForm />} />
              <Route path="featured-talks/edit/:id" element={<FeaturedTalkForm isEdit />} />
              
              {/* Featured Speakers Management */}
              <Route path="featured-speakers" element={<FeaturedSpeakers />} />
              <Route path="featured-speakers/new" element={<FeaturedSpeakerForm />} />
              <Route path="featured-speakers/edit/:id" element={<FeaturedSpeakerForm isEdit />} />
              
              {/* Episodes Management */}
              <Route path="episodes" element={<ManageEpisodes />} />
              <Route path="episodes/new" element={<EpisodeForm />} />
              <Route path="episodes/edit/:id" element={<EpisodeForm isEdit />} />
              
              {/* Speakers Management */}
              <Route path="speakers" element={<ManageSpeakers />} />
              <Route path="speakers/new" element={<SpeakerForm />} />
              <Route path="speakers/edit/:id" element={<SpeakerForm isEdit />} />
              
              {/* About Page Management */}
              <Route path="team" element={<ManageTeam />} />
              <Route path="team/new" element={<TeamMemberForm />} />
              <Route path="team/edit/:id" element={<TeamMemberForm isEdit />} />
              <Route path="stats" element={<ManageStats />} />
              <Route path="about-content" element={<ManageAboutContent />} />
              
              {/* Settings */}
              <Route path="settings" element={<ManageSettings />} />
              
              {/* Redirect from /admin to /admin/dashboard */}
              <Route index element={<Dashboard />} />
            </Route>
            
            {/* Catch-all route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
