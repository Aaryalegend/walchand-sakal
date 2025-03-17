import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/components/ui/use-toast";

interface SpeakerFormProps {
  isEdit?: boolean;
}

interface FormData {
  name: string;
  role: string;
  organization: string;
  image: string;
  bio: string;
  topics: string;
}

const initialFormData: FormData = {
  name: "",
  role: "",
  organization: "",
  image: "",
  bio: "",
  topics: "",
};

const SpeakerForm: React.FC<SpeakerFormProps> = ({ isEdit = false }) => {
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [fetchLoading, setFetchLoading] = useState(isEdit);
  const navigate = useNavigate();
  const { id } = useParams();
  const { toast } = useToast();

  useEffect(() => {
    if (!isEdit || !id) return;

    const fetchSpeaker = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(`${import.meta.env.VITE_API_URL}/speakers/${id}`, {
          headers: {
            Authorization: token ? `Bearer ${token}` : "",
          },
        });

        const data = await response.json();

        if (data.success) {
          setFormData({
            name: data.data.name,
            role: data.data.role,
            organization: data.data.organization,
            image: data.data.image,
            bio: data.data.bio,
            topics: data.data.topics ? data.data.topics.join(", ") : "",
          });
        } else {
          setError("Failed to fetch speaker");
          toast({
            title: "Error",
            description: "Failed to fetch speaker details",
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
        setFetchLoading(false);
      }
    };

    fetchSpeaker();
  }, [id, isEdit, toast]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Convert comma-separated topics to array
      const topicsArray = formData.topics
        .split(",")
        .map((topic) => topic.trim())
        .filter((topic) => topic);

      const token = localStorage.getItem("token");
      const url = isEdit
        ? `${import.meta.env.VITE_API_URL}/speakers/${id}`
        : `${import.meta.env.VITE_API_URL}/speakers`;
      const method = isEdit ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
        body: JSON.stringify({
          ...formData,
          topics: topicsArray,
        }),
      });

      const data = await response.json();

      if (data.success) {
        toast({
          title: "Success",
          description: isEdit 
            ? "Speaker updated successfully" 
            : "New speaker created successfully",
        });
        navigate("/admin/speakers");
      } else {
        setError(data.error || "Failed to save speaker");
        toast({
          title: "Error",
          description: data.error || "Failed to save speaker",
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
      setLoading(false);
    }
  };

  if (fetchLoading) {
    return <div className="text-center py-10">Loading speaker data...</div>;
  }

  return (
    <div>
      <div className="flex items-center mb-6">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate("/admin/speakers")}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-2xl font-bold ml-2">
          {isEdit ? "Edit Speaker" : "Create New Speaker"}
        </h1>
      </div>

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Card>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit}>
            <div className="grid gap-6">
              <div className="grid gap-3">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="John Doe"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="grid gap-3">
                  <Label htmlFor="role">Role</Label>
                  <Input
                    id="role"
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    placeholder="Chief Technology Officer"
                    required
                  />
                </div>

                <div className="grid gap-3">
                  <Label htmlFor="organization">Organization</Label>
                  <Input
                    id="organization"
                    name="organization"
                    value={formData.organization}
                    onChange={handleChange}
                    placeholder="Tech Company Inc."
                    required
                  />
                </div>
              </div>

              <div className="grid gap-3">
                <Label htmlFor="image">Profile Image URL</Label>
                <Input
                  id="image"
                  name="image"
                  value={formData.image}
                  onChange={handleChange}
                  placeholder="https://example.com/images/profile.jpg"
                  required
                />
                <p className="text-sm text-muted-foreground">
                  Enter a URL to the speaker's profile image
                </p>
              </div>

              <div className="grid gap-3">
                <Label htmlFor="topics">Topics (comma-separated)</Label>
                <Input
                  id="topics"
                  name="topics"
                  value={formData.topics}
                  onChange={handleChange}
                  placeholder="AI, Technology, Future"
                  required
                />
              </div>

              <div className="grid gap-3">
                <Label htmlFor="bio">Biography</Label>
                <Textarea
                  id="bio"
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  rows={5}
                  required
                />
              </div>

              <div className="flex justify-end gap-3 pt-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate("/admin/speakers")}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading ? "Saving..." : isEdit ? "Update Speaker" : "Create Speaker"}
                </Button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default SpeakerForm; 