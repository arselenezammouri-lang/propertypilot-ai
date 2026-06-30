'use client';

import { useState } from 'react';
import { Maximize2, Minimize2, Volume2, VolumeX, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface VirtualTourEmbedProps {
  tourUrl: string;
  title?: string;
  provider?: 'matterport' | 'cloudpano' | 'pannellum' | 'generic';
  height?: string;
  showControls?: boolean;
}

export function VirtualTourEmbed({
  tourUrl,
  title,
  provider = 'generic',
  height = '500px',
  showControls = true,
}: VirtualTourEmbedProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isMuted, setIsMuted] = useState(true);

  const handleFullscreen = () => {
    const el = document.getElementById('virtual-tour-container');
    if (!el) return;
    if (!isFullscreen) {
      el.requestFullscreen?.();
    } else {
      document.exitFullscreen?.();
    }
    setIsFullscreen(!isFullscreen);
  };

  return (
    <div
      id="virtual-tour-container"
      className="relative rounded-xl overflow-hidden border border-border bg-black"
      style={{ height }}
    >
      <iframe
        src={tourUrl}
        className="w-full h-full border-0"
        allow="fullscreen; vr; xr-spatial-tracking; gyroscope; accelerometer"
        allowFullScreen
        title={title || 'Virtual Tour'}
        loading="lazy"
      />

      {showControls && (
        <div className="absolute bottom-4 right-4 flex items-center gap-2">
          {provider === 'matterport' && (
            <Badge variant="secondary" className="bg-black/60 text-white text-xs">
              Matterport 3D
            </Badge>
          )}
          <Button
            variant="ghost"
            size="icon"
            className="bg-black/60 text-white hover:bg-black/80 h-8 w-8"
            onClick={() => setIsMuted(!isMuted)}
          >
            {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="bg-black/60 text-white hover:bg-black/80 h-8 w-8"
            onClick={handleFullscreen}
          >
            {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
          </Button>
        </div>
      )}

      {title && (
        <div className="absolute top-4 left-4">
          <Badge className="bg-black/60 text-white">{title}</Badge>
        </div>
      )}
    </div>
  );
}
