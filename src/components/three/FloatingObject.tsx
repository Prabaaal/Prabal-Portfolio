
import { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface FloatingObjectProps {
  modelPath?: string;
  fallbackColor?: string;
  rotationSpeed?: number;
  scale?: number;
  className?: string;
}

const FloatingObject = ({
  modelPath,
  fallbackColor = '#0099ff',
  rotationSpeed = 0.005,
  scale = 1,
  className = ''
}: FloatingObjectProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const objectRef = useRef<THREE.Mesh | THREE.Group | null>(null);
  const frameIdRef = useRef<number | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Setup scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Setup camera
    const camera = new THREE.PerspectiveCamera(
      45,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.z = 5;
    cameraRef.current = camera;

    // Setup renderer
    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true
    });
    renderer.setSize(
      containerRef.current.clientWidth,
      containerRef.current.clientHeight
    );
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Lighting
    const ambientLight = new THREE.AmbientLight(0x404040, 1);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 2);
    directionalLight.position.set(1, 1, 1);
    scene.add(directionalLight);

    // Create a fallback cube with custom shader
    const cubeGeometry = new THREE.BoxGeometry(1.5, 1.5, 1.5);
    const cubeMaterial = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        color: { value: new THREE.Color(fallbackColor) }
      },
      vertexShader: `
        varying vec3 vPosition;
        varying vec2 vUv;
        
        void main() {
          vPosition = position;
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float time;
        uniform vec3 color;
        
        varying vec3 vPosition;
        varying vec2 vUv;
        
        void main() {
          // Gradient based on position
          float gradient = (vPosition.y + 1.5) / 3.0;
          
          // Pulse effect
          float pulse = sin(time * 2.0) * 0.5 + 0.5;
          
          // Edge highlighting
          float edge = max(0.0, 1.0 - 10.0 * abs(vUv.x - 0.5) * abs(vUv.y - 0.5));
          
          // Mix colors for final effect
          vec3 baseColor = mix(color * 0.8, color, gradient);
          vec3 finalColor = mix(baseColor, vec3(1.0), edge * 0.3 * pulse);
          
          gl_FragColor = vec4(finalColor, 1.0);
        }
      `
    });

    const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
    scene.add(cube);
    objectRef.current = cube;

    // Scale the object
    cube.scale.set(scale, scale, scale);

    // Mouse interaction
    let mouseX = 0;
    let mouseY = 0;
    let targetRotationX = 0;
    let targetRotationY = 0;
    
    const handleMouseMove = (event: MouseEvent) => {
      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return;
      
      const x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
      
      mouseX = x;
      mouseY = y;
    };
    
    containerRef.current.addEventListener('mousemove', handleMouseMove);

    // Handle container resize
    const resizeObserver = new ResizeObserver(() => {
      if (!containerRef.current || !cameraRef.current || !rendererRef.current) return;
      
      const width = containerRef.current.clientWidth;
      const height = containerRef.current.clientHeight;
      
      cameraRef.current.aspect = width / height;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(width, height);
    });
    
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    // Animation loop
    const clock = new THREE.Clock();
    
    const animate = () => {
      const elapsedTime = clock.getElapsedTime();
      
      if (objectRef.current) {
        // Update shader time uniform
        if ('material' in objectRef.current && objectRef.current.material instanceof THREE.ShaderMaterial) {
          objectRef.current.material.uniforms.time.value = elapsedTime;
        }
        
        // Auto-rotation
        objectRef.current.rotation.y += rotationSpeed;
        
        // Interactive rotation
        targetRotationX = mouseY * 1.5;
        targetRotationY = mouseX * 1.5;
        
        objectRef.current.rotation.x += (targetRotationX - objectRef.current.rotation.x) * 0.05;
        objectRef.current.rotation.z += (targetRotationY - objectRef.current.rotation.z) * 0.05;
        
        // Floating animation
        objectRef.current.position.y = Math.sin(elapsedTime * 0.5) * 0.1;
      }
      
      // Render scene
      if (sceneRef.current && cameraRef.current && rendererRef.current) {
        rendererRef.current.render(sceneRef.current, cameraRef.current);
      }
      
      frameIdRef.current = requestAnimationFrame(animate);
    };
    
    animate();

    // Cleanup
    return () => {
      if (containerRef.current && rendererRef.current) {
        containerRef.current.removeChild(rendererRef.current.domElement);
      }
      
      if (frameIdRef.current) {
        cancelAnimationFrame(frameIdRef.current);
      }
      
      containerRef.current?.removeEventListener('mousemove', handleMouseMove);
      resizeObserver.disconnect();
      
      // Dispose geometries and materials
      cubeGeometry.dispose();
      (cubeMaterial as THREE.Material).dispose();
    };
  }, [fallbackColor, rotationSpeed, scale]);

  return (
    <div 
      ref={containerRef} 
      className={`relative aspect-square w-full ${className}`}
    />
  );
};

export default FloatingObject;
