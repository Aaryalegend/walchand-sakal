import React, { useState, useEffect } from "react";
import { Search } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import SpeakerCard from "@/components/ui/SpeakerCard";

// Create interface for speaker data
interface Speaker {
  _id: string;
  name: string;
  role: string;
  organization: string;
  image: string;
  bio: string;
  topics: string[];
}

const Speakers = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [speakers, setSpeakers] = useState<Speaker[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  useEffect(() => {
    const fetchSpeakers = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/speakers`);
        const result = await response.json();
        
        if (result.success) {
          setSpeakers(result.data);
        } else {
          setError("Failed to fetch speakers");
        }
      } catch (err) {
        setError("Error connecting to the server");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchSpeakers();
  }, []);
  
  // Filter speakers based on search query
  const filteredSpeakers = speakers.filter(
    (speaker) =>
      speaker.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      speaker.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      speaker.organization.toLowerCase().includes(searchQuery.toLowerCase()) ||
      speaker.bio.toLowerCase().includes(searchQuery.toLowerCase()) ||
      speaker.topics.some((topic) =>
        topic.toLowerCase().includes(searchQuery.toLowerCase())
      )
  );

  return (
    <>
      <Navbar />
      <main className="flex-1 pt-24 pb-20">
        {/* Header */}
        <section className="bg-secondary/30 py-16 px-6 md:px-10">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-medium">Our Speakers</h1>
            <p className="text-foreground/70 mt-4 max-w-3xl">
              Meet the visionaries, innovators, and thought leaders who bring unique 
              perspectives and groundbreaking ideas to our stage.
            </p>
            
            {/* Search */}
            <div className="relative max-w-xl mt-8">
              <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                <Search size={18} className="text-foreground/50" />
              </div>
              <input
                type="text"
                placeholder="Search by name, role, organization or topic..."
                className="w-full py-3 pl-11 pr-4 rounded-lg border border-border bg-white focus:outline-none focus:ring-2 focus:ring-primary/20"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </section>
        
        {/* Speakers Grid */}
        <section className="py-16 px-6 md:px-10">
          <div className="max-w-7xl mx-auto">
            {loading ? (
              <div className="text-center py-20">
                <h3 className="text-xl font-medium">Loading speakers...</h3>
              </div>
            ) : error ? (
              <div className="text-center py-20">
                <h3 className="text-xl font-medium text-red-500">{error}</h3>
                <p className="text-foreground/70 mt-2">
                  Please try again later
                </p>
              </div>
            ) : filteredSpeakers.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredSpeakers.map((speaker, index) => (
                  <SpeakerCard
                    key={speaker._id}
                    id={speaker._id}
                    name={speaker.name}
                    role={speaker.role}
                    organization={speaker.organization}
                    image={speaker.image}
                    bio={speaker.bio}
                    topics={speaker.topics}
                    delay={index * 100}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <h3 className="text-xl font-medium">No speakers found</h3>
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

export default Speakers;
