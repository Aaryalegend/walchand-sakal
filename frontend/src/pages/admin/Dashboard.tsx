import React, { useState, useEffect } from "react";
import { BarChart3, Users, Video, Film } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

interface DashboardStat {
  title: string;
  value: number;
  description: string;
  icon: React.ReactNode;
  link: string;
}

const Dashboard = () => {
  const [stats, setStats] = useState<DashboardStat[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        
        // Fetch speakers count
        const speakersRes = await fetch(`${import.meta.env.VITE_API_URL}/speakers`);
        const speakersData = await speakersRes.json();
        
        // Fetch episodes count
        const episodesRes = await fetch(`${import.meta.env.VITE_API_URL}/episodes`);
        const episodesData = await episodesRes.json();
        
        // Fetch team members count
        const teamRes = await fetch(`${import.meta.env.VITE_API_URL}/team`);
        const teamData = await teamRes.json();
        
        // Fetch featured talks count
        const talksRes = await fetch(`${import.meta.env.VITE_API_URL}/featured-talks`);
        const talksData = await talksRes.json();
        
        setStats([
          {
            title: "Speakers",
            value: speakersData.count || 0,
            description: "Total speakers in database",
            icon: <Users className="h-5 w-5 text-blue-600" />,
            link: "/admin/speakers"
          },
          {
            title: "Episodes",
            value: episodesData.count || 0,
            description: "Total episodes in database",
            icon: <Video className="h-5 w-5 text-purple-600" />,
            link: "/admin/episodes"
          },
          {
            title: "Team Members",
            value: teamData.count || 0,
            description: "Team members on About page",
            icon: <Users className="h-5 w-5 text-green-600" />,
            link: "/admin/team"
          },
          {
            title: "Featured Talks",
            value: talksData.count || 0,
            description: "Talks featured on homepage",
            icon: <Film className="h-5 w-5 text-amber-600" />,
            link: "/admin/featured-talks"
          }
        ]);
      } catch (err) {
        console.error(err);
        setError("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <p className="text-lg">Loading dashboard data...</p>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="h-full flex items-center justify-center">
        <p className="text-lg text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground mt-2">
          Welcome to the admin dashboard. Manage your content from here.
        </p>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              {stat.icon}
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {stat.description}
              </p>
              <Button variant="link" className="px-0 mt-2" asChild>
                <Link to={stat.link}>Manage {stat.title}</Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
      
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button className="w-full justify-start" variant="outline" asChild>
              <Link to="/admin/featured-talks/new">Add Featured Talk</Link>
            </Button>
            <Button className="w-full justify-start" variant="outline" asChild>
              <Link to="/admin/episodes/new">Add New Episode</Link>
            </Button>
            <Button className="w-full justify-start" variant="outline" asChild>
              <Link to="/admin/speakers/new">Add New Speaker</Link>
            </Button>
            <Button className="w-full justify-start" variant="outline" asChild>
              <Link to="/admin/team/new">Add Team Member</Link>
            </Button>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Activity tracking will be implemented in a future update.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard; 