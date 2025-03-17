import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Save } from "lucide-react";

interface AboutContent {
  _id?: string;
  title: string;
  subtitle: string;
  mainContent: string;
  mission: string;
  vision: string;
}

const initialContent: AboutContent = {
  title: "About Us",
  subtitle: "Our Story and Mission",
  mainContent: "",
  mission: "",
  vision: ""
};

const ManageAboutContent = () => {
  const [content, setContent] = useState<AboutContent>(initialContent);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    fetchAboutContent();
  }, []);

  const fetchAboutContent = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${import.meta.env.VITE_API_URL}/about-content`, {
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
        },
      });

      const data = await response.json();

      if (data.success && data.data.length > 0) {
        setContent(data.data[0]);
      }
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to fetch about page content",
        variant: "destructive",
      });
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setContent((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      const token = localStorage.getItem("token");
      const url = content._id
        ? `${import.meta.env.VITE_API_URL}/about-content/${content._id}`
        : `${import.meta.env.VITE_API_URL}/about-content`;
      const method = content._id ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
        body: JSON.stringify(content),
      });

      const data = await response.json();

      if (data.success) {
        if (!content._id) {
          setContent({ ...content, _id: data.data._id });
        }
        toast({
          title: "Success",
          description: "About page content updated successfully",
        });
      } else {
        setError(data.error || "Failed to save about page content");
        toast({
          title: "Error",
          description: data.error || "Failed to save about page content",
          variant: "destructive",
        });
      }
    } catch (err) {
      setError("Error connecting to the server");
      toast({
        title: "Error",
        description: "Failed to connect to the server",
        variant: "destructive",
      });
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="text-center py-10">Loading about page content...</div>;
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Manage About Page Content</h1>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>About Page Content</CardTitle>
            <CardDescription>
              Edit the main content sections of the About page
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Page Title</Label>
              <Input
                id="title"
                name="title"
                value={content.title}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="subtitle">Subtitle</Label>
              <Input
                id="subtitle"
                name="subtitle"
                value={content.subtitle}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="mainContent">Main Content</Label>
              <Textarea
                id="mainContent"
                name="mainContent"
                value={content.mainContent}
                onChange={handleChange}
                rows={8}
                required
              />
              <p className="text-sm text-muted-foreground">
                This is the main descriptive text that appears at the top of the About page
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="mission">Our Mission</Label>
              <Textarea
                id="mission"
                name="mission"
                value={content.mission}
                onChange={handleChange}
                rows={5}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="vision">Our Vision</Label>
              <Textarea
                id="vision"
                name="vision"
                value={content.vision}
                onChange={handleChange}
                rows={5}
                required
              />
            </div>

            <div className="flex justify-end">
              <Button type="submit" disabled={saving}>
                {saving ? (
                  "Saving..."
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" /> Save Content
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
};

export default ManageAboutContent; 