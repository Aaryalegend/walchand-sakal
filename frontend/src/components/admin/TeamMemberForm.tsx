import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/components/ui/use-toast";

interface TeamMemberFormProps {
  isEdit?: boolean;
}

interface FormData {
  name: string;
  role: string;
  image: string;
}

const initialFormData: FormData = {
  name: "",
  role: "",
  image: "",
};

const TeamMemberForm: React.FC<TeamMemberFormProps> = ({ isEdit = false }) => {
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [fetchLoading, setFetchLoading] = useState(isEdit);
  const navigate = useNavigate();
  const { id } = useParams();
  const { toast } = useToast();

  useEffect(() => {
    if (!isEdit || !id) return;

    const fetchTeamMember = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(`${import.meta.env.VITE_API_URL}/team/${id}`, {
          headers: {
            Authorization: token ? `Bearer ${token}` : "",
          },
        });

        const data = await response.json();

        if (data.success) {
          setFormData({
            name: data.data.name,
            role: data.data.role,
            image: data.data.image,
          });
        } else {
          setError("Failed to fetch team member");
          toast({
            title: "Error",
            description: "Failed to fetch team member details",
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

    fetchTeamMember();
  }, [id, isEdit, toast]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
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
        ? `${import.meta.env.VITE_API_URL}/team/${id}`
        : `${import.meta.env.VITE_API_URL}/team`;
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
        toast({
          title: "Success",
          description: isEdit 
            ? "Team member updated successfully" 
            : "New team member created successfully",
        });
        navigate("/admin/team");
      } else {
        setError(data.error || "Failed to save team member");
        toast({
          title: "Error",
          description: data.error || "Failed to save team member",
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
    return <div className="text-center py-10">Loading team member data...</div>;
  }

  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <Button
          variant="ghost"
          onClick={() => navigate("/admin/team")}
          className="mb-4 p-0 hover:bg-transparent"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Team Members
        </Button>
        <h1 className="text-2xl font-bold">
          {isEdit ? "Edit Team Member" : "Add New Team Member"}
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
            <div className="space-y-4">
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

              <div className="grid gap-3">
                <Label htmlFor="role">Role</Label>
                <Input
                  id="role"
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  placeholder="Event Coordinator"
                  required
                />
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
                  Enter a URL to the team member's profile image
                </p>
              </div>

              <div className="flex justify-end gap-3 pt-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate("/admin/team")}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading ? "Saving..." : isEdit ? "Update Team Member" : "Create Team Member"}
                </Button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default TeamMemberForm; 