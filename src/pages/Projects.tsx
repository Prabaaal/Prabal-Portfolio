
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, Github, ArrowRight } from 'lucide-react';
import FloatingObject from '../components/three/FloatingObject';

// Project data
const projects = [
  {
    id: 1,
    title: "AI Study Assistant",
    description: "A web application that helps students organize study materials and generate flashcards using AI.",
    technologies: ["React", "Node.js", "OpenAI API", "MongoDB"],
    link: "#",
    github: "#",
    color: "#0099ff"
  },
  {
    id: 2,
    title: "Smart Home Dashboard",
    description: "IoT dashboard for monitoring and controlling smart home devices with real-time updates.",
    technologies: ["React", "Socket.io", "Express", "MQTT"],
    link: "#",
    github: "#",
    color: "#9f7aea"
  },
  {
    id: 3,
    title: "Crypto Portfolio Tracker",
    description: "Track cryptocurrency investments with real-time price updates and portfolio analytics.",
    technologies: ["React", "Chart.js", "CoinGecko API", "Firebase"],
    link: "#",
    github: "#",
    color: "#f56565"
  },
  {
    id: 4,
    title: "E-commerce Platform",
    description: "Full-stack e-commerce application with user authentication, product catalog, and shopping cart.",
    technologies: ["React", "Express", "MongoDB", "Stripe API"],
    link: "#",
    github: "#",
    color: "#38b2ac"
  },
  {
    id: 5,
    title: "AR Navigation App",
    description: "Augmented reality app for indoor navigation in university buildings using smartphone cameras.",
    technologies: ["React Native", "ARKit", "ARCore", "Three.js"],
    link: "#",
    github: "#",
    color: "#ed8936"
  },
  {
    id: 6,
    title: "Social Media Analytics",
    description: "Dashboard for tracking and analyzing social media engagement across multiple platforms.",
    technologies: ["React", "D3.js", "Node.js", "Social Media APIs"],
    link: "#",
    github: "#",
    color: "#4299e1"
  }
];

const Projects = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [selectedProject, setSelectedProject] = useState<number | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 300);
    
    return () => clearTimeout(timer);
  }, []);

  // Container animation
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.1,
        staggerChildren: 0.1
      }
    }
  };

  // Child elements animation
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] }
    }
  };

  return (
    <motion.div
      initial="hidden"
      animate={isLoaded ? "visible" : "hidden"}
      variants={containerVariants}
      className="max-w-6xl mx-auto"
    >
      <motion.div className="text-center mb-16" variants={itemVariants}>
        <h1 className="text-3xl md:text-5xl font-bold mb-4">My Projects</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          A showcase of my work, featuring web applications, data visualizations, and more.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
        {projects.map((project) => (
          <motion.div
            key={project.id}
            variants={itemVariants}
            whileHover={{ y: -5, transition: { duration: 0.2 } }}
            className="group"
            onMouseEnter={() => setSelectedProject(project.id)}
            onMouseLeave={() => setSelectedProject(null)}
          >
            <div className="glass-card rounded-2xl overflow-hidden h-full flex flex-col relative">
              {/* Colorful top accent */}
              <div 
                className="h-1 w-full" 
                style={{ background: project.color }}
              />
              
              {/* Project content */}
              <div className="p-6 flex-1 flex flex-col">
                <h3 className="text-xl font-bold mb-2">{project.title}</h3>
                <p className="text-muted-foreground mb-4 flex-1">{project.description}</p>
                
                {/* Technologies */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.technologies.map((tech) => (
                    <span 
                      key={tech} 
                      className="text-xs px-2 py-1 rounded-full bg-muted/50"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
                
                {/* Links */}
                <div className="flex items-center justify-between mt-auto">
                  <a 
                    href={project.github} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <Github className="h-5 w-5" />
                  </a>
                  <a 
                    href={project.link} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center text-sm text-primary group-hover:underline"
                  >
                    View Project <ArrowRight className="ml-1 h-4 w-4" />
                  </a>
                </div>
              </div>
              
              {/* Hover effect */}
              <div 
                className="absolute inset-0 border-2 border-transparent group-hover:border-primary/20 rounded-2xl transition-colors duration-300"
              />
            </div>
          </motion.div>
        ))}
      </div>

      <motion.div variants={itemVariants}>
        <div className="glass-card rounded-2xl p-8 mb-16">
          <div className="flex flex-col lg:flex-row gap-8 items-center">
            <div className="lg:w-1/3">
              <FloatingObject 
                fallbackColor={selectedProject ? projects.find(p => p.id === selectedProject)?.color || "#0099ff" : "#0099ff"} 
                scale={1.5}
              />
            </div>
            <div className="lg:w-2/3">
              <h2 className="text-2xl md:text-3xl font-bold mb-4 text-gradient from-primary via-secondary to-accent">Featured Project</h2>
              <h3 className="text-xl font-bold mb-2">3D Interactive Portfolio</h3>
              <p className="text-muted-foreground mb-4">
                This portfolio website showcases my skills in 3D web development using Three.js. The site features interactive elements, custom shaders, and responsive design.
              </p>
              <p className="mb-6">
                The interactive globe highlights my location in Assam, India, using Three.js for realistic rendering and smooth animations. The project demonstrates my ability to create engaging visual experiences on the web.
              </p>
              <div className="flex flex-wrap gap-3">
                <span className="text-sm px-3 py-1 rounded-full bg-primary/20 text-primary">Three.js</span>
                <span className="text-sm px-3 py-1 rounded-full bg-primary/20 text-primary">React</span>
                <span className="text-sm px-3 py-1 rounded-full bg-primary/20 text-primary">WebGL</span>
                <span className="text-sm px-3 py-1 rounded-full bg-primary/20 text-primary">GLSL Shaders</span>
                <span className="text-sm px-3 py-1 rounded-full bg-primary/20 text-primary">Tailwind CSS</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      <motion.div variants={itemVariants} className="glass-card rounded-2xl p-8">
        <h2 className="text-2xl font-bold mb-6 text-gradient from-primary via-secondary to-accent">Skills & Technologies</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div>
            <h3 className="text-xl font-bold mb-4">Frontend</h3>
            <div className="space-y-3">
              <SkillBar skill="React" percentage={85} />
              <SkillBar skill="JavaScript" percentage={90} />
              <SkillBar skill="HTML/CSS" percentage={95} />
              <SkillBar skill="Three.js" percentage={75} />
              <SkillBar skill="Tailwind CSS" percentage={80} />
            </div>
          </div>
          
          <div>
            <h3 className="text-xl font-bold mb-4">Backend</h3>
            <div className="space-y-3">
              <SkillBar skill="Node.js" percentage={80} />
              <SkillBar skill="Express" percentage={75} />
              <SkillBar skill="MongoDB" percentage={70} />
              <SkillBar skill="Firebase" percentage={65} />
              <SkillBar skill="REST APIs" percentage={85} />
            </div>
          </div>
          
          <div>
            <h3 className="text-xl font-bold mb-4">Other</h3>
            <div className="space-y-3">
              <SkillBar skill="Python" percentage={80} />
              <SkillBar skill="C++" percentage={75} />
              <SkillBar skill="Git" percentage={85} />
              <SkillBar skill="Data Structures" percentage={85} />
              <SkillBar skill="Algorithms" percentage={80} />
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

interface SkillBarProps {
  skill: string;
  percentage: number;
}

const SkillBar = ({ skill, percentage }: SkillBarProps) => {
  return (
    <div>
      <div className="flex justify-between mb-1">
        <span>{skill}</span>
        <span>{percentage}%</span>
      </div>
      <div className="h-2 bg-muted/50 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-primary to-secondary"
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 1, ease: "easeOut", delay: 0.3 }}
        />
      </div>
    </div>
  );
};

export default Projects;
