import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Edit, 
  Trash2, 
  Plus, 
  Search,
  Building,
  User
} from "lucide-react";
import { 
  Pagination, 
  PaginationContent, 
  PaginationItem, 
  PaginationLink, 
  PaginationNext, 
  PaginationPrevious 
} from "@/components/ui/pagination";
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
import { Badge } from "@/components/ui/badge";

interface Speaker {
  _id: string;
  name: string;
  role: string;
  organization: string;
  image: string;
  bio: string;
  topics: string[];
}

const ManageSpeakers = () => {
  const [speakers, setSpeakers] = useState<Speaker[]>([]);
  const [filteredSpeakers, setFilteredSpeakers] = useState<Speaker[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [speakerToDelete, setSpeakerToDelete] = useState<string | null>(null);
  const { toast } = useToast();
  const itemsPerPage = 10;

  useEffect(() => {
    fetchSpeakers();
  }, []);

  useEffect(() => {
    // Filter speakers based on search query
    const filtered = speakers.filter(
      (speaker) =>
        speaker.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        speaker.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
        speaker.organization.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (speaker.topics && speaker.topics.some(topic => 
          topic.toLowerCase().includes(searchQuery.toLowerCase())
        ))
    );
    setFilteredSpeakers(filtered);
    setTotalPages(Math.max(1, Math.ceil(filtered.length / itemsPerPage)));
    setCurrentPage(1);
  }, [searchQuery, speakers]);

  const fetchSpeakers = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${import.meta.env.VITE_API_URL}/speakers`, {
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
        },
      });

      const data = await response.json();

      if (data.success) {
        setSpeakers(data.data);
        setFilteredSpeakers(data.data);
        setTotalPages(Math.max(1, Math.ceil(data.data.length / itemsPerPage)));
      } else {
        toast({
          title: "Error",
          description: "Failed to fetch speakers",
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
    setSpeakerToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!speakerToDelete) return;

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/speakers/${speakerToDelete}`,
        {
          method: "DELETE",
          headers: {
            Authorization: token ? `Bearer ${token}` : "",
          },
        }
      );

      const data = await response.json();

      if (data.success) {
        setSpeakers((prevSpeakers) =>
          prevSpeakers.filter((speaker) => speaker._id !== speakerToDelete)
        );
        toast({
          title: "Success",
          description: "Speaker deleted successfully",
        });
      } else {
        toast({
          title: "Error",
          description: data.error || "Failed to delete speaker",
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
      setSpeakerToDelete(null);
    }
  };

  // Get current page speakers
  const currentSpeakers = filteredSpeakers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Manage Speakers</h1>
        <Button asChild>
          <Link to="/admin/speakers/new">
            <Plus className="mr-2 h-4 w-4" /> Add New Speaker
          </Link>
        </Button>
      </div>

      <div className="relative mb-6">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search speakers by name, role, organization or topic..."
          className="pl-8"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {loading ? (
        <div className="text-center py-10">Loading speakers...</div>
      ) : currentSpeakers.length === 0 ? (
        <div className="text-center py-10">
          {searchQuery
            ? "No speakers match your search criteria"
            : "No speakers found. Add your first speaker!"}
        </div>
      ) : (
        <div className="border rounded-md mb-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Image</TableHead>
                <TableHead>Name</TableHead>
                <TableHead className="hidden md:table-cell">Role</TableHead>
                <TableHead className="hidden md:table-cell">Organization</TableHead>
                <TableHead className="hidden lg:table-cell">Topics</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentSpeakers.map((speaker) => (
                <TableRow key={speaker._id}>
                  <TableCell>
                    <img
                      src={speaker.image}
                      alt={speaker.name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  </TableCell>
                  <TableCell className="font-medium">{speaker.name}</TableCell>
                  <TableCell className="hidden md:table-cell">
                    <div className="flex items-center">
                      <User className="h-4 w-4 mr-1" />
                      {speaker.role}
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <div className="flex items-center">
                      <Building className="h-4 w-4 mr-1" />
                      {speaker.organization}
                    </div>
                  </TableCell>
                  <TableCell className="hidden lg:table-cell">
                    <div className="flex flex-wrap gap-1">
                      {speaker.topics && speaker.topics.slice(0, 3).map((topic, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {topic}
                        </Badge>
                      ))}
                      {speaker.topics && speaker.topics.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{speaker.topics.length - 3}
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                      >
                        <Link to={`/admin/speakers/edit/${speaker._id}`}>
                          <Edit size={16} />
                          <span className="sr-only">Edit</span>
                        </Link>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteClick(speaker._id)}
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

      {totalPages > 1 && (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                aria-disabled={currentPage === 1}
                tabIndex={currentPage === 1 ? -1 : 0}
                className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
              />
            </PaginationItem>
            {[...Array(totalPages)].map((_, i) => (
              <PaginationItem key={i}>
                <PaginationLink
                  onClick={() => setCurrentPage(i + 1)}
                  isActive={currentPage === i + 1}
                >
                  {i + 1}
                </PaginationLink>
              </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationNext
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                aria-disabled={currentPage === totalPages}
                tabIndex={currentPage === totalPages ? -1 : 0}
                className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              speaker from the database.
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

export default ManageSpeakers; 