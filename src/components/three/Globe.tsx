
import { useEffect, useRef, useState } from 'react';
import { GlobeScene } from './GlobeScene';

interface GlobeProps {
  className?: string;
}

const Globe = ({ className = "" }: GlobeProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [textureLoaded, setTextureLoaded] = useState(false);

  useEffect(() => {
    if (!containerRef.current) return;
    console.log("Globe component mounted");
  }, []);

  return (
    <div 
      ref={containerRef} 
      className={`relative aspect-square w-full max-w-md mx-auto ${className}`}
      style={{ minHeight: "300px" }}
    >
      <GlobeScene 
        containerRef={containerRef} 
        onTextureLoaded={() => setTextureLoaded(true)}
        onError={(msg) => setError(msg)}
      />
      
      {error && (
        <div className="absolute top-0 left-0 right-0 bg-red-500 bg-opacity-70 text-white p-2 text-sm text-center">
          {error}
        </div>
      )}
    </div>
  );
};

export default Globe;
