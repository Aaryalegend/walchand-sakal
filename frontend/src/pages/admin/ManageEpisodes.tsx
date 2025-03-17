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
  Calendar,
  Clock
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

interface Episode {
  _id: string;
  title: string;
  date: string;
  speaker: string;
  speakerRole: string;
  thumbnail: string;
  duration: string;
  summary: string;
  videoId: string;
  topics: string[];
}

const ManageEpisodes = () => {
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [filteredEpisodes, setFilteredEpisodes] = useState<Episode[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [episodeToDelete, setEpisodeToDelete] = useState<string | null>(null);
  const { toast } = useToast();
  const itemsPerPage = 10;

  useEffect(() => {
    fetchEpisodes();
  }, []);

  useEffect(() => {
    // Filter episodes based on search query
    const filtered = episodes.filter(
      (episode) =>
        episode.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        episode.speaker.toLowerCase().includes(searchQuery.toLowerCase()) ||
        episode.speakerRole.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (episode.topics && episode.topics.some(topic => 
          topic.toLowerCase().includes(searchQuery.toLowerCase())
        ))
    );
    setFilteredEpisodes(filtered);
    setTotalPages(Math.max(1, Math.ceil(filtered.length / itemsPerPage)));
    setCurrentPage(1);
  }, [searchQuery, episodes]);

  const fetchEpisodes = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/episodes`);
      const data = await response.json();

      if (data.success) {
        setEpisodes(data.data);
        setFilteredEpisodes(data.data);
        setTotalPages(Math.max(1, Math.ceil(data.data.length / itemsPerPage)));
      } else {
        toast({
          title: "Error",
          description: "Failed to fetch episodes",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error fetching episodes:", error);
      toast({
        title: "Error",
        description: "Failed to connect to the server",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (id: string) => {
    setEpisodeToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!episodeToDelete) return;

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${import.meta.env.VITE_API_URL}/episodes/${episodeToDelete}`, {
        method: "DELETE",
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
        },
      });

      const data = await response.json();

      if (data.success) {
        toast({
          title: "Success",
          description: "Episode deleted successfully",
        });
        setEpisodes(episodes.filter((episode) => episode._id !== episodeToDelete));
      } else {
        toast({
          title: "Error",
          description: data.error || "Failed to delete episode",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error deleting episode:", error);
      toast({
        title: "Error",
        description: "Failed to connect to the server",
        variant: "destructive",
      });
    } finally {
      setDeleteDialogOpen(false);
      setEpisodeToDelete(null);
    }
  };

  const currentEpisodes = filteredEpisodes.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Episodes</h1>
          <p className="text-muted-foreground mt-1">
            Manage all episodes in the podcast
          </p>
        </div>
        <Button asChild>
          <Link to="/admin/episodes/new">
            <Plus size={16} className="mr-2" />
            Add Episode
          </Link>
        </Button>
      </div>

      <div className="relative w-full md:w-96">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3">
          <Search size={18} className="text-muted-foreground" />
        </div>
        <Input
          type="text"
          placeholder="Search episodes..."
          className="pl-10"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {loading ? (
        <div className="text-center py-10">
          <p>Loading episodes...</p>
        </div>
      ) : currentEpisodes.length === 0 ? (
        <div className="text-center py-10 border rounded-lg">
          <p className="text-muted-foreground">No episodes found</p>
          {searchQuery && (
            <Button 
              variant="outline" 
              className="mt-2"
              onClick={() => setSearchQuery("")}
            >
              Clear Search
            </Button>
          )}
        </div>
      ) : (
        <div className="border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[400px]">Title</TableHead>
                <TableHead>Speaker</TableHead>
                <TableHead className="hidden md:table-cell">Date</TableHead>
                <TableHead className="hidden md:table-cell">Duration</TableHead>
                <TableHead className="hidden lg:table-cell">Topics</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentEpisodes.map((episode) => (
                <TableRow key={episode._id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-3">
                      <img
                        src={episode.thumbnail}
                        alt={episode.title}
                        className="w-12 h-8 object-cover rounded"
                      />
                      <span className="line-clamp-1">{episode.title}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{episode.speaker}</div>
                      <div className="text-xs text-muted-foreground">
                        {episode.speakerRole}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <div className="flex items-center">
                      <Calendar size={14} className="mr-1 text-muted-foreground" />
                      {episode.date}
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <div className="flex items-center">
                      <Clock size={14} className="mr-1 text-muted-foreground" />
                      {episode.duration}
                    </div>
                  </TableCell>
                  <TableCell className="hidden lg:table-cell">
                    <div className="flex flex-wrap gap-1 max-w-[250px]">
                      {episode.topics && episode.topics.map((topic, index) => (
                        <span
                          key={index}
                          className="inline-block px-2 py-1 bg-secondary text-xs rounded-full"
                        >
                          {topic}
                        </span>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        asChild
                      >
                        <Link to={`/admin/episodes/edit/${episode._id}`}>
                          <Edit size={16} />
                          <span className="sr-only">Edit</span>
                        </Link>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteClick(episode._id)}
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
              episode from the database.
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

export default ManageEpisodes; 