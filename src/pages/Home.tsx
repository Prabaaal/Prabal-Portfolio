import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronRight, Star, Code, ArrowRight } from 'lucide-react';
import Globe from '../components/three/Globe';
import { Button } from '@/components/ui/button';
const Home = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  useEffect(() => {
    // Delay setting loaded to true for the animations to work properly
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  // Container animation
  const containerVariants = {
    hidden: {
      opacity: 0
    },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.2
      }
    }
  };

  // Child elements animation
  const itemVariants = {
    hidden: {
      y: 20,
      opacity: 0
    },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1]
      }
    }
  };
  return <motion.div className="flex flex-col lg:flex-row gap-10 pb-10" initial="hidden" animate={isLoaded ? "visible" : "hidden"} variants={containerVariants}>
      {/* Left Column - Text Content */}
      <motion.div className="flex-1 flex flex-col justify-center" variants={itemVariants}>
        <div className="max-w-2xl mx-auto lg:mx-0">
          <motion.div variants={itemVariants}>
            <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary mb-6 border border-primary/20">
              <Star className="h-3 w-3 mr-1 text-primary" />
              <span>B.Tech Student • Computer Science</span>
            </div>
          </motion.div>

          <motion.h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 tracking-tight" variants={itemVariants}>
            Hi, I'm <span className="text-gradient from-primary via-secondary to-accent">Prabal Gogoi</span>
          </motion.h1>

          <motion.p className="text-lg text-muted-foreground mb-8" variants={itemVariants}>
            Computer Science student at university, passionate about creating innovative solutions through code.
            Exploring the frontiers of technology with a focus on scalable applications and elegant interfaces.
          </motion.p>

          <motion.div className="flex flex-wrap gap-4 mb-12" variants={itemVariants}>
            <Button asChild className="rounded-full" size="lg">
              <Link to="/projects">
                View Projects <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" className="rounded-full" size="lg">
              <Link to="/contact">
                Contact Me
              </Link>
            </Button>
          </motion.div>

          <motion.div variants={itemVariants}>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {['JavaScript', 'React', 'Node.js', 'Python', 'C++', 'Three.js'].map(tech => <div key={tech} className="flex items-center px-4 py-2 glass-card rounded-lg">
                  <Code className="h-4 w-4 text-primary mr-2" />
                  <span className="text-sm">{tech}</span>
                </div>)}
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Right Column - Globe Visualization */}
      <motion.div className="flex-1 flex items-center justify-center p-4" variants={itemVariants}>
        <div className="relative">
          <motion.div className="absolute inset-0 -z-10 from-primary/20 to-transparent rounded-full blur-3xl" initial={{
          opacity: 0
        }} animate={{
          opacity: 0.6
        }} transition={{
          delay: 1,
          duration: 1
        }} />
          <div className="glass-card p-8 rounded-2xl relative overflow-hidden">
            <h2 className="text-xl md:text-2xl font-bold mb-4 text-center">I'm located in Assam, India</h2>
            {/* Explicitly set height and width for the Globe component */}
            <div style={{
            height: "350px",
            width: "100%"
          }}>
              <Globe className="w-full h-full" />
            </div>
            <Link to="/about" className="absolute bottom-4 right-4 text-primary flex items-center text-sm hover:underline">
              More about me <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </motion.div>
    </motion.div>;
};
export default Home;