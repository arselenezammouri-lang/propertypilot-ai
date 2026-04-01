"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { MapPin, Loader2 } from "lucide-react";

interface AddressAutocompleteProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  "data-testid"?: string;
}

interface Suggestion {
  description: string;
  place_id: string;
}

/**
 * Address autocomplete using Google Places Autocomplete API.
 * Falls back to a standard input if no API key is configured.
 * Requires NEXT_PUBLIC_GOOGLE_MAPS_API_KEY env var.
 */
export function AddressAutocomplete({
  value,
  onChange,
  placeholder = "Search address...",
  className = "",
  ...props
}: AddressAutocompleteProps) {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [hasApiKey, setHasApiKey] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const serviceRef = useRef<google.maps.places.AutocompleteService | null>(null);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  // Load Google Places script
  useEffect(() => {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
    if (!apiKey) return;

    setHasApiKey(true);

    if (typeof window !== "undefined" && !window.google?.maps?.places) {
      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
      script.async = true;
      script.defer = true;
      script.onload = () => {
        serviceRef.current = new google.maps.places.AutocompleteService();
      };
      document.head.appendChild(script);
    } else if (window.google?.maps?.places) {
      serviceRef.current = new google.maps.places.AutocompleteService();
    }
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const fetchSuggestions = useCallback((input: string) => {
    if (!serviceRef.current || input.length < 2) {
      setSuggestions([]);
      setIsOpen(false);
      return;
    }

    setIsLoading(true);
    serviceRef.current.getPlacePredictions(
      {
        input,
        types: ["geocode", "establishment"],
      },
      (predictions, status) => {
        setIsLoading(false);
        if (status === google.maps.places.PlacesServiceStatus.OK && predictions) {
          setSuggestions(
            predictions.map((p) => ({
              description: p.description,
              place_id: p.place_id,
            }))
          );
          setIsOpen(true);
        } else {
          setSuggestions([]);
          setIsOpen(false);
        }
      }
    );
  }, []);

  function handleInputChange(val: string) {
    onChange(val);

    if (!hasApiKey) return;

    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
    debounceRef.current = setTimeout(() => {
      fetchSuggestions(val);
    }, 300);
  }

  function handleSelect(suggestion: Suggestion) {
    onChange(suggestion.description);
    setSuggestions([]);
    setIsOpen(false);
  }

  return (
    <div ref={wrapperRef} className="relative">
      <div className="relative">
        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
        <Input
          value={value}
          onChange={(e) => handleInputChange(e.target.value)}
          placeholder={placeholder}
          className={`pl-10 ${className}`}
          autoComplete="off"
          data-testid={props["data-testid"]}
        />
        {isLoading && (
          <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground animate-spin" />
        )}
      </div>

      {isOpen && suggestions.length > 0 && (
        <div className="absolute z-50 mt-1 w-full bg-card border border-border rounded-lg shadow-lg overflow-hidden">
          {suggestions.map((s) => (
            <button
              key={s.place_id}
              type="button"
              onClick={() => handleSelect(s)}
              className="w-full px-4 py-2.5 text-left text-sm hover:bg-accent transition-colors flex items-center gap-3"
            >
              <MapPin className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />
              <span className="truncate">{s.description}</span>
            </button>
          ))}
          <div className="px-4 py-1.5 text-[10px] text-muted-foreground/50 border-t border-border bg-muted/20">
            Powered by Google
          </div>
        </div>
      )}
    </div>
  );
}
