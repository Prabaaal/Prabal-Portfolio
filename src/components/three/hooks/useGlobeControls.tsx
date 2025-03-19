
import { RefObject, useCallback, useRef } from 'react';

export const useGlobeControls = () => {
  const mouseX = useRef(0);
  const mouseY = useRef(0);
  const targetRotationY = useRef(0);
  const targetRotationX = useRef(0);
  const autoRotate = useRef(true);
  
  const setupMouseControls = useCallback((containerRef: RefObject<HTMLDivElement>) => {
    // Mouse rotation
    const handleMouseMove = (event: MouseEvent) => {
      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return;
      
      // Calculate mouse position relative to container
      const x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
      
      mouseX.current = x;
      mouseY.current = y;
      targetRotationY.current = mouseX.current * 1.5;
      targetRotationX.current = mouseY.current * 0.8;
    };
    
    const handleMouseEnter = () => {
      autoRotate.current = false;
    };
    
    const handleMouseLeave = () => {
      autoRotate.current = true;
    };
    
    containerRef.current?.addEventListener('mousemove', handleMouseMove);
    containerRef.current?.addEventListener('mouseenter', handleMouseEnter);
    containerRef.current?.addEventListener('mouseleave', handleMouseLeave);
    
    return {
      onMouseMove: handleMouseMove,
      onMouseEnter: handleMouseEnter,
      onMouseLeave: handleMouseLeave,
      targetRotationX,
      targetRotationY
    };
  }, []);
  
  return {
    autoRotate,
    targetRotationX,
    targetRotationY,
    setupMouseControls
  };
};
