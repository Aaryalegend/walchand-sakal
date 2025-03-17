import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
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
          
          <p className="mt-4 line-clamp-3">{bio}</p>
          <Button variant="outline" className="mt-4 w-full">View Profile</Button>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default SpeakerCard;
