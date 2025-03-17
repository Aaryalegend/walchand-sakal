import React, { useState, useEffect } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Edit, 
  Trash2, 
  Plus,
  BarChart3
} from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/components/ui/use-toast";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface Stat {
  _id: string;
  label: string;
  value: string;
}

const ManageStats = () => {
  const [stats, setStats] = useState<Stat[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [statToDelete, setStatToDelete] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<{ label: string; value: string }>({
    label: "",
    value: "",
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${import.meta.env.VITE_API_URL}/stats`, {
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
        },
      });

      const data = await response.json();

      if (data.success) {
        setStats(data.data);
      } else {
        toast({
          title: "Error",
          description: "Failed to fetch statistics",
          variant: "destructive",
        });
      }
    } catch (err) {
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

  const handleDeleteClick = (id: string) => {
    setStatToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!statToDelete) return;

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/stats/${statToDelete}`,
        {
          method: "DELETE",
          headers: {
            Authorization: token ? `Bearer ${token}` : "",
          },
        }
      );

      const data = await response.json();

      if (data.success) {
        setStats((prevStats) =>
          prevStats.filter((stat) => stat._id !== statToDelete)
        );
        toast({
          title: "Success",
          description: "Statistic deleted successfully",
        });
      } else {
        toast({
          title: "Error",
          description: data.error || "Failed to delete statistic",
          variant: "destructive",
        });
      }
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to connect to the server",
        variant: "destructive",
      });
      console.error(err);
    } finally {
      setDeleteDialogOpen(false);
      setStatToDelete(null);
    }
  };

  const handleEditClick = (stat: Stat) => {
    setFormData({ label: stat.label, value: stat.value });
    setEditingId(stat._id);
    setShowForm(true);
  };

  const handleAddNew = () => {
    setFormData({ label: "", value: "" });
    setEditingId(null);
    setShowForm(true);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const token = localStorage.getItem("token");
      const url = editingId
        ? `${import.meta.env.VITE_API_URL}/stats/${editingId}`
        : `${import.meta.env.VITE_API_URL}/stats`;
      const method = editingId ? "PUT" : "POST";

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
        if (editingId) {
          setStats(
            stats.map((stat) =>
              stat._id === editingId
                ? { ...stat, label: formData.label, value: formData.value }
                : stat
            )
          );
          toast({
            title: "Success",
            description: "Statistic updated successfully",
          });
        } else {
          setStats([...stats, data.data]);
          toast({
            title: "Success",
            description: "New statistic created successfully",
          });
        }
        setShowForm(false);
        setFormData({ label: "", value: "" });
        setEditingId(null);
      } else {
        toast({
          title: "Error",
          description: data.error || "Failed to save statistic",
          variant: "destructive",
        });
      }
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to connect to the server",
        variant: "destructive",
      });
      console.error(err);
    }
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Manage Statistics</h1>
        <Button onClick={handleAddNew}>
          <Plus className="mr-2 h-4 w-4" /> Add New Statistic
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Statistics</CardTitle>
          <CardDescription>
            Manage the statistics shown on the About page.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {showForm && (
            <form onSubmit={handleSubmit} className="mb-6 p-4 border rounded-md">
              <h2 className="text-lg font-semibold mb-4">
                {editingId ? "Edit Statistic" : "Add New Statistic"}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <Label htmlFor="label">Label</Label>
                  <Input
                    id="label"
                    name="label"
                    value={formData.label}
                    onChange={handleChange}
                    placeholder="e.g., Speakers"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="value">Value</Label>
                  <Input
                    id="value"
                    name="value"
                    value={formData.value}
                    onChange={handleChange}
                    placeholder="e.g., 50+"
                    required
                  />
                </div>
              </div>
              <div className="flex justify-end gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowForm(false);
                    setEditingId(null);
                  }}
                >
                  Cancel
                </Button>
                <Button type="submit">
                  {editingId ? "Update Statistic" : "Add Statistic"}
                </Button>
              </div>
            </form>
          )}

          {loading ? (
            <div className="text-center py-10">Loading statistics...</div>
          ) : stats.length === 0 ? (
            <div className="text-center py-10">
              No statistics available. Add some!
            </div>
          ) : (
            <div className="border rounded-md">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead style={{ width: "40%" }}>Label</TableHead>
                    <TableHead style={{ width: "40%" }}>Value</TableHead>
                    <TableHead style={{ width: "20%" }}>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {stats.map((stat) => (
                    <TableRow key={stat._id}>
                      <TableCell className="font-medium">{stat.label}</TableCell>
                      <TableCell>{stat.value}</TableCell>
                      <TableCell>
                        <div className="flex space-x-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEditClick(stat)}
                          >
                            <Edit size={16} className="text-primary" />
                            <span className="sr-only">Edit</span>
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteClick(stat._id)}
                          >
                            <Trash2 size={16} className="text-destructive" />
                            <span className="sr-only">Delete</span>
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              statistic from the database.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ManageStats; 