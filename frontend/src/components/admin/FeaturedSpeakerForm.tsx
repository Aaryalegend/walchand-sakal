import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface FeaturedSpeakerFormProps {
  isEdit?: boolean;
}

interface FormData {
  name: string;
  role: string;
  organization: string;
  image: string;
  bio: string;
}

const initialFormData: FormData = {
  name: "",
  role: "",
  organization: "",
  image: "",
  bio: "",
};

const FeaturedSpeakerForm: React.FC<FeaturedSpeakerFormProps> = ({ isEdit = false }) => {
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [fetchLoading, setFetchLoading] = useState(isEdit);
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    const fetchSpeaker = async () => {
      if (!isEdit || !id) return;

      try {
        const token = localStorage.getItem("token");
        const response = await fetch(`${import.meta.env.VITE_API_URL}/featured-speakers/${id}`, {
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
          });
        } else {
          setError("Failed to fetch featured speaker");
        }
      } catch (err) {
        setError("Error connecting to the server");
        console.error(err);
      } finally {
        setFetchLoading(false);
      }
    };

    fetchSpeaker();
  }, [id, isEdit]);

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
      const token = localStorage.getItem("token");
      const url = isEdit
        ? `${import.meta.env.VITE_API_URL}/featured-speakers/${id}`
        : `${import.meta.env.VITE_API_URL}/featured-speakers`;
      const method = isEdit ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        navigate("/admin/featured-speakers");
      } else {
        setError(data.error || "Failed to save featured speaker");
      }
    } catch (err) {
      setError("Error connecting to the server");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (fetchLoading) {
    return <div className="text-center py-10">Loading featured speaker data...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="icon"
          onClick={() => navigate("/admin/featured-speakers")}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-3xl font-bold tracking-tight">
          {isEdit ? "Edit" : "Add"} Featured Speaker
        </h1>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Card>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid gap-3">
              <Label htmlFor="name">Speaker Name</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
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
                required
              />
              {formData.image && (
                <div className="mt-2">
                  <p className="text-sm text-muted-foreground mb-2">Preview:</p>
                  <img
                    src={formData.image}
                    alt="Profile preview"
                    className="w-20 h-20 object-cover rounded-full"
                  />
                </div>
              )}
            </div>

            <div className="grid gap-3">
              <Label htmlFor="bio">Bio</Label>
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
                onClick={() => navigate("/admin/featured-speakers")}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? "Saving..." : isEdit ? "Update Speaker" : "Create Speaker"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default FeaturedSpeakerForm; 