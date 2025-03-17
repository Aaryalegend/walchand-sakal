import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface FeaturedTalkFormProps {
  isEdit?: boolean;
}

interface FormData {
  title: string;
  speaker: string;
  speakerRole: string;
  thumbnail: string;
  duration: string;
  featured: boolean;
}

const initialFormData: FormData = {
  title: "",
  speaker: "",
  speakerRole: "",
  thumbnail: "",
  duration: "",
  featured: false,
};

const FeaturedTalkForm: React.FC<FeaturedTalkFormProps> = ({ isEdit = false }) => {
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [fetchLoading, setFetchLoading] = useState(isEdit);
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    const fetchTalk = async () => {
      if (!isEdit || !id) return;

      try {
        const token = localStorage.getItem("token");
        const response = await fetch(`${import.meta.env.VITE_API_URL}/featured-talks/${id}`, {
          headers: {
            Authorization: token ? `Bearer ${token}` : "",
          },
        });

        const data = await response.json();

        if (data.success) {
          setFormData({
            title: data.data.title,
            speaker: data.data.speaker,
            speakerRole: data.data.speakerRole,
            thumbnail: data.data.thumbnail,
            duration: data.data.duration,
            featured: data.data.featured,
          });
        } else {
          setError("Failed to fetch featured talk");
        }
      } catch (err) {
        setError("Error connecting to the server");
        console.error(err);
      } finally {
        setFetchLoading(false);
      }
    };

    fetchTalk();
  }, [id, isEdit]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (checked: boolean) => {
    setFormData((prev) => ({ ...prev, featured: checked }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("token");
      const url = isEdit
        ? `${import.meta.env.VITE_API_URL}/featured-talks/${id}`
        : `${import.meta.env.VITE_API_URL}/featured-talks`;
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
        navigate("/admin/featured-talks");
      } else {
        setError(data.error || "Failed to save featured talk");
      }
    } catch (err) {
      setError("Error connecting to the server");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (fetchLoading) {
    return <div className="text-center py-10">Loading featured talk data...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="icon"
          onClick={() => navigate("/admin/featured-talks")}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-3xl font-bold tracking-tight">
          {isEdit ? "Edit" : "Add"} Featured Talk
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
              <Label htmlFor="title">Talk Title</Label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="grid gap-3">
                <Label htmlFor="speaker">Speaker Name</Label>
                <Input
                  id="speaker"
                  name="speaker"
                  value={formData.speaker}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="grid gap-3">
                <Label htmlFor="speakerRole">Speaker Role</Label>
                <Input
                  id="speakerRole"
                  name="speakerRole"
                  value={formData.speakerRole}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="grid gap-3">
              <Label htmlFor="thumbnail">Thumbnail URL</Label>
              <Input
                id="thumbnail"
                name="thumbnail"
                value={formData.thumbnail}
                onChange={handleChange}
                required
              />
              {formData.thumbnail && (
                <div className="mt-2">
                  <p className="text-sm text-muted-foreground mb-2">Preview:</p>
                  <img
                    src={formData.thumbnail}
                    alt="Thumbnail preview"
                    className="max-w-[300px] h-auto rounded-md"
                  />
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="grid gap-3">
                <Label htmlFor="duration">Duration</Label>
                <Input
                  id="duration"
                  name="duration"
                  placeholder="e.g. 18:42"
                  value={formData.duration}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="flex items-end pb-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="featured"
                    checked={formData.featured}
                    onCheckedChange={handleCheckboxChange}
                  />
                  <Label htmlFor="featured">Feature on homepage</Label>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/admin/featured-talks")}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? "Saving..." : isEdit ? "Update Talk" : "Create Talk"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default FeaturedTalkForm; 