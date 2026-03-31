/**
 * Aria Global Wisdom - Tax Knowledge
 * Conoscenza fiscale globale per diversi paesi
 */

export type Country = 'IT' | 'US' | 'ES' | 'FR' | 'DE' | 'GB';

export interface TaxInfo {
  country: Country;
  propertyTax: {
    name: string;
    description: string;
    rate?: string;
  };
  rentalIncome: {
    name: string;
    description: string;
    rate?: string;
  };
  capitalGains: {
    name: string;
    description: string;
    rate?: string;
  };
  cadastral: {
    name: string;
    description: string;
  };
  notes: string[];
}

export const taxKnowledge: Record<Country, TaxInfo> = {
  IT: {
    country: 'IT',
    propertyTax: {
      name: 'IMU (Imposta Municipale Unica)',
      description: 'Tassa annuale sugli immobili posseduti',
      rate: '0.4% - 0.76% del valore catastale',
    },
    rentalIncome: {
      name: 'IRPEF su Redditi da Locazione',
      description: 'Tassazione redditi da affitto',
      rate: 'Progressiva fino al 43%',
    },
    capitalGains: {
      name: 'Plusvalenza',
      description: 'Tassa sulla vendita di immobili',
      rate: '26% se venduto entro 5 anni, esente dopo',
    },
    cadastral: {
      name: 'Rendita Catastale',
      description: 'Valore catastale utilizzato per calcoli fiscali',
    },
    notes: [
      'Prima casa: esenzione IMU se non di lusso',
      'Affitti brevi: regime forfettario 21% disponibile',
      'Ristrutturazioni: detrazioni fiscali fino al 50%',
    ],
  },
  US: {
    country: 'US',
    propertyTax: {
      name: 'Property Tax',
      description: 'Annual property tax based on assessed value',
      rate: 'Varies by state (0.5% - 2.5%)',
    },
    rentalIncome: {
      name: 'Rental Income Tax',
      description: 'Taxed as ordinary income',
      rate: '10% - 37% (federal) + state tax',
    },
    capitalGains: {
      name: 'Capital Gains Tax',
      description: 'Tax on property sale profit',
      rate: '0% - 20% (long-term), 37% (short-term)',
    },
    cadastral: {
      name: 'Assessed Value',
      description: 'County-assessed property value',
    },
    notes: [
      '1031 Exchange: defer capital gains by reinvesting',
      'Depreciation: 27.5 years for residential rental',
      'Mortgage interest deduction available',
    ],
  },
  ES: {
    country: 'ES',
    propertyTax: {
      name: 'IBI (Impuesto sobre Bienes Inmuebles)',
      description: 'Impuesto municipal anual',
      rate: '0.4% - 1.1% del valor catastral',
    },
    rentalIncome: {
      name: 'IRPF sobre Rentas',
      description: 'Impuesto sobre ingresos por alquiler',
      rate: '19% - 45% (progresivo)',
    },
    capitalGains: {
      name: 'Plusvalía',
      description: 'Impuesto sobre ganancias de venta',
      rate: '19% - 23%',
    },
    cadastral: {
      name: 'Valor Catastral',
      description: 'Valor catastral para cálculos fiscales',
    },
    notes: [
      'Vivienda habitual: exención parcial',
      'Alquiler turístico: régimen especial',
      'Rehabilitación: deducciones disponibles',
    ],
  },
  FR: {
    country: 'FR',
    propertyTax: {
      name: 'Taxe Foncière',
      description: 'Impôt annuel sur la propriété',
      rate: 'Variable selon la commune',
    },
    rentalIncome: {
      name: 'Impôt sur les Revenus Fonciers',
      description: 'Impôt sur les revenus locatifs',
      rate: 'Progressif jusqu\'à 45%',
    },
    capitalGains: {
      name: 'Plus-value Immobilière',
      description: 'Impôt sur la vente',
      rate: '19% + prélèvements sociaux 17.2%',
    },
    cadastral: {
      name: 'Valeur Cadastrale',
      description: 'Valeur cadastrale pour calculs fiscaux',
    },
    notes: [
      'Résidence principale: exonération partielle',
      'Pinel: réduction d\'impôt pour investissement locatif',
      'Déduction charges et intérêts d\'emprunt',
    ],
  },
  DE: {
    country: 'DE',
    propertyTax: {
      name: 'Grundsteuer',
      description: 'Jährliche Grundsteuer',
      rate: 'Variiert nach Gemeinde',
    },
    rentalIncome: {
      name: 'Einkommensteuer auf Mieteinnahmen',
      description: 'Besteuerung von Mieteinnahmen',
      rate: '14% - 45% (progressiv)',
    },
    capitalGains: {
      name: 'Spekulationssteuer',
      description: 'Steuer auf Verkaufsgewinn',
      rate: '25% + Solidaritätszuschlag',
    },
    cadastral: {
      name: 'Einheitswert',
      description: 'Einheitswert für Steuerberechnungen',
    },
    notes: [
      'Eigennutzung: Steuervergünstigungen',
      'Abschreibung: 2% jährlich über 50 Jahre',
      'Grunderwerbsteuer: 3.5% - 6.5% beim Kauf',
    ],
  },
  GB: {
    country: 'GB',
    propertyTax: {
      name: 'Council Tax',
      description: 'Annual local tax based on property band',
      rate: 'Varies by council and property band',
    },
    rentalIncome: {
      name: 'Income Tax on Rental Income',
      description: 'Taxed as income',
      rate: '20% - 45% (progressive)',
    },
    capitalGains: {
      name: 'Capital Gains Tax',
      description: 'Tax on property sale profit',
      rate: '18% - 28% (residential), 10% - 20% (commercial)',
    },
    cadastral: {
      name: 'Rateable Value',
      description: 'Valuation for tax purposes',
    },
    notes: [
      'Stamp Duty: 0% - 12% on purchase',
      'Buy-to-let: additional 3% stamp duty',
      'Private Residence Relief available',
    ],
  },
};

/**
 * Ottiene informazioni fiscali per un paese
 */
export function getTaxInfo(country: Country): TaxInfo {
  return taxKnowledge[country];
}

/**
 * Genera insight fiscale per Aria
 */
export function generateTaxInsight(
  country: Country,
  propertyType: 'sale' | 'rent',
  price: number
): string {
  const tax = getTaxInfo(country);
  
  if (propertyType === 'rent') {
    return `💰 Fiscale ${country}: Redditi da affitto tassati con ${tax.rentalIncome.name} (${tax.rentalIncome.rate || 'variabile'}). ${tax.notes[0] || ''}`;
  } else {
    return `💰 Fiscale ${country}: Vendita soggetta a ${tax.capitalGains.name} (${tax.capitalGains.rate || 'variabile'}). Considera ${tax.notes[0] || 'le agevolazioni disponibili'}.`;
  }
}

