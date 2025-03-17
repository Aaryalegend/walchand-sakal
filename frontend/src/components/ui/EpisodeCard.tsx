import React from "react";
import { Link } from "react-router-dom";
import { Clock, Calendar, ExternalLink } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";

export interface EpisodeCardProps {
  id: string;
  title: string;
  date: string;
  speaker: string;
  speakerRole: string;
  thumbnail: string;
  duration: string;
  summary: string;
  videoId: string;
  topics: string[];
  delay: number;
  onSelectEpisode: () => void;
}

const EpisodeCard: React.FC<EpisodeCardProps> = ({
  title,
  date,
  speaker,
  speakerRole,
  thumbnail,
  duration,
  summary,
  topics,
  delay,
  onSelectEpisode,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: delay / 1000 }}
      className="h-full"
    >
      <Card 
        className="overflow-hidden h-full cursor-pointer hover:shadow-md transition-shadow" 
        onClick={onSelectEpisode}
      >
        <div className="relative">
          <img
            src={thumbnail}
            alt={title}
            className="w-full aspect-video object-cover"
          />
          <div className="absolute bottom-2 right-2 bg-background/80 backdrop-blur-sm text-xs px-2 py-1 rounded">
            {duration}
          </div>
        </div>
        <CardContent className="p-6">
          <div className="text-sm text-muted-foreground mb-1">{date}</div>
          <h3 className="text-xl font-semibold mb-1 line-clamp-2">{title}</h3>
          <p className="text-sm mb-3">
            <span className="font-medium">{speaker}</span>
            <span className="text-muted-foreground"> · {speakerRole}</span>
          </p>
          
          {topics && topics.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-3">
              {topics.map((topic, index) => (
                <span 
                  key={index} 
                  className="inline-block px-2 py-1 bg-secondary text-secondary-foreground text-xs rounded-full"
                >
                  {topic}
                </span>
              ))}
            </div>
          )}
          
          <p className="text-muted-foreground text-sm line-clamp-3">{summary}</p>
          <div className="flex items-center text-sm mt-4 text-primary">
            <span className="mr-1">Watch now</span>
            <ExternalLink size={14} />
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default EpisodeCard;
