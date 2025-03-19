
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, User, GraduationCap, Code, Briefcase, Heart } from 'lucide-react';
import FloatingObject from '../components/three/FloatingObject';

const About = () => {
  const [isLoaded, setIsLoaded] = useState(false);

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
        delayChildren: 0.2,
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
      transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] }
    }
  };

  return (
    <motion.div
      className="max-w-5xl mx-auto"
      initial="hidden"
      animate={isLoaded ? "visible" : "hidden"}
      variants={containerVariants}
    >
      <motion.div variants={itemVariants} className="text-center mb-16">
        <h1 className="text-3xl md:text-5xl font-bold mb-4">About Me</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Computer science enthusiast exploring the intersection of technology and creativity.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
        <motion.div variants={itemVariants} className="md:col-span-2">
          <div className="glass-card p-8 rounded-2xl h-full">
            <h2 className="text-2xl font-bold mb-6 text-gradient from-primary via-secondary to-accent">My Journey</h2>
            
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="mt-1">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center bg-primary/20 text-primary">
                    <User className="w-5 h-5" />
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-semibold">Prabal Gogoi</h3>
                  <p className="text-muted-foreground">
                    I'm a 2nd year B.Tech student from Assam, India, passionate about building innovative solutions through code.
                  </p>
                </div>
              </div>
              
              <div className="flex gap-4">
                <div className="mt-1">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center bg-secondary/20 text-secondary">
                    <GraduationCap className="w-5 h-5" />
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-semibold">Education</h3>
                  <p className="text-muted-foreground">
                    Currently pursuing B.Tech in Computer Science, with a focus on AI, web development, and data structures.
                  </p>
                </div>
              </div>
              
              <div className="flex gap-4">
                <div className="mt-1">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center bg-accent/20 text-accent">
                    <Code className="w-5 h-5" />
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-semibold">Technical Skills</h3>
                  <p className="text-muted-foreground">
                    Proficient in JavaScript, Python, C++, React, Node.js, and exploring 3D visualization with Three.js.
                  </p>
                </div>
              </div>
              
              <div className="flex gap-4">
                <div className="mt-1">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center bg-primary/20 text-primary">
                    <Heart className="w-5 h-5" />
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-semibold">Interests</h3>
                  <p className="text-muted-foreground">
                    When I'm not coding, I enjoy problem-solving, participating in hackathons, and exploring new technologies.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
        
        <motion.div variants={itemVariants}>
          <div className="glass-card p-6 rounded-2xl h-full flex flex-col">
            <h2 className="text-xl font-bold mb-4">Tech Stack</h2>
            <div className="grow">
              <FloatingObject fallbackColor="#4fc0ff" scale={1.2} />
            </div>
            <div className="grid grid-cols-3 gap-2 mt-4">
              {['React', 'Node', 'Python', 'C++', 'JS', 'SQL'].map((tech) => (
                <div key={tech} className="text-center px-2 py-1 bg-muted/50 rounded text-xs">
                  {tech}
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      <motion.div variants={itemVariants}>
        <div className="glass-card p-8 rounded-2xl mb-16">
          <h2 className="text-2xl font-bold mb-6 text-gradient from-primary via-secondary to-accent">Education & Experience</h2>
          
          <div className="space-y-8">
            <div className="relative pl-10 pb-8 border-l border-muted before:absolute before:left-[-5px] before:top-2 before:h-3 before:w-3 before:rounded-full before:bg-primary">
              <div className="flex items-center mb-2 -ml-10 text-sm text-muted-foreground">
                <Calendar className="mr-2 h-4 w-4" />
                <span>2022 - Present</span>
              </div>
              <h3 className="text-xl font-bold">B.Tech in Computer Science</h3>
              <p className="text-muted-foreground">University of Technology</p>
              <p className="mt-2">
                Currently in my 2nd year, focusing on algorithms, data structures, and web development technologies.
                Maintaining a strong academic record while participating in coding competitions.
              </p>
            </div>
            
            <div className="relative pl-10 pb-8 border-l border-muted before:absolute before:left-[-5px] before:top-2 before:h-3 before:w-3 before:rounded-full before:bg-secondary">
              <div className="flex items-center mb-2 -ml-10 text-sm text-muted-foreground">
                <Calendar className="mr-2 h-4 w-4" />
                <span>2023 - Present</span>
              </div>
              <h3 className="text-xl font-bold">Coding Club Lead</h3>
              <p className="text-muted-foreground">University of Technology</p>
              <p className="mt-2">
                Leading the university's coding club, organizing workshops, hackathons, and coding challenges for fellow students.
                Promoting collaborative learning and technical skill development.
              </p>
            </div>
            
            <div className="relative pl-10 border-l border-muted before:absolute before:left-[-5px] before:top-2 before:h-3 before:w-3 before:rounded-full before:bg-accent">
              <div className="flex items-center mb-2 -ml-10 text-sm text-muted-foreground">
                <Calendar className="mr-2 h-4 w-4" />
                <span>Summer 2023</span>
              </div>
              <h3 className="text-xl font-bold">Web Development Intern</h3>
              <p className="text-muted-foreground">TechStart Solutions</p>
              <p className="mt-2">
                Developed responsive web applications using React and Node.js. Collaborated with senior developers to implement new features 
                and fix bugs. Gained hands-on experience with modern development workflows.
              </p>
            </div>
          </div>
        </div>
      </motion.div>
      
      <motion.div variants={itemVariants} className="glass-card p-8 rounded-2xl mb-8">
        <h2 className="text-2xl font-bold mb-6 text-gradient from-primary via-secondary to-accent">Personal Interests</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-xl font-bold mb-2">Professional</h3>
            <ul className="space-y-2">
              <li className="flex items-start">
                <div className="mr-2 mt-1 text-primary">•</div>
                <span>Competitive Programming</span>
              </li>
              <li className="flex items-start">
                <div className="mr-2 mt-1 text-primary">•</div>
                <span>Open Source Contribution</span>
              </li>
              <li className="flex items-start">
                <div className="mr-2 mt-1 text-primary">•</div>
                <span>AI and Machine Learning</span>
              </li>
              <li className="flex items-start">
                <div className="mr-2 mt-1 text-primary">•</div>
                <span>Web Application Development</span>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-xl font-bold mb-2">Personal</h3>
            <ul className="space-y-2">
              <li className="flex items-start">
                <div className="mr-2 mt-1 text-secondary">•</div>
                <span>Photography</span>
              </li>
              <li className="flex items-start">
                <div className="mr-2 mt-1 text-secondary">•</div>
                <span>Reading sci-fi novels</span>
              </li>
              <li className="flex items-start">
                <div className="mr-2 mt-1 text-secondary">•</div>
                <span>Hiking</span>
              </li>
              <li className="flex items-start">
                <div className="mr-2 mt-1 text-secondary">•</div>
                <span>Chess</span>
              </li>
            </ul>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default About;
