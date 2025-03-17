
import React from "react";
import { Link } from "react-router-dom";
import { Play, Clock } from "lucide-react";

interface FeaturedTalkProps {
  id: string;
  title: string;
  speaker: string;
  speakerRole: string;
  thumbnail: string;
  duration: string;
  featured?: boolean;
  delay?: number;
}

const FeaturedTalk: React.FC<FeaturedTalkProps> = ({
  id,
  title,
  speaker,
  speakerRole,
  thumbnail,
  duration,
  featured = false,
  delay = 0,
}) => {
  return (
    <Link
      to={`/episodes/${id}`}
      className={`group relative overflow-hidden rounded-xl shadow-sm hover-lift ${
        featured ? "col-span-2 row-span-2" : ""
      } animate-fade-in opacity-0`}
      style={{ 
        animationDelay: `${delay}ms`,
        animationFillMode: 'forwards'
      }}
    >
      {/* Image and overlay */}
      <div className="relative aspect-video overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent z-10 group-hover:from-black/80 transition-colors duration-300"></div>
        <img
          src={thumbnail}
          alt={title}
          className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
        />
        
        {/* Play button overlay */}
        <div className="absolute inset-0 flex items-center justify-center z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button className="bg-white/90 hover:bg-white transition-colors rounded-full p-4 shadow-lg transform scale-90 group-hover:scale-100 transition-transform">
            <Play size={20} className="text-primary" fill="currentColor" />
          </button>
        </div>
        
        {/* Duration badge */}
        <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-sm text-white text-xs font-medium py-1 px-2 rounded-full flex items-center z-20">
          <Clock size={12} className="mr-1" />
          {duration}
        </div>
        
        {/* Content */}
        <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6 z-20">
          {featured && (
            <span className="inline-block bg-primary/90 text-white text-xs py-1 px-2 rounded-full mb-2">
              Featured
            </span>
          )}
          <h3 className={`${featured ? "text-xl md:text-2xl" : "text-lg"} text-white font-medium mb-1`}>
            {title}
          </h3>
          <p className="text-sm text-white/80">
            {speaker} • {speakerRole}
          </p>
        </div>
      </div>
    </Link>
  );
};

export default FeaturedTalk;
