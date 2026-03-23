/** Full markdown for `getting-started/welcome` — ES/FR/DE/PT/AR (IT/EN remain in doc-content.ts) */

import type { DocArticleMultilingual } from '@/lib/docs/doc-article';

export const docWelcomeLocales: Pick<
  DocArticleMultilingual,
  'es' | 'fr' | 'de' | 'pt' | 'ar'
> = {
  es: {
    title: 'Bienvenido a PropertyPilot AI',
    content: `
# Bienvenido a PropertyPilot AI

PropertyPilot AI es la plataforma para agentes inmobiliarios que quieren escalar con IA: anuncios, leads, prospección y automatización en un solo espacio de trabajo.

## Qué puedes hacer

- **Scraping y análisis**: encuentra y analiza anuncios en los principales portales
- **Copy y anuncios**: genera variantes profesionales (Perfect Copy, títulos, traducciones)
- **CRM y pipeline**: sigue los leads desde el primer contacto hasta el cierre
- **Voz y territorio**: herramientas avanzadas en los planes Pro/Agency

## Próximos pasos

1. Genera tu primer anuncio (Perfect Copy u otras herramientas de contenido)
2. Guárdalo en la biblioteca y configura la pipeline de leads
3. Revisa tu plan y la facturación desde el panel
    `,
  },
  fr: {
    title: 'Bienvenue sur PropertyPilot AI',
    content: `
# Bienvenue sur PropertyPilot AI

PropertyPilot AI est la plateforme des agents immobiliers qui veulent scaler avec l’IA : annonces, leads, prospection et automatisation dans un seul espace de travail.

## Ce que vous pouvez faire

- **Scraping et analyse** : trouver et analyser les annonces sur les grands portails
- **Copy et annonces** : générer des variantes pro (Perfect Copy, titres, traductions)
- **CRM et pipeline** : suivre les leads du premier contact à la signature
- **Voix et territoire** : outils avancés sur les offres Pro/Agency

## Prochaines étapes

1. Générez votre première annonce (Perfect Copy ou outils contenu)
2. Enregistrez-la en bibliothèque et configurez la pipeline leads
3. Vérifiez votre forfait et la facturation depuis le tableau de bord
    `,
  },
  de: {
    title: 'Willkommen bei PropertyPilot AI',
    content: `
# Willkommen bei PropertyPilot AI

PropertyPilot AI ist die Plattform für Immobilienmakler, die mit KI skalieren wollen: Inserate, Leads, Akquise und Automatisierung in einem Workspace.

## Was Sie können

- **Scraping & Analyse**: Inserate auf den großen Portalen finden und auswerten
- **Copy & Inserate**: professionelle Varianten erzeugen (Perfect Copy, Überschriften, Übersetzungen)
- **CRM & Pipeline**: Leads vom ersten Kontakt bis zum Abschluss verfolgen
- **Voice & Territorium**: erweiterte Tools in den Pro-/Agency-Tarifen

## Nächste Schritte

1. Erstellen Sie Ihr erstes Inserat (Perfect Copy oder Content-Tools)
2. In der Bibliothek speichern und die Lead-Pipeline einrichten
3. Plan und Abrechnung im Dashboard prüfen
    `,
  },
  pt: {
    title: 'Bem-vindo ao PropertyPilot AI',
    content: `
# Bem-vindo ao PropertyPilot AI

O PropertyPilot AI é a plataforma para agentes imobiliários que querem escalar com IA: anúncios, leads, prospeção e automação num único espaço de trabalho.

## O que pode fazer

- **Scraping e análise**: encontrar e analisar anúncios nos principais portais
- **Copy e anúncios**: gerar variantes profissionais (Perfect Copy, títulos, traduções)
- **CRM e pipeline**: acompanhar leads do primeiro contacto ao fecho
- **Voz e território**: ferramentas avançadas nos planos Pro/Agency

## Próximos passos

1. Gere o seu primeiro anúncio (Perfect Copy ou ferramentas de conteúdo)
2. Guarde na biblioteca e configure a pipeline de leads
3. Revise o plano e a faturação no painel
    `,
  },
  ar: {
    title: 'مرحباً بك في PropertyPilot AI',
    content: `
# مرحباً بك في PropertyPilot AI

PropertyPilot AI منصة لوسطاء العقارات الذين يريدون النمو بالذكاء الاصطناعي: الإعلانات والعملاء المحتملين والتسويق والأتمتة في مساحة عمل واحدة.

## ماذا يمكنك أن تفعل

- **جمع البيانات والتحليل**: العثور على الإعلانات وتحليلها عبر المنصات الكبرى
- **النصوص والإعلانات**: توليد نسخ احترافية (Perfect Copy، عناوين، ترجمات)
- **CRM ومسار العمل**: تتبع العملاء من أول اتصال حتى الإغلاق
- **الصوت والإقليم**: أدوات متقدمة في خطط Pro وAgency

## الخطوات التالية

1. أنشئ إعلانك الأول (Perfect Copy أو أدوات المحتوى)
2. احفظه في المكتبة واضبط مسار العملاء المحتملين
3. راجع خطتك والفوترة من لوحة التحكم
    `,
  },
};
