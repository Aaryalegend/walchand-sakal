const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Speaker = require('./models/Speaker');
const Episode = require('./models/Episode');
const TeamMember = require('./models/TeamMember');
const Stat = require('./models/Stat');
const FeaturedTalk = require('./models/FeaturedTalk');
const FeaturedSpeaker = require('./models/FeaturedSpeaker');
const Admin = require('./models/Admin');
const bcrypt = require('bcryptjs');

// Load env vars
dotenv.config();

// Connect to DB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// Sample speaker data
const speakers = [
  {
    name: "Emma Thompson",
    role: "Chief Innovation Officer",
    organization: "Future Technologies",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=688&q=80",
    bio: "Emma is a pioneering technologist specializing in human-computer interaction and the ethical implications of AI systems. She has led innovation at Future Technologies for over a decade, focusing on creating technology that enhances human capabilities.",
    topics: ["AI Ethics", "Human-Computer Interaction", "Digital Innovation"],
  },
  {
    name: "David Patel",
    role: "Neuroscientist",
    organization: "BrainWave Institute",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1740&q=80",
    bio: "David's research focuses on cognitive enhancement techniques and brain-computer interfaces that expand human potential. His work at the BrainWave Institute has pioneered new methods for understanding neural plasticity and its applications.",
    topics: ["Neuroscience", "Cognitive Enhancement", "Brain-Computer Interfaces"],
  },
  {
    name: "Sophia Rodriguez",
    role: "Architect & Urbanist",
    organization: "Smart Cities Initiative",
    image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&auto=format&fit=crop&w=1522&q=80",
    bio: "Sophia designs sustainable urban environments that blend technology with human-centered design principles. Her innovative approaches to urban planning have transformed communities around the world.",
    topics: ["Smart Cities", "Sustainable Design", "Urban Planning"],
  },
  {
    name: "Marcus Johnson",
    role: "Quantum Physicist",
    organization: "Quantum Futures Lab",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1374&q=80",
    bio: "Marcus is pioneering research in quantum computing applications that could revolutionize fields from medicine to climate science. His work explores the boundary between theoretical physics and practical applications.",
    topics: ["Quantum Computing", "Physics", "Future Technology"],
  },
  {
    name: "Aisha Khatri",
    role: "Bioethicist",
    organization: "Global Health Institute",
    image: "https://images.unsplash.com/photo-1534751516642-a1af1ef26a56?ixlib=rb-4.0.3&auto=format&fit=crop&w=688&q=80",
    bio: "Aisha explores the ethical dimensions of emerging biotechnologies, including genetic engineering and personalized medicine. Her work addresses the complex intersections of technology, healthcare, and human values.",
    topics: ["Bioethics", "Healthcare Technology", "Genetic Engineering"],
  },
  {
    name: "Robert Chen",
    role: "Climate Scientist",
    organization: "Earth Systems Research",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&auto=format&fit=crop&w=687&q=80",
    bio: "Robert studies climate adaptation strategies and develops predictive models for environmental change. His research helps communities prepare for and mitigate the effects of climate change through innovative technological solutions.",
    topics: ["Climate Science", "Environmental Adaptation", "Predictive Modeling"],
  },
];

// Sample episode data
const episodes = [
  {
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

// Sample team data
const teamMembers = [
  {
    name: "Jennifer Wu",
    role: "Executive Director",
    image: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1471&q=80",
  },
  {
    name: "Raj Mehta",
    role: "Creative Director",
    image: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?ixlib=rb-4.0.3&auto=format&fit=crop&w=1528&q=80",
  },
  {
    name: "Olivia Kim",
    role: "Speaker Relations",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80",
  },
  {
    name: "Marcus Johnson",
    role: "Production Lead",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1374&q=80",
  },
];

// Sample stats data
const stats = [
  { label: "Speakers", value: "50+" },
  { label: "Episodes", value: "100+" },
  { label: "Countries", value: "25+" },
  { label: "Viewers", value: "1M+" },
];

// Sample featured talks data
const featuredTalks = [
  {
    title: "Designing Products That Shape Our Future",
    speaker: "Alex Johnson",
    speakerRole: "Product Design Director",
    thumbnail: "https://images.unsplash.com/photo-1523580494863-6f3031224c94?ixlib=rb-4.0.3&auto=format&fit=crop&w=1740&q=80",
    duration: "18:42",
    featured: true,
  },
  {
    title: "The Power of AI in Healthcare",
    speaker: "Sarah Chen",
    speakerRole: "Healthcare Innovator",
    thumbnail: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?ixlib=rb-4.0.3&auto=format&fit=crop&w=1740&q=80",
    duration: "22:15",
  },
  {
    title: "Climate Solutions for a Sustainable Future",
    speaker: "Michael Rivera",
    speakerRole: "Environmental Scientist",
    thumbnail: "https://images.unsplash.com/photo-1498855926480-d98e83099315?ixlib=rb-4.0.3&auto=format&fit=crop&w=1740&q=80",
    duration: "25:10",
  },
];

// Sample featured speakers data
const featuredSpeakers = [
  {
    name: "Emma Thompson",
    role: "Chief Innovation Officer",
    organization: "Future Technologies",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=688&q=80",
    bio: "Emma is a pioneering technologist specializing in human-computer interaction and the ethical implications of AI systems.",
  },
  {
    name: "David Patel",
    role: "Neuroscientist",
    organization: "BrainWave Institute",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1740&q=80",
    bio: "David's research focuses on cognitive enhancement techniques and brain-computer interfaces that expand human potential.",
  },
  {
    name: "Sophia Rodriguez",
    role: "Architect & Urbanist",
    organization: "Smart Cities Initiative",
    image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&auto=format&fit=crop&w=1522&q=80",
    bio: "Sophia designs sustainable urban environments that blend technology with human-centered design principles.",
  },
];

// Sample admin data
const admins = [
  {
    username: 'admin',
    password: 'password123',
    name: 'Admin User',
    role: 'admin'
  }
];

// Import data into database
const importData = async () => {
  try {
    // Clear existing data
    await Speaker.deleteMany();
    await Episode.deleteMany();
    await TeamMember.deleteMany();
    await Stat.deleteMany();
    await FeaturedTalk.deleteMany();
    await FeaturedSpeaker.deleteMany();
    await Admin.deleteMany();
    
    // Insert new data
    await Speaker.insertMany(speakers);
    await Episode.insertMany(episodes);
    await TeamMember.insertMany(teamMembers);
    await Stat.insertMany(stats);
    await FeaturedTalk.insertMany(featuredTalks);
    await FeaturedSpeaker.insertMany(featuredSpeakers);
    
    // For Admin, create each one separately instead of using insertMany
    // This ensures the password hashing middleware is executed
    for (const adminData of admins) {
      await Admin.create(adminData);
    }
    
    console.log('Data Imported!');
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

// Delete all data from database
const deleteData = async () => {
  try {
    await Speaker.deleteMany();
    await Episode.deleteMany();
    await TeamMember.deleteMany();
    await Stat.deleteMany();
    await FeaturedTalk.deleteMany();
    await FeaturedSpeaker.deleteMany();
    await Admin.deleteMany();
    
    console.log('Data Destroyed!');
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

// Process command line args
if (process.argv[2] === '-d') {
  deleteData();
} else {
  importData();
} 