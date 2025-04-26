import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ChevronDown, ChevronUp } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export interface SpeakerCardProps {
  id: string;
  name: string;
  role: string;
  organization: string;
  image: string;
  bio: string;
  topics: string[];
  delay: number;
}

const SpeakerCard: React.FC<SpeakerCardProps> = ({
  id,
  name,
  role,
  organization,
  image,
  bio,
  topics,
  delay,
}) => {
  const [expanded, setExpanded] = useState(false);
  const [isTruncated, setIsTruncated] = useState(false);
  const bioRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const checkTruncation = () => {
      const element = bioRef.current;
      if (element) {
        // Check if content is actually truncated
        setIsTruncated(
          element.scrollHeight > element.clientHeight || 
          element.offsetHeight < element.scrollHeight
        );
      }
    };

    checkTruncation();
    
    // Re-check on window resize for responsive behavior
    window.addEventListener('resize', checkTruncation);
    
    return () => {
      window.removeEventListener('resize', checkTruncation);
    };
  }, [bio]);

  const toggleBio = () => {
    setExpanded(!expanded);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: delay / 1000 }}
    >
      <Card className="overflow-hidden h-full">
        <div className="aspect-square overflow-hidden">
          <img
            src={image}
            alt={name}
            className="w-full h-full object-cover transition-all hover:scale-105"
          />
        </div>
        <CardContent className="p-6">
          <h3 className="text-xl font-bold">{name}</h3>
          <p className="text-muted-foreground">
            {role} at {organization}
          </p>
          
          {topics && topics.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
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
          
          <p 
            ref={bioRef} 
            className={`mt-4 ${expanded ? "" : "line-clamp-3"}`}
          >
            {bio}
          </p>
          
          {isTruncated && (
            <Button 
              variant="ghost" 
              size="sm" 
              className="mt-2 p-0 h-auto text-muted-foreground hover:text-foreground flex items-center"
              onClick={toggleBio}
            >
              {expanded ? (
                <>Show less <ChevronUp className="ml-1 h-4 w-4" /></>
              ) : (
                <>Read more <ChevronDown className="ml-1 h-4 w-4" /></>
              )}
            </Button>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default SpeakerCard;
