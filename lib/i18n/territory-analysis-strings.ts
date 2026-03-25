/**
 * Localized copy for mock territory analysis (Territory Commander).
 * Single source of truth — used by lib/ai/territory-analysis.ts
 */

import type { Locale } from '@/lib/i18n/config';
import type { DemandLevel } from '@/lib/ai/territory-analysis';

export type DnaCategoryId = 'education' | 'transport' | 'green' | 'business' | 'security';

export type TerritoryAnalysisStrings = {
  demandDescriptions: Record<DemandLevel, string>;
  /** Short names for pitch sentences (comma-separated lists) */
  categoryNames: Record<DnaCategoryId, string>;
  /** UI labels for DNA rows (Territory Commander) */
  categoryLabels: Record<DnaCategoryId, string>;
  dna: {
    educationStrengthDesc: string;
    educationWeaknessDesc: string;
    transportStrengthDesc: string;
    transportWeaknessDesc: string;
    greenStrengthDesc: string;
    businessStrengthDesc: string;
    securityStrengthDesc: string;
  };
  commercial: {
    coworkingActivity: string;
    coworkingReason: string;
    barActivity: string;
    barReason: string;
    pharmacyActivity: string;
    pharmacyReason: string;
    gapPharmacyCategory: string;
    gapPharmacyDesc: string;
    gapFoodCategory: string;
    gapFoodDesc: string;
  };
  marketAdvice: {
    /** `{days}` */
    hot: string;
    warm: string;
    cold: string;
    /** `{count}` strengths count */
    strongDnaSuffix: string;
  };
  pitch: {
    /** `{days}` */
    hotIntro: string;
    warmIntro: string;
    coldIntro: string;
    /** `{count}` then list of categories appended */
    strengthsPrefix: string;
    /** `{daysDiff}` */
    fasterThanCity: string;
    /** `{count}` */
    hotClosing: string;
    /** `{days}` */
    warmClosing: string;
    coldClosing: string;
  };
};

const territoryAnalysisStringsIt: TerritoryAnalysisStrings = {
  categoryNames: {
    education: 'istruzione',
    transport: 'trasporti',
    green: 'verde',
    business: 'business',
    security: 'sicurezza',
  },
  categoryLabels: {
    education: 'Istruzione',
    transport: 'Trasporti',
    green: 'Verde',
    business: 'Business',
    security: 'Sicurezza',
  },
  demandDescriptions: {
    hot: 'Molto alta — domanda elevata, tempi di vendita spesso brevi',
    warm: 'Buona — domanda nella media di mercato',
    cold: 'Bassa — tempi di vendita più lunghi',
  },
  dna: {
    educationStrengthDesc: 'Presenza di scuole e università nelle vicinanze',
    educationWeaknessDesc: 'Poche scuole nelle immediate vicinanze',
    transportStrengthDesc: 'Ottimi collegamenti con mezzi pubblici',
    transportWeaknessDesc: 'Collegamenti pubblici limitati',
    greenStrengthDesc: 'Aree verdi e parchi nelle vicinanze',
    businessStrengthDesc: 'Alta densità commerciale e uffici',
    securityStrengthDesc: 'Zona residenziale tranquilla',
  },
  commercial: {
    coworkingActivity: 'Coworking',
    coworkingReason: 'Zona centrale con alta densità di professionisti',
    barActivity: 'Bar / caffetteria',
    barReason: 'Alta presenza di studenti e giovani',
    pharmacyActivity: 'Farmacia',
    pharmacyReason: 'Zona residenziale con esigenze di servizi sanitari',
    gapPharmacyCategory: 'Farmacie',
    gapPharmacyDesc: 'Possibile carenza di farmacie in zona — opportunità di mercato',
    gapFoodCategory: 'Food & beverage',
    gapFoodDesc: 'Forte domanda per ristoranti e bar in zona centrale',
  },
  marketAdvice: {
    hot: 'Zona con domanda molto elevata. Prezzi competitivi e tempi di esposizione spesso brevi ({days} giorni). Ottima per vendite rapide.',
    warm: 'Domanda nella media. Tempi di vendita tipici intorno a {days} giorni. Strategia: prezzo competitivo e presentazione curata.',
    cold: 'Domanda più debole, tempi di vendita più lunghi ({days} giorni). Strategia: prezzo mirato o migliorie per aumentare appeal.',
    strongDnaSuffix:
      ' Il quartiere mostra un profilo di quartiere solido ({count} punti di forza). Usali come leva in presentazione.',
  },
  pitch: {
    hotIntro:
      'Zona ad alta domanda: gli immobili qui si vendono in media in {days} giorni. ',
    warmIntro:
      'Zona con domanda nella media: tempi di vendita intorno a {days} giorni. ',
    coldIntro:
      'Zona con domanda più contenuta: tempi di vendita più lunghi ({days} giorni), con spazio per acquirenti più pazienti. ',
    strengthsPrefix: 'Il quartiere ha {count} punti di forza: ',
    fasterThanCity:
      'I tempi di vendita risultano di {daysDiff} giorni più rapidi rispetto alla media città — segnale di mercato dinamico. ',
    hotClosing:
      'Messaggio chiave: «Questa zona è tra le più richieste, con {count} vantaggi distintivi. Con tempi di vendita rapidi, è il momento di agire.»',
    warmClosing:
      'Pitch: «Zona in crescita con buone infrastrutture. Con il prezzo giusto e una presentazione efficace, si può puntare a chiudere in circa {days} giorni.»',
    coldClosing:
      'Per investitori: «Zona con potenziale da valorizzare. Prezzo competitivo e interventi mirati possono trasformare l’operazione in un’opportunità.»',
  },
};

const territoryAnalysisStringsEn: TerritoryAnalysisStrings = {
  categoryNames: {
    education: 'education',
    transport: 'transport',
    green: 'green space',
    business: 'business',
    security: 'safety',
  },
  categoryLabels: {
    education: 'Education',
    transport: 'Transport',
    green: 'Green space',
    business: 'Business',
    security: 'Safety',
  },
  demandDescriptions: {
    hot: 'Very high — strong demand, often shorter time on market',
    warm: 'Healthy — demand in line with the market average',
    cold: 'Lower — longer average time on market',
  },
  dna: {
    educationStrengthDesc: 'Schools and universities nearby',
    educationWeaknessDesc: 'Few schools in the immediate area',
    transportStrengthDesc: 'Strong public transport links',
    transportWeaknessDesc: 'Limited public transport options',
    greenStrengthDesc: 'Green areas and parks nearby',
    businessStrengthDesc: 'High retail and office density',
    securityStrengthDesc: 'Quiet residential area',
  },
  commercial: {
    coworkingActivity: 'Coworking',
    coworkingReason: 'Central area with high density of professionals',
    barActivity: 'Café / bar',
    barReason: 'Strong student and young-professional footfall',
    pharmacyActivity: 'Pharmacy',
    pharmacyReason: 'Residential area with demand for health services',
    gapPharmacyCategory: 'Pharmacies',
    gapPharmacyDesc: 'Possible undersupply of pharmacies — market opportunity',
    gapFoodCategory: 'Food & beverage',
    gapFoodDesc: 'Strong demand for restaurants and bars in the city centre',
  },
  marketAdvice: {
    hot: 'Very high demand zone. Competitive pricing and often short listing periods ({days} days). Great for fast sales.',
    warm: 'Solid demand. Typical selling times around {days} days. Strategy: competitive pricing and polished presentation.',
    cold: 'Softer demand, longer timelines ({days} days). Strategy: sharper pricing or upgrades to boost appeal.',
    strongDnaSuffix:
      ' The neighbourhood profile is strong ({count} strengths). Use them as selling points.',
  },
  pitch: {
    hotIntro: 'High-demand area: properties here sell in about {days} days on average. ',
    warmIntro: 'Balanced demand: selling times around {days} days. ',
    coldIntro:
      'Softer demand: longer selling times ({days} days), with room for patient buyers. ',
    strengthsPrefix: 'The area has {count} strengths: ',
    fasterThanCity:
      'Selling times are about {daysDiff} days faster than the city average — a sign of a dynamic market. ',
    hotClosing:
      'Key line: “This pocket is among the most sought-after, with {count} clear advantages. With fast sales cycles, timing matters.”',
    warmClosing:
      'Pitch: “A growing area with solid infrastructure. With the right price and presentation, you can aim to close in about {days} days.”',
    coldClosing:
      'For investors: “There is upside to unlock. Competitive pricing and targeted improvements can turn this into a strong play.”',
  },
};

const territoryAnalysisStringsEs: TerritoryAnalysisStrings = {
  categoryNames: {
    education: 'educación',
    transport: 'transporte',
    green: 'zonas verdes',
    business: 'negocios',
    security: 'seguridad',
  },
  categoryLabels: {
    education: 'Educación',
    transport: 'Transporte',
    green: 'Zonas verdes',
    business: 'Negocios',
    security: 'Seguridad',
  },
  demandDescriptions: {
    hot: 'Muy alta — fuerte demanda, tiempos de venta a menudo cortos',
    warm: 'Buena — demanda en la media del mercado',
    cold: 'Baja — tiempos de venta más largos',
  },
  dna: {
    educationStrengthDesc: 'Colegios y universidades cercanos',
    educationWeaknessDesc: 'Pocos colegios en las inmediaciones',
    transportStrengthDesc: 'Buen transporte público',
    transportWeaknessDesc: 'Transporte público limitado',
    greenStrengthDesc: 'Zonas verdes y parques cercanos',
    businessStrengthDesc: 'Alta densidad comercial y de oficinas',
    securityStrengthDesc: 'Zona residencial tranquila',
  },
  commercial: {
    coworkingActivity: 'Coworking',
    coworkingReason: 'Zona céntrica con muchos profesionales',
    barActivity: 'Café / bar',
    barReason: 'Alta presencia de estudiantes y jóvenes',
    pharmacyActivity: 'Farmacia',
    pharmacyReason: 'Zona residencial con demanda de servicios de salud',
    gapPharmacyCategory: 'Farmacias',
    gapPharmacyDesc: 'Posible falta de farmacias — oportunidad de mercado',
    gapFoodCategory: 'Restauración',
    gapFoodDesc: 'Fuerte demanda de bares y restaurantes en el centro',
  },
  marketAdvice: {
    hot: 'Zona de demanda muy alta. Precios competitivos y exposición a menudo breve ({days} días). Ideal para ventas rápidas.',
    warm: 'Demanda sólida. Tiempos típicos de venta de unos {days} días. Estrategia: precio competitivo y buena presentación.',
    cold: 'Demanda más débil, plazas más largos ({days} días). Estrategia: precio ajustado o mejoras para ganar atractivo.',
    strongDnaSuffix:
      ' El barrio tiene un perfil sólido ({count} fortalezas). Úsalas como argumento.',
  },
  pitch: {
    hotIntro: 'Zona de alta demanda: las ventas rondan {days} días de media. ',
    warmIntro: 'Demanda equilibrada: tiempos de unos {days} días. ',
    coldIntro:
      'Demanda más suave: tiempos más largos ({days} días), con margen para compradores pacientes. ',
    strengthsPrefix: 'La zona tiene {count} fortalezas: ',
    fasterThanCity:
      'Los tiempos de venta son unos {daysDiff} días más rápidos que la media ciudad. ',
    hotClosing:
      'Mensaje: «Esta zona está muy solicitada, con {count} ventajas claras. Con ciclos rápidos, el momento importa.»',
    warmClosing:
      'Pitch: «Barrio en crecimiento con buena infraestructura. Con precio y presentación adecuados, se puede cerrar en unos {days} días.»',
    coldClosing:
      'Para inversores: «Hay potencial por explotar. Precio competitivo y mejoras focalizadas pueden convertirlo en una buena operación.»',
  },
};

const territoryAnalysisStringsFr: TerritoryAnalysisStrings = {
  categoryNames: {
    education: 'éducation',
    transport: 'transports',
    green: 'espaces verts',
    business: 'commerce',
    security: 'sécurité',
  },
  categoryLabels: {
    education: 'Éducation',
    transport: 'Transports',
    green: 'Espaces verts',
    business: 'Commerce',
    security: 'Sécurité',
  },
  demandDescriptions: {
    hot: 'Très forte — forte demande, délais souvent courts',
    warm: 'Bonne — demande dans la moyenne du marché',
    cold: 'Faible — délais de vente plus longs',
  },
  dna: {
    educationStrengthDesc: 'Écoles et universités à proximité',
    educationWeaknessDesc: 'Peu d’écoles à proximité immédiate',
    transportStrengthDesc: 'Bonnes liaisons transports en commun',
    transportWeaknessDesc: 'Transports en commun limités',
    greenStrengthDesc: 'Espaces verts et parcs à proximité',
    businessStrengthDesc: 'Forte densité commerciale et de bureaux',
    securityStrengthDesc: 'Quartier résidentiel calme',
  },
  commercial: {
    coworkingActivity: 'Coworking',
    coworkingReason: 'Zone centrale avec forte densité de professionnels',
    barActivity: 'Café / bar',
    barReason: 'Forte présence d’étudiants et de jeunes actifs',
    pharmacyActivity: 'Pharmacie',
    pharmacyReason: 'Zone résidentielle avec besoin de services de santé',
    gapPharmacyCategory: 'Pharmacies',
    gapPharmacyDesc: 'Sous-représentation possible — opportunité de marché',
    gapFoodCategory: 'Restauration',
    gapFoodDesc: 'Forte demande pour bars et restaurants en centre-ville',
  },
  marketAdvice: {
    hot: 'Zone à très forte demande. Prix compétitifs et mise en marché souvent courte ({days} jours). Idéal pour des ventes rapides.',
    warm: 'Demande solide. Délais typiques autour de {days} jours. Stratégie : prix compétitif et mise en valeur soignée.',
    cold: 'Demande plus faible, délais plus longs ({days} jours). Stratégie : prix affûté ou travaux pour renforcer l’attrait.',
    strongDnaSuffix:
      ' Le quartier affiche un profil solide ({count} atouts). Exploitez-les en argumentaire.',
  },
  pitch: {
    hotIntro: 'Forte demande : les biens se vendent en moyenne en {days} jours. ',
    warmIntro: 'Demande équilibrée : délais d’environ {days} jours. ',
    coldIntro:
      'Demande plus molle : délais plus longs ({days} jours), avec de la marge pour des acheteurs patients. ',
    strengthsPrefix: 'Le quartier compte {count} atouts : ',
    fasterThanCity:
      'Les délais sont d’environ {daysDiff} jours plus rapides que la moyenne ville. ',
    hotClosing:
      'Message clé : « Ce quartier est très recherché, avec {count} avantages nets. Avec des cycles rapides, le timing compte. »',
    warmClosing:
      'Pitch : « Quartier en progression avec bonnes infrastructures. Au bon prix et avec une bonne présentation, viser une vente en ~{days} jours. »',
    coldClosing:
      'Pour investisseurs : « Potentiel à débloquer. Prix compétitif et améliorations ciblées peuvent créer une belle opportunité. »',
  },
};

const territoryAnalysisStringsDe: TerritoryAnalysisStrings = {
  categoryNames: {
    education: 'Bildung',
    transport: 'Verkehr',
    green: 'Grünflächen',
    business: 'Gewerbe',
    security: 'Sicherheit',
  },
  categoryLabels: {
    education: 'Bildung',
    transport: 'Verkehr',
    green: 'Grünflächen',
    business: 'Gewerbe',
    security: 'Sicherheit',
  },
  demandDescriptions: {
    hot: 'Sehr hoch — starke Nachfrage, oft kurze Verkaufszeiten',
    warm: 'Gut — Nachfrage im Marktdurchschnitt',
    cold: 'Niedriger — längere Verkaufszeiten',
  },
  dna: {
    educationStrengthDesc: 'Schulen und Universitäten in der Nähe',
    educationWeaknessDesc: 'Wenige Schulen in unmittelbarer Nähe',
    transportStrengthDesc: 'Gute ÖPNV-Anbindung',
    transportWeaknessDesc: 'ÖPNV eingeschränkt',
    greenStrengthDesc: 'Grünflächen und Parks in der Nähe',
    businessStrengthDesc: 'Hohe Gewerbe- und Bürodichte',
    securityStrengthDesc: 'Ruhiges Wohngebiet',
  },
  commercial: {
    coworkingActivity: 'Coworking',
    coworkingReason: 'Zentrale Lage mit vielen Berufstätigen',
    barActivity: 'Café / Bar',
    barReason: 'Viele Studierende und junge Menschen',
    pharmacyActivity: 'Apotheke',
    pharmacyReason: 'Wohngebiet mit Bedarf an Gesundheitsangeboten',
    gapPharmacyCategory: 'Apotheken',
    gapPharmacyDesc: 'Mögliche Unterversorgung — Marktchance',
    gapFoodCategory: 'Gastronomie',
    gapFoodDesc: 'Hohe Nachfrage nach Restaurants und Bars in der Innenstadt',
  },
  marketAdvice: {
    hot: 'Sehr nachgefragte Lage. Wettbewerbsfähige Preise, oft kurze Marktzeiten ({days} Tage). Gut für schnelle Verkäufe.',
    warm: 'Solide Nachfrage. Typische Verkaufszeiten um {days} Tage. Strategie: fairer Preis und gute Präsentation.',
    cold: 'Schwächere Nachfrage, längere Zeiten ({days} Tage). Strategie: schärferer Preis oder Aufwertung für mehr Appeal.',
    strongDnaSuffix:
      ' Das Quartier wirkt stark ({count} Stärken). Nutzen Sie diese als Argumente.',
  },
  pitch: {
    hotIntro: 'Hohe Nachfrage: Objekte verkaufen sich hier in ~{days} Tagen. ',
    warmIntro: 'Ausgewogene Nachfrage: Zeiten um {days} Tage. ',
    coldIntro:
      'Weichere Nachfrage: längere Zeiten ({days} Tage), Spielraum für geduldige Käufer. ',
    strengthsPrefix: 'Das Quartier hat {count} Stärken: ',
    fasterThanCity:
      'Die Verkaufszeiten liegen etwa {daysDiff} Tage unter dem Stadt-Durchschnitt. ',
    hotClosing:
      'Kernbotschaft: „Diese Lage ist stark nachgefragt, mit {count} klaren Pluspunkten. Bei schnellen Zyklen zählt das Timing.“',
    warmClosing:
      'Pitch: „Wachsendes Quartier mit guter Infrastruktur. Mit richtigem Preis und Auftritt sind ~{days} Tage realistisch.“',
    coldClosing:
      'Für Investoren: „Potenzial zum Heben. Wettbewerbspreis und gezielte Verbesserungen können daraus eine Chance machen.“',
  },
};

const territoryAnalysisStringsPt: TerritoryAnalysisStrings = {
  categoryNames: {
    education: 'educação',
    transport: 'transportes',
    green: 'espaços verdes',
    business: 'negócios',
    security: 'segurança',
  },
  categoryLabels: {
    education: 'Educação',
    transport: 'Transportes',
    green: 'Espaços verdes',
    business: 'Negócios',
    security: 'Segurança',
  },
  demandDescriptions: {
    hot: 'Muito alta — forte procura, prazos de venda frequentemente curtos',
    warm: 'Boa — procura na média do mercado',
    cold: 'Mais baixa — prazos de venda mais longos',
  },
  dna: {
    educationStrengthDesc: 'Escolas e universidades nas proximidades',
    educationWeaknessDesc: 'Poucas escolas na área imediata',
    transportStrengthDesc: 'Boa oferta de transportes públicos',
    transportWeaknessDesc: 'Transportes públicos limitados',
    greenStrengthDesc: 'Espaços verdes e parques próximos',
    businessStrengthDesc: 'Alta densidade comercial e de escritórios',
    securityStrengthDesc: 'Zona residencial tranquila',
  },
  commercial: {
    coworkingActivity: 'Coworking',
    coworkingReason: 'Zona central com muitos profissionais',
    barActivity: 'Café / bar',
    barReason: 'Forte presença de estudantes e jovens',
    pharmacyActivity: 'Farmácia',
    pharmacyReason: 'Zona residencial com necessidade de serviços de saúde',
    gapPharmacyCategory: 'Farmácias',
    gapPharmacyDesc: 'Possível falta de farmácias — oportunidade de mercado',
    gapFoodCategory: 'Restauração',
    gapFoodDesc: 'Forte procura por restaurantes e bares no centro',
  },
  marketAdvice: {
    hot: 'Zona de procura muito elevada. Preços competitivos e exposição frequentemente curta ({days} dias). Ideal para vendas rápidas.',
    warm: 'Procura sólida. Prazos típicos à volta de {days} dias. Estratégia: preço competitivo e boa apresentação.',
    cold: 'Procura mais fraca, prazos mais longos ({days} dias). Estratégia: preço mais agressivo ou melhorias para aumentar apelo.',
    strongDnaSuffix:
      ' O bairro tem um perfil forte ({count} pontos fortes). Use-os como argumento.',
  },
  pitch: {
    hotIntro: 'Alta procura: as vendas rondam {days} dias em média. ',
    warmIntro: 'Procura equilibrada: prazos de cerca de {days} dias. ',
    coldIntro:
      'Procura mais suave: prazos mais longos ({days} dias), com margem para compradores pacientes. ',
    strengthsPrefix: 'A zona tem {count} pontos fortes: ',
    fasterThanCity:
      'Os prazos são cerca de {daysDiff} dias mais rápidos do que a média da cidade. ',
    hotClosing:
      'Mensagem-chave: «Esta zona é muito procurada, com {count} vantagens claras. Com ciclos rápidos, o timing importa.»',
    warmClosing:
      'Pitch: «Bairro em crescimento com boa infraestrutura. Com preço e apresentação certos, pode fechar em ~{days} dias.»',
    coldClosing:
      'Para investidores: «Há potencial por explorar. Preço competitivo e melhorias focadas podem criar uma boa oportunidade.»',
  },
};

const territoryAnalysisStringsAr: TerritoryAnalysisStrings = {
  categoryNames: {
    education: 'التعليم',
    transport: 'النقل',
    green: 'المساحات الخضراء',
    business: 'الأعمال',
    security: 'الأمان',
  },
  categoryLabels: {
    education: 'التعليم',
    transport: 'النقل',
    green: 'المساحات الخضراء',
    business: 'الأعمال',
    security: 'الأمان',
  },
  demandDescriptions: {
    hot: 'مرتفع جداً — طلب قوي وأزمنة بيع غالباً أقصر',
    warm: 'جيد — الطلب ضمن متوسط السوق',
    cold: 'أقل — أزمنة بيع أطول',
  },
  dna: {
    educationStrengthDesc: 'مدارس وجامعات قريبة',
    educationWeaknessDesc: 'قليل من المدارس في الجوار المباشر',
    transportStrengthDesc: 'روابط نقل عام جيدة',
    transportWeaknessDesc: 'خيارات نقل عام محدودة',
    greenStrengthDesc: 'مساحات خضراء وحدائق قريبة',
    businessStrengthDesc: 'كثافة تجارية ومكتبية عالية',
    securityStrengthDesc: 'منطقة سكنية هادئة',
  },
  commercial: {
    coworkingActivity: 'مساحات عمل مشتركة',
    coworkingReason: 'منطقة مركزية بكثافة مهنيين عالية',
    barActivity: 'مقهى / بار',
    barReason: 'حضور قوي للطلاب والشباب',
    pharmacyActivity: 'صيدلية',
    pharmacyReason: 'منطقة سكنية بحاجة لخدمات صحية',
    gapPharmacyCategory: 'صيدليات',
    gapPharmacyDesc: 'احتمال نقص في الصيدليات — فرصة سوقية',
    gapFoodCategory: 'مطاعم ومقاهي',
    gapFoodDesc: 'طلب قوي على المطاعم والمقاهي في وسط المدينة',
  },
  marketAdvice: {
    hot: 'منطقة طلب مرتفع جداً. أسعار تنافسية وفترات عرض غالباً قصيرة ({days} يوماً). ممتاز للبيع السريع.',
    warm: 'طلب جيد. أزمنة بيع نموذجية حوالي {days} يوماً. الاستراتيجية: سعر تنافسي وعرض احترافي.',
    cold: 'طلب أضعف وأزمنة أطول ({days} يوماً). الاستراتيجية: تسعير أدق أو تحسينات لزيادة الجاذبية.',
    strongDnaSuffix:
      ' الحي يظهر ملفاً قوياً ({count} نقاط قوة). استخدمها في العرض.',
  },
  pitch: {
    hotIntro: 'طلب مرتفع: تُباع العقارات هنا في المتوسط خلال {days} يوماً. ',
    warmIntro: 'طلب متوازن: أزمنة حوالي {days} يوماً. ',
    coldIntro:
      'طلب أخف: أزمنة أطول ({days} يوماً)، مع مجال للمشترين الأكثر صبراً. ',
    strengthsPrefix: 'المنطقة تضم {count} نقاط قوة: ',
    fasterThanCity:
      'أزمنة البيع أسرع بحوالي {daysDiff} يوماً من متوسط المدينة. ',
    hotClosing:
      'رسالة رئيسية: «هذه المنطقة من الأكثر طلباً، مع {count} مزايا واضحة. مع دورات بيع سريعة، يهم التوقيت.»',
    warmClosing:
      'عرض: «حي نامٍ وبنية تحتية جيدة. بالسعر والتقديم المناسبين يمكن الإغلاق خلال نحو {days} يوماً.»',
    coldClosing:
      'للمستثمرين: «هناك إمكانات للاستثمار. تسعير تنافسي وتحسينات مستهدفة يمكن أن تخلق فرصة قوية.»',
  },
};

const BY_LOCALE: Record<Locale, TerritoryAnalysisStrings> = {
  it: territoryAnalysisStringsIt,
  en: territoryAnalysisStringsEn,
  es: territoryAnalysisStringsEs,
  fr: territoryAnalysisStringsFr,
  de: territoryAnalysisStringsDe,
  pt: territoryAnalysisStringsPt,
  ar: territoryAnalysisStringsAr,
};

export function getTerritoryAnalysisStrings(locale: Locale): TerritoryAnalysisStrings {
  return BY_LOCALE[locale] ?? BY_LOCALE.en;
}
