// src/config/particles-config.ts
import type { ISourceOptions } from "@tsparticles/engine";

export const options: ISourceOptions = {
  fullScreen: {
    enable: true,
    zIndex: -1, // Ensure particles are visible and interactive
  },
  background: {
    color: {
      value: 'transparent', // Still transparent for the CSS background
    },
  },
  fpsLimit: 120,
  absorbers: [
    {
      color: { value: "#E50000" },
      draggable: true,
      opacity: 0,
      position: {
        x: 50,
        y: 50,
      },
      size: {
        value: 20,
        density: 5,
        limit: 50,
      },
    },
  ],
  interactivity: {
    events: {
      onHover: {
        enable: true,
        mode: 'bubble', // Or 'attract', whichever you prefer for the particles
      },
      resize: {
        enable: true,
      },
    },
    modes: {
      bubble: {
        distance: 200,
        size: 8,
        duration: 2,
        opacity: 1,
        color: {
          value: '#fE50000',
        }
      },
      attract: { // If you prefer attract mode
        distance: 200,
        duration: 0.4,
        factor: 2,
      },
    },
  },
  particles: {
    color: {
      value: "#E50000",
    },
    links: {
      enable: false,
    },
    move: {
      enable: false, // Particles remain stationary for the radar effect
      direction: "none",
      outModes: {
        default: "bounce",
      },
      random: true,
      speed: 0.2,
      straight: false,
    },
    number: {
      density: {
        enable: true,
      },
      value: 100,
    },
    opacity: {
      value: { min: 0.1, max: 0.5 },
      animation: {
        enable: true,
        speed: 1,
        sync: false,
        startValue: "random",
      },
    },
    shape: {
      type: "circle",
    },
    size: {
      value: { min: 2, max: 4 },
    },
  },
  detectRetina: true,
};