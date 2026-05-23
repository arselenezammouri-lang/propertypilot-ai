// Google Maps JavaScript API type declarations
/* eslint-disable @typescript-eslint/no-explicit-any */

export {};

declare global {
  namespace google.maps {
    class Map {
      constructor(el: HTMLElement, opts?: any);
      setCenter(pos: { lat: number; lng: number }): void;
    }
    class Marker {
      constructor(opts?: any);
      addListener(event: string, handler: () => void): void;
    }
    class InfoWindow {
      constructor(opts?: any);
      open(map: any, marker?: any): void;
    }
    class Geocoder {
      geocode(
        request: { address: string },
        callback: (results: any[] | null, status: string) => void
      ): void;
    }
    namespace places {
      class AutocompleteService {
        getPlacePredictions(
          request: any,
          callback: (predictions: any[] | null, status: any) => void
        ): void;
      }
      class Autocomplete {
        constructor(input: HTMLInputElement, opts?: any);
        addListener(event: string, handler: () => void): void;
        getPlace(): any;
      }
      const PlacesServiceStatus: { OK: string };
    }
  }

  interface Window {
    google?: typeof google;
    initGoogleMaps?: () => void;
  }
}
