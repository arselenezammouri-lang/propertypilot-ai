"use client";

import { useEffect, useRef, useState } from "react";
import { MapPin } from "lucide-react";

interface PropertyMapProps {
  address?: string;
  lat?: number;
  lng?: number;
  zoom?: number;
  markers?: Array<{ lat: number; lng: number; label?: string }>;
  className?: string;
  height?: string;
}

/**
 * Google Maps component for property locations.
 * Requires NEXT_PUBLIC_GOOGLE_MAPS_API_KEY env var.
 * Gracefully degrades to a placeholder when key is not set.
 */
export function PropertyMap({
  address,
  lat,
  lng,
  zoom = 14,
  markers = [],
  className = "",
  height = "h-64",
}: PropertyMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [loaded, setLoaded] = useState(false);
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  useEffect(() => {
    if (!apiKey || !mapRef.current) return;

    // Load Google Maps script once
    if (!document.getElementById("google-maps-script")) {
      const script = document.createElement("script");
      script.id = "google-maps-script";
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
      script.async = true;
      script.onload = () => setLoaded(true);
      document.head.appendChild(script);
    } else if (window.google?.maps) {
      setLoaded(true);
    }
  }, [apiKey]);

  useEffect(() => {
    if (!loaded || !mapRef.current || !window.google?.maps) return;

    const center = lat && lng
      ? { lat, lng }
      : { lat: 41.9028, lng: 12.4964 }; // Default: Rome

    const map = new window.google.maps.Map(mapRef.current, {
      center,
      zoom,
      styles: [
        { elementType: "geometry", stylers: [{ color: "#1a1a2e" }] },
        { elementType: "labels.text.stroke", stylers: [{ color: "#1a1a2e" }] },
        { elementType: "labels.text.fill", stylers: [{ color: "#8b5cf6" }] },
        { featureType: "road", elementType: "geometry", stylers: [{ color: "#2a2a4a" }] },
        { featureType: "water", elementType: "geometry", stylers: [{ color: "#0f0f23" }] },
      ],
      disableDefaultUI: true,
      zoomControl: true,
    });

    // Add markers
    const allMarkers = markers.length > 0
      ? markers
      : lat && lng ? [{ lat, lng, label: address }] : [];

    allMarkers.forEach((m) => {
      const marker = new window.google.maps.Marker({
        position: { lat: m.lat, lng: m.lng },
        map,
        title: m.label,
      });
      if (m.label) {
        const info = new window.google.maps.InfoWindow({ content: `<div style="color:#000;font-size:13px;padding:4px">${m.label}</div>` });
        marker.addListener("click", () => info.open(map, marker));
      }
    });

    // Geocode address if no lat/lng
    if (address && !lat && !lng) {
      const geocoder = new window.google.maps.Geocoder();
      geocoder.geocode({ address }, (results, status) => {
        if (status === "OK" && results?.[0]) {
          const pos = results[0].geometry.location;
          map.setCenter(pos);
          new window.google.maps.Marker({ position: pos, map, title: address });
        }
      });
    }
  }, [loaded, lat, lng, zoom, address, markers]);

  // Fallback when no API key
  if (!apiKey) {
    return (
      <div className={`${height} ${className} rounded-xl bg-muted/30 border border-border/50 flex flex-col items-center justify-center`}>
        <MapPin className="w-8 h-8 text-muted-foreground mb-2" />
        <p className="text-xs text-muted-foreground">
          {address || "Map preview"}
        </p>
        <p className="text-[10px] text-muted-foreground/60 mt-1">
          Set NEXT_PUBLIC_GOOGLE_MAPS_API_KEY to enable maps
        </p>
      </div>
    );
  }

  return (
    <div ref={mapRef} className={`${height} ${className} rounded-xl overflow-hidden`} />
  );
}
