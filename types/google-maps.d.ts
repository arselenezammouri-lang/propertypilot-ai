declare namespace google {
  namespace maps {
    namespace places {
      class AutocompleteService {
        getPlacePredictions(
          request: { input: string; types?: string[] },
          callback: (
            predictions: Array<{ description: string; place_id: string }> | null,
            status: string
          ) => void
        ): void;
      }
      const PlacesServiceStatus: {
        OK: string;
        ZERO_RESULTS: string;
        ERROR: string;
      };
    }
  }
}
