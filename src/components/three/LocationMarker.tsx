
import * as THREE from 'three';

// Create Assam marker and related visual elements
export const createLocationMarker = (parent: THREE.Group, position: THREE.Vector3) => {
  // Enhanced location marker - glowing sphere
  const pointGeometry = new THREE.SphereGeometry(0.03, 16, 16);
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
  point.position.copy(position);
  parent.add(point);

  // Add an animated ring around the point
  const ringGeometry = new THREE.RingGeometry(0.05, 0.08, 32);
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
  ring.position.copy(position);
  ring.lookAt(0, 0, 0);
  ring.rotateX(Math.PI / 2);
  parent.add(ring);

  // Add a second larger pulsing ring
  const outerRingGeometry = new THREE.RingGeometry(0.1, 0.12, 32);
  const outerRingMaterial = new THREE.ShaderMaterial({
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
        float pulse = sin(time * 1.5 + 1.0) * 0.5 + 0.5;
        float alpha = pulse * 0.7;
        gl_FragColor = vec4(color, alpha);
      }
    `,
    transparent: true,
    side: THREE.DoubleSide,
    blending: THREE.AdditiveBlending
  });

  const outerRing = new THREE.Mesh(outerRingGeometry, outerRingMaterial);
  outerRing.position.copy(position);
  outerRing.lookAt(0, 0, 0);
  outerRing.rotateX(Math.PI / 2);
  parent.add(outerRing);

  // Add location info label
  const createLocationLabel = () => {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    if (!context) return null;
    
    canvas.width = 256;
    canvas.height = 128;
    
    context.fillStyle = 'rgba(0, 0, 0, 0)';
    context.fillRect(0, 0, canvas.width, canvas.height);
    
    context.font = 'bold 24px Arial';
    context.fillStyle = '#ffffff';
    context.textAlign = 'center';
    context.fillText('Assam, India', canvas.width / 2, 30);
    
    context.font = '18px Arial';
    context.fillStyle = '#f0f0f0';
    context.fillText('Home', canvas.width / 2, 60);
    
    const texture = new THREE.CanvasTexture(canvas);
    const material = new THREE.SpriteMaterial({ 
      map: texture,
      transparent: true,
      depthTest: false
    });
    
    const sprite = new THREE.Sprite(material);
    sprite.scale.set(0.5, 0.25, 1);
    sprite.position.copy(position.clone().multiplyScalar(1.3));
    
    return sprite;
  };
  
  const locationLabel = createLocationLabel();
  if (locationLabel) {
    parent.add(locationLabel);
  }

  return point;
};
