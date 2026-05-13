import { Object3D } from 'three';
declare module '*.glb';
declare module '*.gltf';
declare module '*.bin';
declare module '*.png';
declare module '*.jpg';


declare global {
  namespace JSX {
    interface IntrinsicElements {
      primitive: {
        object: Object3D;
        rotation?: [number, number, number];
        position?: [number, number, number];
        scale?: [number, number, number] | number;
        [key: string]: any;
      };
      ambientLight: { intensity?: number; [key: string]: any };
      directionalLight: {
        position?: [number, number, number];
        intensity?: number;
        [key: string]: any;
      };
    }
  }
}