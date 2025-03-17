
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Check, X } from "lucide-react";

interface Topic {
  value: string;
}

interface Episode {
  id?: string;
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

interface AdminEpisodeFormProps {
  episode?: Episode | null;
  onSave: (episode: Episode) => void;
  onCancel: () => void;
}

const AdminEpisodeForm: React.FC<AdminEpisodeFormProps> = ({
  episode,
  onSave,
  onCancel,
}) => {
  const [form, setForm] = useState<Episode>({
    id: "",
    title: "",
    date: "",
    speaker: "",
    speakerRole: "",
    thumbnail: "",
    duration: "",
    summary: "",
    videoId: "",
    topics: [],
  });

  const [newTopic, setNewTopic] = useState("");
  const [errors, setErrors] = useState<Partial<Record<keyof Episode, string>>>({});

  useEffect(() => {
    if (episode) {
      setForm(episode);
    } else {
      // Generate a random ID for new episodes
      setForm({
        ...form,
        id: `e${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
        date: new Date().toLocaleDateString('en-US', { 
          year: 'numeric', 
          month: 'short', 
          day: 'numeric' 
        }),
      });
    }
  }, [episode]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: value,
    });
    
    // Clear error when user types
    if (errors[name as keyof Episode]) {
      setErrors({
        ...errors,
        [name]: "",
      });
    }
  };

  const handleAddTopic = () => {
    if (!newTopic) return;
    
    if (!form.topics.includes(newTopic)) {
      setForm({
        ...form,
        topics: [...form.topics, newTopic],
      });
    }
    
    setNewTopic("");
  };

  const handleRemoveTopic = (topic: string) => {
    setForm({
      ...form,
      topics: form.topics.filter((t) => t !== topic),
    });
  };

  const validateForm = () => {
    const newErrors: Partial<Record<keyof Episode, string>> = {};
    
    if (!form.title) newErrors.title = "Title is required";
    if (!form.speaker) newErrors.speaker = "Speaker name is required";
    if (!form.speakerRole) newErrors.speakerRole = "Speaker role is required";
    if (!form.thumbnail) newErrors.thumbnail = "Thumbnail URL is required";
    if (!form.duration) newErrors.duration = "Duration is required";
    if (!form.summary) newErrors.summary = "Summary is required";
    if (!form.videoId) newErrors.videoId = "YouTube Video ID is required";
    if (form.topics.length === 0) newErrors.topics = "At least one topic is required";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSave(form);
    } else {
      // Scroll to the first error
      const firstErrorField = Object.keys(errors)[0];
      const element = document.querySelector(`[name="${firstErrorField}"]`);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-medium">
          {episode ? "Edit Episode" : "Add New Episode"}
        </h2>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={onCancel}>
            <X size={18} className="mr-2" />
            Cancel
          </Button>
          <Button onClick={handleSubmit}>
            <Check size={18} className="mr-2" />
            Save Episode
          </Button>
        </div>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Title */}
          <div className="space-y-2">
            <label htmlFor="title" className="block text-sm font-medium text-gray-700">
              Episode Title*
            </label>
            <input
              id="title"
              name="title"
              type="text"
              value={form.title}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20 ${
                errors.title ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Enter episode title"
            />
            {errors.title && (
              <p className="text-red-500 text-xs">{errors.title}</p>
            )}
          </div>
          
          {/* Speaker */}
          <div className="space-y-2">
            <label htmlFor="speaker" className="block text-sm font-medium text-gray-700">
              Speaker Name*
            </label>
            <input
              id="speaker"
              name="speaker"
              type="text"
              value={form.speaker}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20 ${
                errors.speaker ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Enter speaker name"
            />
            {errors.speaker && (
              <p className="text-red-500 text-xs">{errors.speaker}</p>
            )}
          </div>
          
          {/* Speaker Role */}
          <div className="space-y-2">
            <label htmlFor="speakerRole" className="block text-sm font-medium text-gray-700">
              Speaker Role*
            </label>
            <input
              id="speakerRole"
              name="speakerRole"
              type="text"
              value={form.speakerRole}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20 ${
                errors.speakerRole ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Enter speaker role (e.g., 'AI Researcher')"
            />
            {errors.speakerRole && (
              <p className="text-red-500 text-xs">{errors.speakerRole}</p>
            )}
          </div>
          
          {/* Date */}
          <div className="space-y-2">
            <label htmlFor="date" className="block text-sm font-medium text-gray-700">
              Publication Date*
            </label>
            <input
              id="date"
              name="date"
              type="text"
              value={form.date}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20 ${
                errors.date ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Enter date (e.g., 'Oct 15, 2025')"
            />
            {errors.date && (
              <p className="text-red-500 text-xs">{errors.date}</p>
            )}
          </div>
          
          {/* Duration */}
          <div className="space-y-2">
            <label htmlFor="duration" className="block text-sm font-medium text-gray-700">
              Duration*
            </label>
            <input
              id="duration"
              name="duration"
              type="text"
              value={form.duration}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20 ${
                errors.duration ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Enter duration (e.g., '18:42')"
            />
            {errors.duration && (
              <p className="text-red-500 text-xs">{errors.duration}</p>
            )}
          </div>
          
          {/* YouTube Video ID */}
          <div className="space-y-2">
            <label htmlFor="videoId" className="block text-sm font-medium text-gray-700">
              YouTube Video ID*
            </label>
            <input
              id="videoId"
              name="videoId"
              type="text"
              value={form.videoId}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20 ${
                errors.videoId ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Enter YouTube ID (e.g., 'dQw4w9WgXcQ')"
            />
            <p className="text-xs text-gray-500">
              The ID is the part after "v=" in YouTube URLs
            </p>
            {errors.videoId && (
              <p className="text-red-500 text-xs">{errors.videoId}</p>
            )}
          </div>
          
          {/* Thumbnail */}
          <div className="space-y-2 md:col-span-2">
            <label htmlFor="thumbnail" className="block text-sm font-medium text-gray-700">
              Thumbnail URL*
            </label>
            <input
              id="thumbnail"
              name="thumbnail"
              type="text"
              value={form.thumbnail}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20 ${
                errors.thumbnail ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Enter thumbnail image URL"
            />
            {form.thumbnail && (
              <div className="mt-2">
                <p className="text-xs text-gray-500 mb-1">Preview:</p>
                <img 
                  src={form.thumbnail} 
                  alt="Thumbnail preview" 
                  className="h-20 object-cover rounded-md"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = "https://via.placeholder.com/640x360?text=Invalid+Image+URL";
                  }}
                />
              </div>
            )}
            {errors.thumbnail && (
              <p className="text-red-500 text-xs">{errors.thumbnail}</p>
            )}
          </div>
          
          {/* Topics */}
          <div className="space-y-2 md:col-span-2">
            <label className="block text-sm font-medium text-gray-700">
              Topics*
            </label>
            <div className="flex">
              <input
                type="text"
                value={newTopic}
                onChange={(e) => setNewTopic(e.target.value)}
                className="flex-1 px-4 py-2 border border-r-0 rounded-l-md focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                placeholder="Add a topic"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddTopic();
                  }
                }}
              />
              <Button 
                type="button" 
                onClick={handleAddTopic}
                className="rounded-l-none"
              >
                Add
              </Button>
            </div>
            {errors.topics && (
              <p className="text-red-500 text-xs">{errors.topics}</p>
            )}
            
            <div className="flex flex-wrap gap-2 mt-3">
              {form.topics.map((topic) => (
                <div
                  key={topic}
                  className="flex items-center bg-primary/10 text-primary text-sm rounded-full py-1 pl-3 pr-1"
                >
                  {topic}
                  <button
                    type="button"
                    onClick={() => handleRemoveTopic(topic)}
                    className="ml-1 text-primary hover:text-primary/70 p-1 rounded-full"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
              {form.topics.length === 0 && (
                <p className="text-sm text-gray-500">No topics added yet</p>
              )}
            </div>
          </div>
          
          {/* Summary */}
          <div className="space-y-2 md:col-span-2">
            <label htmlFor="summary" className="block text-sm font-medium text-gray-700">
              Episode Summary*
            </label>
            <textarea
              id="summary"
              name="summary"
              rows={5}
              value={form.summary}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20 ${
                errors.summary ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Enter a detailed summary of the episode"
            />
            {errors.summary && (
              <p className="text-red-500 text-xs">{errors.summary}</p>
            )}
          </div>
        </div>
        
        <div className="flex justify-end space-x-2 pt-4 border-t">
          <Button variant="outline" type="button" onClick={onCancel}>
            <X size={18} className="mr-2" />
            Cancel
          </Button>
          <Button type="submit">
            <Check size={18} className="mr-2" />
            Save Episode
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AdminEpisodeForm;
