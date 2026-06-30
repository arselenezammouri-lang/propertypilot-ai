/**
 * Generic 360° Tour Builder
 * DIY solution — upload 360° photos, generate interactive tour for free
 * Uses Pannellum (open-source) for rendering
 */

export interface Scene360 {
  id: string;
  title: string;
  imageUrl: string;
  hotspots: Hotspot360[];
  initialViewPitch?: number;
  initialViewYaw?: number;
}

export interface Hotspot360 {
  id: string;
  type: 'info' | 'link' | 'scene';
  pitch: number;
  yaw: number;
  label: string;
  targetSceneId?: string;
  infoText?: string;
  linkUrl?: string;
}

export interface Tour360 {
  id: string;
  title: string;
  scenes: Scene360[];
  defaultSceneId: string;
  autoRotate: boolean;
  autoRotateSpeed: number;
  branding?: { logo?: string; color?: string };
}

/** Generate Pannellum configuration from our tour format */
export function generatePannellumConfig(tour: Tour360): Record<string, unknown> {
  const scenes: Record<string, unknown> = {};

  for (const scene of tour.scenes) {
    scenes[scene.id] = {
      title: scene.title,
      type: 'equirectangular',
      panorama: scene.imageUrl,
      pitch: scene.initialViewPitch ?? 0,
      yaw: scene.initialViewYaw ?? 0,
      hotSpots: scene.hotspots.map(hs => ({
        id: hs.id,
        pitch: hs.pitch,
        yaw: hs.yaw,
        type: hs.type === 'scene' ? 'scene' : 'info',
        text: hs.label,
        ...(hs.type === 'scene' ? { sceneId: hs.targetSceneId } : {}),
        ...(hs.type === 'link' ? { URL: hs.linkUrl } : {}),
      })),
    };
  }

  return {
    default: {
      firstScene: tour.defaultSceneId,
      autoLoad: true,
      autoRotate: tour.autoRotate ? tour.autoRotateSpeed : 0,
      showControls: true,
      compass: true,
    },
    scenes,
  };
}

/** Generate embeddable HTML for a tour */
export function generateEmbedHtml(tour: Tour360): string {
  const config = JSON.stringify(generatePannellumConfig(tour));
  return `<!DOCTYPE html>
<html>
<head>
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/pannellum@2.5.6/build/pannellum.css">
<script src="https://cdn.jsdelivr.net/npm/pannellum@2.5.6/build/pannellum.js"></script>
<style>body{margin:0}#panorama{width:100vw;height:100vh}</style>
</head>
<body>
<div id="panorama"></div>
<script>pannellum.viewer('panorama',${config});</script>
</body>
</html>`;
}
