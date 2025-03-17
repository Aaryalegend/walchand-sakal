import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Label } from "@/components/ui/label";
import { Save } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";

interface Settings {
  _id?: string;
  siteName: string;
  siteTagline: string;
  contactEmail: string;
  contactPhone: string;
  contactAddress: string;
  socialLinks: {
    twitter: string;
    facebook: string;
    instagram: string;
    linkedin: string;
    youtube: string;
  };
  footer: {
    copyrightText: string;
    showSocialLinks: boolean;
  };
  meta: {
    description: string;
    keywords: string;
  };
}

const initialSettings: Settings = {
  siteName: "Talking with Tech Leaders",
  siteTagline: "Insights from industry innovators",
  contactEmail: "",
  contactPhone: "",
  contactAddress: "",
  socialLinks: {
    twitter: "",
    facebook: "",
    instagram: "",
    linkedin: "",
    youtube: ""
  },
  footer: {
    copyrightText: `© ${new Date().getFullYear()} Talking with Tech Leaders. All rights reserved.`,
    showSocialLinks: true
  },
  meta: {
    description: "",
    keywords: ""
  }
};

const ManageSettings = () => {
  const [settings, setSettings] = useState<Settings>(initialSettings);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await fetch(`${import.meta.env.VITE_API_URL}/settings`, {
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
        },
      });

      const data = await response.json();

      if (data.success && data.data.length > 0) {
        setSettings(data.data[0]);
      }
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to fetch settings",
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
    
    // Handle nested objects
    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setSettings((prev) => ({
        ...prev,
        [parent]: {
          ...(prev[parent as keyof Settings] as Record<string, any>),
          [child]: value
        }
      }));
    } else {
      setSettings((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSocialChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setSettings((prev) => ({
      ...prev,
      socialLinks: {
        ...prev.socialLinks,
        [name]: value
      }
    }));
  };

  const handleSwitchChange = (checked: boolean, name: string) => {
    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setSettings((prev) => ({
        ...prev,
        [parent]: {
          ...(prev[parent as keyof Settings] as Record<string, any>),
          [child]: checked
        }
      }));
    } else {
      setSettings((prev) => ({ ...prev, [name]: checked }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      const token = localStorage.getItem("token");
      const url = settings._id
        ? `${import.meta.env.VITE_API_URL}/settings/${settings._id}`
        : `${import.meta.env.VITE_API_URL}/settings`;
      const method = settings._id ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
        body: JSON.stringify(settings),
      });

      const data = await response.json();

      if (data.success) {
        if (!settings._id) {
          setSettings({ ...settings, _id: data.data._id });
        }
        toast({
          title: "Success",
          description: "Settings updated successfully",
        });
      } else {
        setError(data.error || "Failed to save settings");
        toast({
          title: "Error",
          description: data.error || "Failed to save settings",
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
    return <div className="text-center py-10">Loading settings...</div>;
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Site Settings</h1>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit}>
        <Tabs defaultValue="general" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="contact">Contact</TabsTrigger>
            <TabsTrigger value="social">Social Media</TabsTrigger>
            <TabsTrigger value="seo">SEO & Footer</TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>General Settings</CardTitle>
                <CardDescription>
                  Basic information about your website
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="siteName">Site Name</Label>
                  <Input
                    id="siteName"
                    name="siteName"
                    value={settings.siteName}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="siteTagline">Site Tagline</Label>
                  <Input
                    id="siteTagline"
                    name="siteTagline"
                    value={settings.siteTagline}
                    onChange={handleChange}
                    required
                  />
                  <p className="text-sm text-muted-foreground">
                    A short description that appears in the header
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="contact" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
                <CardDescription>
                  How visitors can reach you
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="contactEmail">Contact Email</Label>
                  <Input
                    id="contactEmail"
                    name="contactEmail"
                    type="email"
                    value={settings.contactEmail}
                    onChange={handleChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contactPhone">Contact Phone</Label>
                  <Input
                    id="contactPhone"
                    name="contactPhone"
                    value={settings.contactPhone}
                    onChange={handleChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contactAddress">Address</Label>
                  <Textarea
                    id="contactAddress"
                    name="contactAddress"
                    value={settings.contactAddress}
                    onChange={handleChange}
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="social" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Social Media Links</CardTitle>
                <CardDescription>
                  Connect your social media profiles
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="twitter">Twitter/X</Label>
                  <Input
                    id="twitter"
                    name="twitter"
                    value={settings.socialLinks.twitter}
                    onChange={handleSocialChange}
                    placeholder="https://twitter.com/yourusername"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="facebook">Facebook</Label>
                  <Input
                    id="facebook"
                    name="facebook"
                    value={settings.socialLinks.facebook}
                    onChange={handleSocialChange}
                    placeholder="https://facebook.com/yourpage"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="instagram">Instagram</Label>
                  <Input
                    id="instagram"
                    name="instagram"
                    value={settings.socialLinks.instagram}
                    onChange={handleSocialChange}
                    placeholder="https://instagram.com/yourusername"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="linkedin">LinkedIn</Label>
                  <Input
                    id="linkedin"
                    name="linkedin"
                    value={settings.socialLinks.linkedin}
                    onChange={handleSocialChange}
                    placeholder="https://linkedin.com/in/yourusername"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="youtube">YouTube</Label>
                  <Input
                    id="youtube"
                    name="youtube"
                    value={settings.socialLinks.youtube}
                    onChange={handleSocialChange}
                    placeholder="https://youtube.com/c/yourchannel"
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="seo" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>SEO & Footer Settings</CardTitle>
                <CardDescription>
                  Search engine optimization and footer configuration
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="meta.description">Meta Description</Label>
                  <Textarea
                    id="meta.description"
                    name="meta.description"
                    value={settings.meta.description}
                    onChange={handleChange}
                    rows={3}
                  />
                  <p className="text-sm text-muted-foreground">
                    A brief description of your site for search engines (150-160 characters recommended)
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="meta.keywords">Meta Keywords</Label>
                  <Input
                    id="meta.keywords"
                    name="meta.keywords"
                    value={settings.meta.keywords}
                    onChange={handleChange}
                    placeholder="tech, interviews, leadership, innovation"
                  />
                  <p className="text-sm text-muted-foreground">
                    Comma-separated keywords for search engines
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="footer.copyrightText">Copyright Text</Label>
                  <Input
                    id="footer.copyrightText"
                    name="footer.copyrightText"
                    value={settings.footer.copyrightText}
                    onChange={handleChange}
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="footer.showSocialLinks"
                    checked={settings.footer.showSocialLinks}
                    onCheckedChange={(checked) => 
                      handleSwitchChange(checked, "footer.showSocialLinks")
                    }
                  />
                  <Label htmlFor="footer.showSocialLinks">
                    Show social links in footer
                  </Label>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end mt-6">
          <Button type="submit" disabled={saving}>
            {saving ? (
              "Saving..."
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" /> Save Settings
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ManageSettings; 