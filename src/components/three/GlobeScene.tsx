
import { RefObject, useEffect, useRef } from 'react';
import * as THREE from 'three';
import { useGlobeControls } from './hooks/useGlobeControls';
import { createLocationMarker } from './LocationMarker';
import { latLongToVector3, createDefaultTexture } from './utils/GlobeUtils';

interface GlobeSceneProps {
  containerRef: RefObject<HTMLDivElement>;
  onTextureLoaded: () => void;
  onError: (message: string) => void;
}

export const GlobeScene = ({ containerRef, onTextureLoaded, onError }: GlobeSceneProps) => {
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const earthRef = useRef<THREE.Mesh | null>(null);
  const atmosphereRef = useRef<THREE.Mesh | null>(null);
  const highlightGroupRef = useRef<THREE.Group | null>(null);
  const frameIdRef = useRef<number | null>(null);
  
  const { autoRotate, setupMouseControls } = useGlobeControls();

  useEffect(() => {
    if (!containerRef.current) return;
    
    // Scene setup
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Camera setup
    const camera = new THREE.PerspectiveCamera(
      45,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.z = 3;
    cameraRef.current = camera;

    // Renderer setup
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

    // Load texture with error handling
    const textureLoader = new THREE.TextureLoader();
    
    // Try to load the texture
    textureLoader.load(
      '/earth_dark.jpg',
      (texture) => {
        console.log("Earth texture loaded successfully");
        onTextureLoaded();
        
        // Create earth with loaded texture
        createEarth(texture);
      },
      undefined,
      (err) => {
        console.error("Error loading earth texture:", err);
        onError("Failed to load earth texture. Using fallback.");
        
        // Create earth with default texture
        const defaultTexture = createDefaultTexture();
        createEarth(defaultTexture);
      }
    );

    // Earth creation function
    const createEarth = (texture: THREE.Texture) => {
      // Earth mesh
      const earthGeometry = new THREE.SphereGeometry(1, 64, 64);
      
      const earthMaterial = new THREE.ShaderMaterial({
        uniforms: {
          time: { value: 0 },
          earthTexture: { value: texture },
          glowColor: { value: new THREE.Color(0x0099ff) }
        },
        vertexShader: `
          varying vec2 vUv;
          varying vec3 vNormal;
          
          void main() {
            vUv = uv;
            vNormal = normalize(normalMatrix * normal);
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,
        fragmentShader: `
          uniform sampler2D earthTexture;
          uniform float time;
          uniform vec3 glowColor;
          
          varying vec2 vUv;
          varying vec3 vNormal;
          
          void main() {
            // Basic earth texture
            vec4 earthColor = texture2D(earthTexture, vUv);
            
            // Edge glow effect
            float intensity = pow(0.7 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.0);
            vec3 glow = glowColor * intensity;
            
            gl_FragColor = earthColor + vec4(glow, 0.0);
          }
        `
      });

      const earth = new THREE.Mesh(earthGeometry, earthMaterial);
      scene.add(earth);
      earthRef.current = earth;

      // Add atmosphere
      const atmosphereGeometry = new THREE.SphereGeometry(1.03, 64, 64);
      const atmosphereMaterial = new THREE.ShaderMaterial({
        uniforms: {
          time: { value: 0 },
          glowColor: { value: new THREE.Color(0x0099ff) }
        },
        vertexShader: `
          varying vec3 vNormal;
          
          void main() {
            vNormal = normalize(normalMatrix * normal);
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,
        fragmentShader: `
          uniform float time;
          uniform vec3 glowColor;
          
          varying vec3 vNormal;
          
          void main() {
            float intensity = pow(0.65 - dot(vNormal, vec3(0, 0, 1.0)), 3.0);
            vec3 glow = glowColor * intensity;
            gl_FragColor = vec4(glow, intensity * 0.3);
          }
        `,
        transparent: true,
        blending: THREE.AdditiveBlending,
        side: THREE.BackSide
      });

      const atmosphere = new THREE.Mesh(atmosphereGeometry, atmosphereMaterial);
      scene.add(atmosphere);
      atmosphereRef.current = atmosphere;

      // Create a group for the highlight elements
      const highlightGroup = new THREE.Group();
      scene.add(highlightGroup);
      highlightGroupRef.current = highlightGroup;

      // Assam location marker (approximate coordinates)
      // Assam is at roughly 26.2006° N, 92.9376° E
      const assamPosition = latLongToVector3(26.2006, 92.9376, 1.02);
      
      // Add location marker
      createLocationMarker(highlightGroup, assamPosition);
    };

    // Setup mouse controls
    const { onMouseMove, onMouseEnter, onMouseLeave, targetRotationX, targetRotationY } = 
      setupMouseControls(containerRef);
    
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
      if (!earthRef.current) {
        // If earth isn't created yet, wait and try again
        frameIdRef.current = requestAnimationFrame(animate);
        return;
      }

      const elapsedTime = clock.getElapsedTime();
      
      // Update shader uniforms
      if (earthRef.current?.material) {
        (earthRef.current.material as THREE.ShaderMaterial).uniforms.time.value = elapsedTime;
      }
      
      // Update ring materials
      if (highlightGroupRef.current) {
        highlightGroupRef.current.children.forEach(child => {
          if (child instanceof THREE.Mesh && child.material instanceof THREE.ShaderMaterial) {
            child.material.uniforms.time.value = elapsedTime;
          }
        });
      }
      
      // Globe rotation logic
      if (autoRotate.current && earthRef.current && atmosphereRef.current) {
        // Auto-rotation when not interacting
        const autoRotateSpeed = 0.001;
        earthRef.current.rotation.y += autoRotateSpeed;
        atmosphereRef.current.rotation.y += autoRotateSpeed;
      } else if (earthRef.current && atmosphereRef.current) {
        // Interactive rotation
        earthRef.current.rotation.y += (targetRotationY.current - earthRef.current.rotation.y) * 0.05;
        earthRef.current.rotation.x += (targetRotationX.current - earthRef.current.rotation.x) * 0.05;
        
        atmosphereRef.current.rotation.y = earthRef.current.rotation.y;
        atmosphereRef.current.rotation.x = earthRef.current.rotation.x;
      }
      
      // Update highlight group rotation to match earth
      if (highlightGroupRef.current && earthRef.current) {
        highlightGroupRef.current.rotation.copy(earthRef.current.rotation);
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
      console.log("Globe component unmounting");
      if (containerRef.current && rendererRef.current) {
        containerRef.current.removeChild(rendererRef.current.domElement);
      }
      
      if (frameIdRef.current) {
        cancelAnimationFrame(frameIdRef.current);
      }
      
      if (containerRef.current) {
        containerRef.current.removeEventListener('mousemove', onMouseMove);
        containerRef.current.removeEventListener('mouseenter', onMouseEnter);
        containerRef.current.removeEventListener('mouseleave', onMouseLeave);
      }
      
      resizeObserver.disconnect();
      
      // Dispose geometries and materials
      if (earthRef.current) {
        earthRef.current.geometry.dispose();
        (earthRef.current.material as THREE.Material).dispose();
      }
      
      if (atmosphereRef.current) {
        atmosphereRef.current.geometry.dispose();
        (atmosphereRef.current.material as THREE.Material).dispose();
      }
      
      if (highlightGroupRef.current) {
        highlightGroupRef.current.children.forEach(child => {
          if (child instanceof THREE.Mesh) {
            child.geometry.dispose();
            if (child.material instanceof THREE.Material) {
              child.material.dispose();
            }
          }
        });
      }
    };
  }, [containerRef, onTextureLoaded, onError, setupMouseControls]);

  return null; // This is a logic component, not a visual one
};
