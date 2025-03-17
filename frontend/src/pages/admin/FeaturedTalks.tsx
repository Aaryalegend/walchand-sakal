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
  Star, 
  StarOff 
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

interface FeaturedTalk {
  _id: string;
  title: string;
  speaker: string;
  speakerRole: string;
  thumbnail: string;
  duration: string;
  featured: boolean;
  createdAt: string;
}

const FeaturedTalks = () => {
  const [talks, setTalks] = useState<FeaturedTalk[]>([]);
  const [filteredTalks, setFilteredTalks] = useState<FeaturedTalk[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [talkToDelete, setTalkToDelete] = useState<string | null>(null);

  useEffect(() => {
    const fetchTalks = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(`${import.meta.env.VITE_API_URL}/featured-talks`, {
          headers: {
            Authorization: token ? `Bearer ${token}` : "",
          },
        });

        const data = await response.json();

        if (data.success) {
          setTalks(data.data);
          setFilteredTalks(data.data);
        } else {
          setError("Failed to fetch featured talks");
        }
      } catch (err) {
        setError("Error connecting to the server");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchTalks();
  }, []);

  useEffect(() => {
    if (searchTerm) {
      const filtered = talks.filter(
        (talk) =>
          talk.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          talk.speaker.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredTalks(filtered);
      setCurrentPage(1);
    } else {
      setFilteredTalks(talks);
    }
  }, [searchTerm, talks]);

  const confirmDelete = (id: string) => {
    setTalkToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!talkToDelete) return;

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${import.meta.env.VITE_API_URL}/featured-talks/${talkToDelete}`, {
        method: "DELETE",
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
        },
      });

      const data = await response.json();

      if (data.success) {
        setTalks(prevTalks => prevTalks.filter(talk => talk._id !== talkToDelete));
        setFilteredTalks(prevTalks => prevTalks.filter(talk => talk._id !== talkToDelete));
      } else {
        setError("Failed to delete featured talk");
      }
    } catch (err) {
      setError("Error connecting to the server");
      console.error(err);
    } finally {
      setDeleteDialogOpen(false);
      setTalkToDelete(null);
    }
  };

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredTalks.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredTalks.length / itemsPerPage);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  if (loading) {
    return <div className="text-center py-10">Loading featured talks...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Featured Talks</h1>
          <p className="text-muted-foreground mt-1">
            Manage talks that appear on the homepage
          </p>
        </div>
        <Button asChild>
          <Link to="/admin/featured-talks/new">
            <Plus className="mr-2 h-4 w-4" /> Add Talk
          </Link>
        </Button>
      </div>

      {error && (
        <div className="bg-destructive/15 text-destructive px-4 py-2 rounded-md">
          {error}
        </div>
      )}

      <div className="flex justify-between items-center">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search talks..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Speaker</TableHead>
              <TableHead className="hidden md:table-cell">Duration</TableHead>
              <TableHead className="hidden md:table-cell">Featured</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentItems.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center h-24">
                  No featured talks found.
                </TableCell>
              </TableRow>
            ) : (
              currentItems.map((talk) => (
                <TableRow key={talk._id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-3">
                      <img
                        src={talk.thumbnail}
                        alt={talk.title}
                        className="h-10 w-16 object-cover rounded"
                      />
                      <span className="line-clamp-2">{talk.title}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div>{talk.speaker}</div>
                      <div className="text-sm text-muted-foreground">
                        {talk.speakerRole}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {talk.duration}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {talk.featured ? (
                      <Star className="h-4 w-4 text-yellow-500" />
                    ) : (
                      <StarOff className="h-4 w-4 text-muted-foreground" />
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="icon" asChild>
                        <Link to={`/admin/featured-talks/edit/${talk._id}`}>
                          <Edit className="h-4 w-4" />
                          <span className="sr-only">Edit</span>
                        </Link>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => confirmDelete(talk._id)}
                      >
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Delete</span>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {filteredTalks.length > itemsPerPage && (
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
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <PaginationItem key={page}>
                <PaginationLink
                  onClick={() => paginate(page)}
                  isActive={page === currentPage}
                >
                  {page}
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
              featured talk from the database.
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

export default FeaturedTalks; 