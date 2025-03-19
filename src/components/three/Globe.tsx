
import { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface GlobeProps {
  className?: string;
}

const Globe = ({ className = "" }: GlobeProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const earthRef = useRef<THREE.Mesh | null>(null);
  const pointRef = useRef<THREE.Mesh | null>(null);
  const frameIdRef = useRef<number | null>(null);

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

    // Earth creation
    const earthGeometry = new THREE.SphereGeometry(1, 64, 64);
    
    const earthMaterial = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        earthTexture: { value: new THREE.TextureLoader().load('/earth_dark.jpg') },
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

    // Assam location marker (approximate coordinates)
    // Assam is at roughly 26.2006° N, 92.9376° E
    const latLongToVector3 = (lat: number, long: number, radius: number) => {
      const phi = (90 - lat) * (Math.PI / 180);
      const theta = (long + 180) * (Math.PI / 180);

      return new THREE.Vector3(
        -radius * Math.sin(phi) * Math.cos(theta),
        radius * Math.cos(phi),
        radius * Math.sin(phi) * Math.sin(theta)
      );
    };

    // Create Assam marker
    const assamPosition = latLongToVector3(26.2006, 92.9376, 1.02);
    const pointGeometry = new THREE.SphereGeometry(0.02, 16, 16);
    const pointMaterial = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        color: { value: new THREE.Color(0xff3366) }
      },
      vertexShader: `
        varying vec3 vPosition;
        void main() {
          vPosition = position;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float time;
        uniform vec3 color;
        
        varying vec3 vPosition;
        
        void main() {
          float pulse = sin(time * 3.0) * 0.5 + 0.5;
          vec3 pulseColor = mix(color, vec3(1.0, 1.0, 1.0), pulse * 0.3);
          gl_FragColor = vec4(pulseColor, 1.0);
        }
      `,
      transparent: true
    });

    const point = new THREE.Mesh(pointGeometry, pointMaterial);
    point.position.copy(assamPosition);
    scene.add(point);
    pointRef.current = point;

    // Add a glowing ring around the point
    const ringGeometry = new THREE.RingGeometry(0.03, 0.05, 32);
    const ringMaterial = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        color: { value: new THREE.Color(0xff3366) }
      },
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float time;
        uniform vec3 color;
        
        varying vec2 vUv;
        
        void main() {
          float pulse = sin(time * 2.0) * 0.5 + 0.5;
          float alpha = pulse;
          gl_FragColor = vec4(color, alpha);
        }
      `,
      transparent: true,
      side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending
    });

    const ring = new THREE.Mesh(ringGeometry, ringMaterial);
    ring.position.copy(assamPosition);
    // Orient the ring to face outward from the globe center
    ring.lookAt(0, 0, 0);
    ring.rotateX(Math.PI / 2);
    scene.add(ring);

    // Mouse rotation
    let mouseX = 0;
    let mouseY = 0;
    let targetRotationY = 0;
    let targetRotationX = 0;
    
    const handleMouseMove = (event: MouseEvent) => {
      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return;
      
      // Calculate mouse position relative to container
      const x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
      
      mouseX = x;
      mouseY = y;
    };
    
    containerRef.current.addEventListener('mousemove', handleMouseMove);

    // Auto-rotation
    let autoRotate = true;
    const autoRotateSpeed = 0.001;
    
    containerRef.current.addEventListener('mouseenter', () => {
      autoRotate = false;
    });
    
    containerRef.current.addEventListener('mouseleave', () => {
      autoRotate = true;
    });

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
      
      // Update shader uniforms
      if (earthRef.current?.material) {
        (earthRef.current.material as THREE.ShaderMaterial).uniforms.time.value = elapsedTime;
      }
      
      if (atmosphereMaterial) {
        atmosphereMaterial.uniforms.time.value = elapsedTime;
      }
      
      if (pointRef.current?.material) {
        (pointRef.current.material as THREE.ShaderMaterial).uniforms.time.value = elapsedTime;
      }
      
      if (ringMaterial) {
        ringMaterial.uniforms.time.value = elapsedTime;
      }
      
      // Globe rotation logic
      if (autoRotate) {
        // Auto-rotation when not interacting
        earth.rotation.y += autoRotateSpeed;
        atmosphere.rotation.y += autoRotateSpeed;
      } else {
        // Interactive rotation
        targetRotationY = mouseX * 1.5;
        targetRotationX = mouseY * 0.8;
        
        earth.rotation.y += (targetRotationY - earth.rotation.y) * 0.05;
        earth.rotation.x += (targetRotationX - earth.rotation.x) * 0.05;
        
        atmosphere.rotation.y = earth.rotation.y;
        atmosphere.rotation.x = earth.rotation.x;
      }
      
      // Update point and ring position to stay in the correct place on the globe
      if (point && ring) {
        point.position.copy(assamPosition.clone().applyEuler(earth.rotation));
        ring.position.copy(point.position);
        ring.lookAt(0, 0, 0);
        ring.rotateX(Math.PI / 2);
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
      containerRef.current?.removeEventListener('mouseenter', () => { autoRotate = false; });
      containerRef.current?.removeEventListener('mouseleave', () => { autoRotate = true; });
      
      resizeObserver.disconnect();
      
      // Dispose geometries and materials
      earthGeometry.dispose();
      (earthMaterial as THREE.Material).dispose();
      atmosphereGeometry.dispose();
      atmosphereMaterial.dispose();
      pointGeometry.dispose();
      (pointMaterial as THREE.Material).dispose();
      ringGeometry.dispose();
      ringMaterial.dispose();
    };
  }, []);

  return (
    <div 
      ref={containerRef} 
      className={`relative aspect-square w-full max-w-md mx-auto ${className}`}
    />
  );
};

export default Globe;
