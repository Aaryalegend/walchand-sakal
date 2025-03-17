import React, { useState, useEffect } from "react";
import { Search } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import EpisodeCard from "@/components/ui/EpisodeCard";

// Create interface for episode data
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

const Episodes = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedEpisode, setSelectedEpisode] = useState<Episode | null>(null);
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  useEffect(() => {
    const fetchEpisodes = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/episodes`);
        const result = await response.json();
        
        if (result.success) {
          setEpisodes(result.data);
        } else {
          setError("Failed to fetch episodes");
        }
      } catch (err) {
        setError("Error connecting to the server");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchEpisodes();
  }, []);
  
  // Filter episodes based on search query
  const filteredEpisodes = episodes.filter(
    (episode) =>
      episode.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      episode.speaker.toLowerCase().includes(searchQuery.toLowerCase()) ||
      episode.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      episode.topics.some((topic) =>
        topic.toLowerCase().includes(searchQuery.toLowerCase())
      )
  );

  // Set the default selected episode if none is selected
  React.useEffect(() => {
    if (!selectedEpisode && filteredEpisodes.length > 0) {
      setSelectedEpisode(filteredEpisodes[0]);
    }
  }, [filteredEpisodes, selectedEpisode]);

  return (
    <>
      <Navbar />
      <main className="flex-1 pt-24 pb-20">
        {/* Header */}
        <section className="bg-secondary/30 py-16 px-6 md:px-10">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-medium">Episodes</h1>
            <p className="text-foreground/70 mt-4 max-w-3xl">
              Watch our collection of thought-provoking talks exploring the most important 
              ideas and innovations shaping our world.
            </p>
            
            {/* Search */}
            <div className="relative max-w-xl mt-8">
              <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                <Search size={18} className="text-foreground/50" />
              </div>
              <input
                type="text"
                placeholder="Search by title, speaker or topic..."
                className="w-full py-3 pl-11 pr-4 rounded-lg border border-border bg-white focus:outline-none focus:ring-2 focus:ring-primary/20"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </section>
        
        {/* Episodes Grid with Video Player */}
        <section className="py-16 px-6 md:px-10">
          <div className="max-w-7xl mx-auto">
            {loading ? (
              <div className="text-center py-20">
                <h3 className="text-xl font-medium">Loading episodes...</h3>
              </div>
            ) : error ? (
              <div className="text-center py-20">
                <h3 className="text-xl font-medium text-red-500">{error}</h3>
                <p className="text-foreground/70 mt-2">
                  Please try again later
                </p>
              </div>
            ) : filteredEpisodes.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Video player and summary */}
                <div className="lg:col-span-2 order-2 lg:order-1">
                  {selectedEpisode && (
                    <div className="animate-scale-in">
                      <div className="rounded-xl overflow-hidden shadow-md">
                        <div className="aspect-video">
                          <iframe
                            src={`https://www.youtube.com/embed/${selectedEpisode.videoId}`}
                            title={selectedEpisode.title}
                            className="w-full h-full"
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                          ></iframe>
                        </div>
                      </div>
                      <div className="mt-6">
                        <h2 className="text-2xl md:text-3xl font-medium">{selectedEpisode.title}</h2>
                        <p className="text-foreground/70 mt-2">
                          {selectedEpisode.speaker} • {selectedEpisode.speakerRole} • {selectedEpisode.date}
                        </p>
                        <div className="flex flex-wrap gap-2 mt-4">
                          {selectedEpisode.topics.map((topic: string) => (
                            <span
                              key={topic}
                              className="text-xs font-medium bg-primary/10 text-primary py-1 px-3 rounded-full"
                            >
                              {topic}
                            </span>
                          ))}
                        </div>
                        <div className="mt-6 p-6 bg-secondary rounded-xl">
                          <h3 className="text-lg font-medium mb-3">Episode Summary</h3>
                          <p className="text-foreground/80">{selectedEpisode.summary}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Episodes list */}
                <div className="lg:col-span-1 order-1 lg:order-2">
                  <h3 className="text-xl font-medium mb-6">All Episodes</h3>
                  <div className="space-y-6">
                    {filteredEpisodes.map((episode, index) => (
                      <EpisodeCard
                        key={episode._id}
                        id={episode._id}
                        title={episode.title}
                        date={episode.date}
                        speaker={episode.speaker}
                        speakerRole={episode.speakerRole}
                        thumbnail={episode.thumbnail}
                        duration={episode.duration}
                        summary={episode.summary}
                        videoId={episode.videoId}
                        topics={episode.topics}
                        delay={index * 100}
                        onSelectEpisode={() => setSelectedEpisode(episode)}
                      />
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-20">
                <h3 className="text-xl font-medium">No episodes found</h3>
                <p className="text-foreground/70 mt-2">
                  Try adjusting your search criteria
                </p>
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default Episodes;
