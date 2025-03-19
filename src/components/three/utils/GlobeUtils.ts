
import * as THREE from 'three';

// Convert latitude and longitude to 3D position
export const latLongToVector3 = (lat: number, long: number, radius: number): THREE.Vector3 => {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (long + 180) * (Math.PI / 180);

  return new THREE.Vector3(
    -radius * Math.sin(phi) * Math.cos(theta),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta)
  );
};

// Create default fallback texture (blue sphere)
export const createDefaultTexture = (): THREE.Texture => {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 256;
  const context = canvas.getContext('2d');
  if (context) {
    // Create a blue gradient as a fallback
    const gradient = context.createLinearGradient(0, 0, 0, 256);
    gradient.addColorStop(0, '#001a33');
    gradient.addColorStop(1, '#0066cc');
    context.fillStyle = gradient;
    context.fillRect(0, 0, 512, 256);
  }
  return new THREE.CanvasTexture(canvas);
};
