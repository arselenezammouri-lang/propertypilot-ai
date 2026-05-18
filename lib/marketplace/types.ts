/**
 * Cross-Border Marketplace Types & Logic
 * Buyer matching across EU countries with GPT-4o translation and escrow
 */

export interface MarketplaceListing {
  id: string;
  agent_user_id: string;
  title: string;
  description: string;
  price: number;
  currency: string;
  country: string;
  city: string;
  property_type: string;
  sqm: number;
  rooms: number;
  photos: string[];
  languages_available: string[];
  commission_rate: number;
  status: "active" | "pending" | "sold" | "withdrawn";
  cross_border: boolean;
  created_at: string;
}

export interface BuyerSearch {
  id: string;
  buyer_user_id: string;
  countries: string[];
  min_budget: number;
  max_budget: number;
  property_types: string[];
  min_sqm: number;
  min_rooms: number;
  preferred_languages: string[];
  notes: string;
  active: boolean;
  created_at: string;
}

export interface MarketplaceMatch {
  listing_id: string;
  buyer_search_id: string;
  match_score: number;
  reasons: string[];
}

export interface EscrowTransaction {
  id: string;
  listing_id: string;
  buyer_id: string;
  seller_id: string;
  amount: number;
  commission: number;
  platform_fee: number;
  status: "pending" | "funded" | "completed" | "disputed" | "refunded";
  stripe_payment_intent_id: string | null;
  created_at: string;
}

/** Platform take rate on cross-border transactions */
export const PLATFORM_COMMISSION_RATE = 0.015; // 1.5%

/**
 * Match buyer searches against marketplace listings
 */
export function matchBuyerToListings(
  search: BuyerSearch,
  listings: MarketplaceListing[]
): MarketplaceMatch[] {
  return listings
    .map((listing) => {
      let score = 0;
      const reasons: string[] = [];

      // Country match
      if (search.countries.includes(listing.country)) {
        score += 25;
        reasons.push(`Country match: ${listing.country}`);
      }

      // Budget match
      if (listing.price >= search.min_budget && listing.price <= search.max_budget) {
        score += 30;
        reasons.push("Within budget range");
      } else if (listing.price <= search.max_budget * 1.1) {
        score += 15;
        reasons.push("Slightly above budget (within 10%)");
      }

      // Property type match
      if (search.property_types.includes(listing.property_type)) {
        score += 15;
        reasons.push(`Property type: ${listing.property_type}`);
      }

      // Size match
      if (listing.sqm >= search.min_sqm) {
        score += 15;
        reasons.push(`Size: ${listing.sqm}m² (min ${search.min_sqm}m²)`);
      }

      // Room match
      if (listing.rooms >= search.min_rooms) {
        score += 10;
        reasons.push(`Rooms: ${listing.rooms} (min ${search.min_rooms})`);
      }

      // Language availability bonus
      const langMatch = listing.languages_available.some(
        (l) => search.preferred_languages.includes(l)
      );
      if (langMatch) {
        score += 5;
        reasons.push("Language match available");
      }

      return { listing_id: listing.id, buyer_search_id: search.id, match_score: score, reasons };
    })
    .filter((m) => m.match_score >= 30)
    .sort((a, b) => b.match_score - a.match_score);
}
