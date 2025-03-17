
import React from "react";
import { Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AdminEpisodeListProps {
  searchQuery: string;
  onEdit: (episode: any) => void;
  onDelete: (episode: any) => void;
}

const AdminEpisodeList: React.FC<AdminEpisodeListProps> = ({
  searchQuery,
  onEdit,
  onDelete,
}) => {
  // Sample data for episodes (In a real app, this would come from a database)
  const allEpisodes = [
    {
      id: "e001",
      title: "Designing Products That Shape Our Future",
      date: "Oct 15, 2025",
      speaker: "Alex Johnson",
      speakerRole: "Product Design Director",
      thumbnail: "https://images.unsplash.com/photo-1523580494863-6f3031224c94?ixlib=rb-4.0.3&auto=format&fit=crop&w=1740&q=80",
      duration: "18:42",
      summary: "Alex explores how thoughtful product design can create positive social impact and shape behavior at scale. He shares case studies from his work in creating products that balance business objectives with human needs and values.",
      videoId: "dQw4w9WgXcQ", // Sample YouTube ID
      topics: ["Design", "Product Development", "Technology Ethics"],
    },
    {
      id: "e002",
      title: "The Power of AI in Healthcare",
      date: "Sep 28, 2025",
      speaker: "Sarah Chen",
      speakerRole: "Healthcare Innovator",
      thumbnail: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?ixlib=rb-4.0.3&auto=format&fit=crop&w=1740&q=80",
      duration: "22:15",
      summary: "Sarah discusses how artificial intelligence is transforming patient care through improved diagnostics, personalized treatment plans, and preventative health measures. She addresses both the immense potential and ethical challenges of implementing AI in healthcare settings.",
      videoId: "QH2-TGUlwu4", // Sample YouTube ID
      topics: ["Healthcare", "Artificial Intelligence", "Medical Innovation"],
    },
    {
      id: "e003",
      title: "Climate Solutions for a Sustainable Future",
      date: "Sep 10, 2025",
      speaker: "Michael Rivera",
      speakerRole: "Environmental Scientist",
      thumbnail: "https://images.unsplash.com/photo-1498855926480-d98e83099315?ixlib=rb-4.0.3&auto=format&fit=crop&w=1740&q=80",
      duration: "25:10",
      summary: "Michael presents innovative approaches to addressing climate change through renewable energy, carbon capture technologies, and policy reform. He emphasizes the importance of collaborative action across private, public, and individual sectors.",
      videoId: "9bZkp7q19f0", // Sample YouTube ID
      topics: ["Climate Change", "Sustainability", "Environmental Science"],
    },
    {
      id: "e004",
      title: "The Future of Work in a Digital Economy",
      date: "Aug 22, 2025",
      speaker: "Lena Park",
      speakerRole: "Future of Work Strategist",
      thumbnail: "https://images.unsplash.com/photo-1573164713988-8665fc963095?ixlib=rb-4.0.3&auto=format&fit=crop&w=1469&q=80",
      duration: "19:30",
      summary: "Lena examines how automation, remote work, and the gig economy are transforming traditional employment. She offers insights into preparing for career shifts, developing essential skills, and creating resilient organizational structures for the digital age.",
      videoId: "09R8_2nJtjg", // Sample YouTube ID
      topics: ["Future of Work", "Digital Economy", "Career Development"],
    },
    {
      id: "e005",
      title: "Reimagining Education for the 21st Century",
      date: "Aug 5, 2025",
      speaker: "Marcus Freeman",
      speakerRole: "Education Innovator",
      thumbnail: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?ixlib=rb-4.0.3&auto=format&fit=crop&w=1740&q=80",
      duration: "24:18",
      summary: "Marcus challenges traditional educational models and proposes new approaches that emphasize creativity, critical thinking, and adaptability. He shares examples of innovative schools and programs that are successfully preparing students for a rapidly changing world.",
      videoId: "hT_nvWreIhg", // Sample YouTube ID
      topics: ["Education", "Learning Innovation", "Skill Development"],
    },
    {
      id: "e006",
      title: "The Science of Happiness and Well-being",
      date: "Jul 19, 2025",
      speaker: "Elena Diaz",
      speakerRole: "Positive Psychology Researcher",
      thumbnail: "https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?ixlib=rb-4.0.3&auto=format&fit=crop&w=880&q=80",
      duration: "21:45",
      summary: "Elena presents research-backed strategies for increasing happiness and well-being in our daily lives. She explores the connection between purpose, relationships, and fulfillment, offering practical tools for cultivating greater joy and resilience.",
      videoId: "8UVNT4wvIGY", // Sample YouTube ID
      topics: ["Psychology", "Wellbeing", "Mental Health"],
    },
  ];

  // Filter episodes based on search query
  const filteredEpisodes = allEpisodes.filter(
    (episode) =>
      episode.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      episode.speaker.toLowerCase().includes(searchQuery.toLowerCase()) ||
      episode.topics.some((topic) =>
        topic.toLowerCase().includes(searchQuery.toLowerCase())
      )
  );

  if (filteredEpisodes.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-xl font-medium">No episodes found</h3>
        <p className="text-foreground/70 mt-2">
          Try adjusting your search criteria
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow overflow-hidden">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Episode
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Speaker
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Date
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Duration
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {filteredEpisodes.map((episode) => (
            <tr key={episode.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div className="h-10 w-16 flex-shrink-0 rounded overflow-hidden">
                    <img className="h-10 w-16 object-cover" src={episode.thumbnail} alt="" />
                  </div>
                  <div className="ml-4">
                    <div className="text-sm font-medium text-gray-900 truncate max-w-xs">{episode.title}</div>
                    <div className="text-xs text-gray-500">{episode.topics.join(", ")}</div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">{episode.speaker}</div>
                <div className="text-xs text-gray-500">{episode.speakerRole}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {episode.date}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {episode.duration}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div className="flex space-x-2">
                  <Button variant="ghost" size="sm" onClick={() => onEdit(episode)}>
                    <Edit size={16} className="mr-1" />
                    Edit
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => onDelete(episode)}>
                    <Trash2 size={16} className="mr-1" />
                    Delete
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminEpisodeList;
