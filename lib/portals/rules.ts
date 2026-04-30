/**
 * Portal Rules Database — SEO patterns, character limits, regulatory requirements
 * for every major European real estate portal.
 */

import type { PortalRules, PortalId } from "./types";

export const PORTAL_RULES: Record<PortalId, PortalRules> = {
  immobiliare_it: {
    id: "immobiliare_it",
    name: "Immobiliare.it",
    country: "IT",
    language: "it",
    title: {
      maxLength: 100,
      mustInclude: ["property_type", "location"],
      forbidden: ["URGENTE", "!!!", "AFFARE", "OCCASIONE"],
      seoPattern: "{type} {rooms} locali in {location} — {highlight}",
    },
    description: {
      minLength: 300,
      maxLength: 3000,
      requiredSections: ["posizione", "caratteristiche", "servizi_zona"],
      seoKeywords: ["trilocale", "bilocale", "ristrutturato", "luminoso", "balcone", "terrazzo", "classe energetica", "ascensore", "box auto"],
    },
    regulatory: {
      energyClassRequired: true,
      energyClassFormat: "APE A4-G",
      surfaceUnit: "sqm",
      priceFormat: "€{price}",
      mandatoryDisclosures: ["Classe energetica", "Indice IPE", "Spese condominiali stimate"],
    },
    media: { maxPhotos: 30, maxVideoLength: 180, requiredPhotoTypes: ["esterno", "soggiorno", "cucina"] },
  },

  casa_it: {
    id: "casa_it",
    name: "Casa.it",
    country: "IT",
    language: "it",
    title: {
      maxLength: 80,
      mustInclude: ["property_type"],
      forbidden: ["URGENTE", "!!!"],
      seoPattern: "{type} in vendita {location}",
    },
    description: {
      minLength: 200,
      maxLength: 2500,
      requiredSections: ["descrizione", "posizione"],
      seoKeywords: ["vendita", "affitto", "attico", "villa", "appartamento", "monolocale"],
    },
    regulatory: {
      energyClassRequired: true,
      energyClassFormat: "APE A4-G",
      surfaceUnit: "sqm",
      priceFormat: "€{price}",
      mandatoryDisclosures: ["Classe energetica"],
    },
    media: { maxPhotos: 20, maxVideoLength: 120, requiredPhotoTypes: ["esterno"] },
  },

  idealista: {
    id: "idealista",
    name: "Idealista",
    country: "ES",
    language: "es",
    title: {
      maxLength: 90,
      mustInclude: ["property_type", "location"],
      forbidden: ["URGENTE", "GANGA"],
      seoPattern: "{type} en {location} — {rooms} hab, {surface}m²",
    },
    description: {
      minLength: 200,
      maxLength: 3000,
      requiredSections: ["ubicación", "características", "transporte"],
      seoKeywords: ["piso", "ático", "chalet", "reformado", "luminoso", "terraza", "garaje", "ascensor", "certificado energético"],
    },
    regulatory: {
      energyClassRequired: true,
      energyClassFormat: "CE A-G",
      surfaceUnit: "sqm",
      priceFormat: "{price} €",
      mandatoryDisclosures: ["Certificado energético", "Gastos de comunidad"],
    },
    media: { maxPhotos: 30, maxVideoLength: 180, requiredPhotoTypes: ["exterior", "salón"] },
  },

  seloger: {
    id: "seloger",
    name: "SeLoger",
    country: "FR",
    language: "fr",
    title: {
      maxLength: 120,
      mustInclude: ["property_type", "location", "rooms"],
      forbidden: ["URGENT", "!!!"],
      seoPattern: "{type} {rooms} pièces à {location} ({surface}m²)",
    },
    description: {
      minLength: 300,
      maxLength: 4000,
      requiredSections: ["situation", "description", "prestations", "charges"],
      seoKeywords: ["appartement", "maison", "studio", "rénové", "lumineux", "balcon", "terrasse", "parking", "DPE", "cave"],
    },
    regulatory: {
      energyClassRequired: true,
      energyClassFormat: "DPE A-G + GES A-G",
      surfaceUnit: "sqm",
      priceFormat: "{price} €",
      mandatoryDisclosures: ["DPE", "GES", "Charges de copropriété", "Loi Carrez surface"],
    },
    media: { maxPhotos: 25, maxVideoLength: 180, requiredPhotoTypes: ["extérieur", "séjour", "cuisine"] },
  },

  leboncoin: {
    id: "leboncoin",
    name: "LeBonCoin",
    country: "FR",
    language: "fr",
    title: {
      maxLength: 70,
      mustInclude: ["property_type"],
      forbidden: [],
      seoPattern: "{type} {rooms}p {surface}m² {location}",
    },
    description: {
      minLength: 100,
      maxLength: 4000,
      requiredSections: ["description"],
      seoKeywords: ["vente", "location", "T2", "T3", "T4", "lumineux", "calme"],
    },
    regulatory: {
      energyClassRequired: true,
      energyClassFormat: "DPE A-G",
      surfaceUnit: "sqm",
      priceFormat: "{price} €",
      mandatoryDisclosures: ["DPE"],
    },
    media: { maxPhotos: 10, maxVideoLength: 0, requiredPhotoTypes: [] },
  },

  immoscout24: {
    id: "immoscout24",
    name: "ImmoScout24",
    country: "DE",
    language: "de",
    title: {
      maxLength: 100,
      mustInclude: ["property_type", "location"],
      forbidden: ["DRINGEND", "!!!"],
      seoPattern: "{type} in {location} — {rooms} Zimmer, {surface}m²",
    },
    description: {
      minLength: 300,
      maxLength: 4000,
      requiredSections: ["Lage", "Ausstattung", "Sonstiges"],
      seoKeywords: ["Wohnung", "Haus", "Penthouse", "renoviert", "Balkon", "Terrasse", "Garage", "Aufzug", "Energieausweis", "Erstbezug"],
    },
    regulatory: {
      energyClassRequired: true,
      energyClassFormat: "EnEV A+-H",
      surfaceUnit: "sqm",
      priceFormat: "{price} €",
      mandatoryDisclosures: ["Energieausweis", "Energieeffizienzklasse", "Baujahr", "Heizungsart"],
    },
    media: { maxPhotos: 30, maxVideoLength: 300, requiredPhotoTypes: ["Außenansicht", "Wohnzimmer"] },
  },

  immowelt: {
    id: "immowelt",
    name: "Immowelt",
    country: "DE",
    language: "de",
    title: {
      maxLength: 90,
      mustInclude: ["property_type"],
      forbidden: [],
      seoPattern: "{type} {rooms} Zi. in {location}",
    },
    description: {
      minLength: 200,
      maxLength: 3000,
      requiredSections: ["Objektbeschreibung", "Lage"],
      seoKeywords: ["Eigentumswohnung", "Einfamilienhaus", "Neubau", "saniert", "ruhig", "zentral"],
    },
    regulatory: {
      energyClassRequired: true,
      energyClassFormat: "EnEV A+-H",
      surfaceUnit: "sqm",
      priceFormat: "{price} €",
      mandatoryDisclosures: ["Energieausweis"],
    },
    media: { maxPhotos: 20, maxVideoLength: 180, requiredPhotoTypes: [] },
  },

  rightmove: {
    id: "rightmove",
    name: "Rightmove",
    country: "UK",
    language: "en",
    title: {
      maxLength: 120,
      mustInclude: ["rooms", "property_type", "location"],
      forbidden: [],
      seoPattern: "{rooms} bedroom {type} for sale in {location}",
    },
    description: {
      minLength: 200,
      maxLength: 4000,
      requiredSections: ["summary", "location", "features"],
      seoKeywords: ["detached", "semi-detached", "terraced", "flat", "bungalow", "garden", "parking", "double glazing", "central heating", "EPC"],
    },
    regulatory: {
      energyClassRequired: true,
      energyClassFormat: "EPC A-G",
      surfaceUnit: "sqft",
      priceFormat: "£{price}",
      mandatoryDisclosures: ["EPC rating", "Council tax band", "Tenure (freehold/leasehold)"],
    },
    media: { maxPhotos: 30, maxVideoLength: 300, requiredPhotoTypes: ["exterior", "living_room"] },
  },

  zoopla: {
    id: "zoopla",
    name: "Zoopla",
    country: "UK",
    language: "en",
    title: {
      maxLength: 100,
      mustInclude: ["rooms", "property_type"],
      forbidden: [],
      seoPattern: "{rooms} bed {type} in {location}",
    },
    description: {
      minLength: 200,
      maxLength: 3500,
      requiredSections: ["description", "location"],
      seoKeywords: ["detached", "flat", "maisonette", "garden", "garage", "period property", "character"],
    },
    regulatory: {
      energyClassRequired: true,
      energyClassFormat: "EPC A-G",
      surfaceUnit: "sqft",
      priceFormat: "£{price}",
      mandatoryDisclosures: ["EPC rating"],
    },
    media: { maxPhotos: 25, maxVideoLength: 180, requiredPhotoTypes: [] },
  },

  fotocasa: {
    id: "fotocasa",
    name: "Fotocasa",
    country: "ES",
    language: "es",
    title: {
      maxLength: 90,
      mustInclude: ["property_type"],
      forbidden: [],
      seoPattern: "{type} en {location}, {rooms} hab",
    },
    description: {
      minLength: 150,
      maxLength: 3000,
      requiredSections: ["descripción"],
      seoKeywords: ["piso", "casa", "dúplex", "reformado", "vistas", "terraza"],
    },
    regulatory: {
      energyClassRequired: true,
      energyClassFormat: "CE A-G",
      surfaceUnit: "sqm",
      priceFormat: "{price} €",
      mandatoryDisclosures: ["Certificado energético"],
    },
    media: { maxPhotos: 30, maxVideoLength: 120, requiredPhotoTypes: [] },
  },

  idealista_pt: {
    id: "idealista_pt",
    name: "Idealista Portugal",
    country: "PT",
    language: "pt",
    title: {
      maxLength: 90,
      mustInclude: ["property_type", "location"],
      forbidden: [],
      seoPattern: "{type} em {location} — T{rooms}, {surface}m²",
    },
    description: {
      minLength: 200,
      maxLength: 3000,
      requiredSections: ["localização", "características"],
      seoKeywords: ["apartamento", "moradia", "T1", "T2", "T3", "remodelado", "varanda", "garagem", "certificado energético"],
    },
    regulatory: {
      energyClassRequired: true,
      energyClassFormat: "CE A+-F",
      surfaceUnit: "sqm",
      priceFormat: "{price} €",
      mandatoryDisclosures: ["Certificado energético"],
    },
    media: { maxPhotos: 30, maxVideoLength: 180, requiredPhotoTypes: [] },
  },
};

/** Get rules for a specific portal */
export function getPortalRules(portalId: PortalId): PortalRules {
  return PORTAL_RULES[portalId];
}

/** Get all portals for a specific country */
export function getPortalsByCountry(country: string): PortalRules[] {
  return Object.values(PORTAL_RULES).filter((p) => p.country === country);
}

/** Format price according to portal conventions */
export function formatPortalPrice(price: number, portalId: PortalId): string {
  const rules = PORTAL_RULES[portalId];
  const formatted = price.toLocaleString(rules.language === "en" ? "en-GB" : rules.language);
  return rules.regulatory.priceFormat.replace("{price}", formatted);
}
