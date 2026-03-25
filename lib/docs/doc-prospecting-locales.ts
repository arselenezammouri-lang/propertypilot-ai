/**
 * ES–AR for prospecting docs (IT/EN in doc-content.ts).
 */

import type { DocArticleMultilingual } from '@/lib/docs/doc-article';

type ExtraLocales = Pick<DocArticleMultilingual, 'es' | 'fr' | 'de' | 'pt' | 'ar'>;

export const docScraperGuideLocales: ExtraLocales = {
  es: {
    title: 'Guía del Scraper global',
    content: `
# Guía del Scraper global

El scraper reúne anuncios de **Idealista**, **Zillow**, **Immobiliare.it** y otros portales para que analices oportunidades en un solo flujo.

## Qué puedes hacer

- **Buscar por zona o URL**: parte de una ciudad, barrio o enlace de listado.
- **Filtrar resultados**: precio, superficie, tipo de operación y criterios que uses en tu mercado.
- **Enriquecer datos**: abre el detalle para ver fotos, historial y señales de mercado cuando la función esté disponible.

## Buenas prácticas

1. Define primero **mercado y presupuesto** del cliente para no saturar la bandeja.
2. Guarda búsquadas recurrentes como **filtros** (ver guía de filtros) para alertas coherentes.
3. Cruza con **Market Gap** y **Arbitrage** cuando quieras priorizar descuentos frente a la media.

## Privacidad y uso

Usa el scraper de forma conforme a los **términos de cada portal** y a la normativa local (protección de datos, outreach comercial).
    `,
  },
  fr: {
    title: 'Guide du scraper global',
    content: `
# Guide du scraper global

Le scraper agrège des annonces depuis **Idealista**, **Zillow**, **Immobiliare.it** et d’autres portails pour analyser les opportunités au même endroit.

## Fonctions

- **Recherche par zone ou URL** : ville, quartier ou lien d’annonce.
- **Filtrage** : prix, surface, type de transaction selon votre marché.
- **Enrichissement** : détail, photos, historique et signaux marché lorsque disponible.

## Bonnes pratiques

1. Cadrer **marché et budget** client avant de lancer de gros volumes.
2. Enregistrer des recherches en **filtres** (voir guide filtres) pour des alertes utiles.
3. Croiser avec **Market Gap** / arbitrage pour prioriser les annonces sous le marché.

## Conformité

Respectez les **conditions d’utilisation** de chaque portail et le cadre local (RGPD, prospection).
    `,
  },
  de: {
    title: 'Global Scraper — Anleitung',
    content: `
# Global Scraper — Anleitung

Der Scraper bündelt Inserate von **Idealista**, **Zillow**, **Immobiliare.it** und weiteren Portalen für Ihre Analyse.

## Möglichkeiten

- **Suche nach Gebiet oder URL**: Stadt, Stadtteil oder Inseratslink.
- **Filter**: Preis, Fläche, Transaktionstyp passend zu Ihrem Markt.
- **Anreicherung**: Detailansicht, Fotos, Verlauf und Marktsignale (wenn verfügbar).

## Best Practices

1. **Markt und Budget** des Kunden vorab klären, um Rauschen zu vermeiden.
2. Wiederkehrende Suchen als **Filter** speichern (siehe Filter-Guide) für sinnvolle Alerts.
3. Mit **Market Gap** / Arbitrage kombinieren, um unter Markt liegende Preise zu priorisieren.

## Compliance

Nutzung im Einklang mit den **AGB der Portale** und lokalem Recht (Datenschutz, Akquise).
    `,
  },
  pt: {
    title: 'Guia do Scraper global',
    content: `
# Guia do Scraper global

O scraper agrega anúncios de **Idealista**, **Zillow**, **Immobiliare.it** e outros portais para analisar oportunidades num fluxo único.

## O que pode fazer

- **Pesquisar por zona ou URL**: cidade, bairro ou link do anúncio.
- **Filtrar**: preço, área, tipo de operação alinhado ao seu mercado.
- **Enriquecer**: detalhe, fotos, histórico e sinais de mercado quando disponível.

## Boas práticas

1. Defina **mercado e orçamento** do cliente antes de grandes volumes.
2. Guarde pesquisas recorrentes em **filtros** (ver guia de filtros) para alertas úteis.
3. Cruze com **Market Gap** / arbitragem para priorizar preços abaixo da média.

## Conformidade

Respeite os **termos de cada portal** e a legislação local (dados, prospeção).
    `,
  },
  ar: {
    title: 'دليل المجمع العالمي',
    content: `
# دليل المجمع العالمي

يجمع المجمع الإعلانات من **Idealista** و**Zillow** و**Immobiliare.it** وغيرها لتحليل الفرص في مسار واحد.

## ما يمكنك فعله

- **البحث حسب المنطقة أو الرابط**: مدينة، حي أو رابط إعلان.
- **التصفية**: السعر، المساحة، نوع العملية حسب سوقك.
- **الإثراء**: التفاصيل والصور والسجل وإشارات السوق عند توفرها.

## أفضل الممارسات

1. حدّد **السوق وميزانية** العميل قبل تشغيل حجم كبير.
2. احفظ عمليات البحث المتكررة كـ **مرشحات** (انظر دليل المرشحات) لتنبيهات مفيدة.
3. ادمج مع **Market Gap** / المراجحة لترتيب الأولويات دون متوسط السوق.

## الامتثال

التزم **شروط كل بوابة** والقوانين المحلية (البيانات، التسويق).
    `,
  },
};

export const docProspectingFiltersLocales: ExtraLocales = {
  es: {
    title: 'Filtros de búsqueda avanzados',
    content: `
# Filtros de búsqueda avanzados

Los filtros guardan tus criterios (precio, zona, tipo de inmueble, Market Gap, etc.) para que el motor de prospección te muestre solo lo relevante.

## Cómo usarlos

1. Abre **Prospecting** en el dashboard y ve a la sección de filtros o alertas (según tu plan).
2. **Crea un filtro**: nombre claro (ej. «Madrid 2 dorm / gap > 10%») y reglas concretas.
3. **Activa o pausa** filtros sin borrar el historial cuando cambie la campaña.

## Consejos

- Empieza con **pocos criterios** y afina; demasiadas reglas pueden ocultar oportunidades.
- Alinea filtros con **scripts de llamada** y **pipeline CRM** para un seguimiento homogéneo.
- Revisa periódicamente: los mercados cambian y los umbrales de precio deben actualizarse.

## API y equipo

Si tu plan lo permite, los mismos filtros pueden sincronizarse con **/api/prospecting/filters** para integraciones internas; no compartas claves fuera de tu organización.
    `,
  },
  fr: {
    title: 'Filtres de recherche avancés',
    content: `
# Filtres de recherche avancés

Les filtres enregistrent vos critères (prix, zone, type de bien, Market Gap, etc.) pour que la prospection ne montre que l’essentiel.

## Utilisation

1. Ouvrez **Prospecting** sur le tableau de bord, section filtres ou alertes selon l’offre.
2. **Créez un filtre** : nom explicite (ex. « Paris 3p / gap > 10 % ») et règles précises.
3. **Activez ou mettez en pause** sans supprimer l’historique quand la campagne change.

## Conseils

- Commencez avec **peu de critères** puis affinez ; trop de règles masquent des opportunités.
- Alignez les filtres sur les **scripts d’appel** et le **pipeline CRM**.
- Révisez régulièrement : marché et seuils évoluent.

## API et équipe

Si votre offre l’autorise, synchronisation possible avec **/api/prospecting/filters** ; ne partagez pas les clés hors de votre organisation.
    `,
  },
  de: {
    title: 'Erweiterte Suchfilter',
    content: `
# Erweiterte Suchfilter

Filter speichern Ihre Kriterien (Preis, Gebiet, Objekttyp, Market Gap usw.), damit die Prospecting-Ansicht fokussiert bleibt.

## Bedienung

1. **Prospecting** im Dashboard öffnen, Bereich Filter/Alerts je nach Tarif.
2. **Filter anlegen**: sprechender Name (z. B. « Berlin 3 Zi / Gap > 10 % ») und klare Regeln.
3. **Aktivieren oder pausieren** ohne Historie zu löschen, wenn Kampagnen wechseln.

## Tipps

- Mit **wenigen Kriterien** starten und verfeinern; zu viele Regeln verstecken Chancen.
- Filter mit **Anrufskripten** und **CRM-Pipeline** abstimmen.
- Regelmäßig prüfen: Märkte und Schwellen ändern sich.

## API & Team

Bei passendem Tarif Abgleich mit **/api/prospecting/filters** möglich; Keys nicht außerhalb der Organisation teilen.
    `,
  },
  pt: {
    title: 'Filtros de pesquisa avançados',
    content: `
# Filtros de pesquisa avançados

Os filtros guardam os seus critérios (preço, zona, tipo de imóvel, Market Gap, etc.) para o motor de prospeção mostrar só o relevante.

## Como usar

1. Abra **Prospecting** no painel, secção de filtros ou alertas conforme o plano.
2. **Crie um filtro**: nome claro (ex. « Lisboa T2 / gap > 10 % ») e regras objetivas.
3. **Ative ou pause** sem apagar o histórico quando a campanha mudar.

## Dicas

- Comece com **poucos critérios** e afinar; regras a mais escondem oportunidades.
- Alinhe com **guiões de chamada** e **pipeline CRM**.
- Revise com periodicidade: mercados e limiares mudam.

## API e equipa

Se o plano permitir, sincronização com **/api/prospecting/filters**; não partilhe chaves fora da organização.
    `,
  },
  ar: {
    title: 'مرشحات بحث متقدمة',
    content: `
# مرشحات بحث متقدمة

تحفظ المرشحات معاييرك (السعر، المنطقة، نوع العقار، Market Gap، إلخ) ليعرض محرك التسويق ما يهمك فقط.

## طريقة الاستخدام

1. افتح **التسويق** في لوحة التحكم، قسم المرشحات أو التنبيهات حسب خطتك.
2. **أنشئ مرشحاً**: اسماً واضحاً (مثل «شقة 3 غرف / فجوة > 10٪») وقواعد محددة.
3. **فعّل أو أوقف** دون حذف السجل عند تغيير الحملة.

## نصائح

- ابدأ بـ**معايير قليلة** ثم ضيّق؛ كثرة القواعد تخفي الفرص.
- وائم المرشحات مع **نصوص الاتصال** و**مسار CRM**.
- راجع دورياً: الأسواق والعتبات تتغير.

## واجهة API والفريق

إن سمحت خطتك، يمكن المزامنة مع **/api/prospecting/filters**؛ لا تشارك المفاتيح خارج مؤسستك.
    `,
  },
};

export const docArbitrageExtraLocales: ExtraLocales = {
  es: {
    title: 'Guía de arbitraje',
    content: `
# Guía de arbitraje

El arbitraje inmobiliario consiste en detectar inmuebles ofertados **por debajo** del valor de mercado razonable.

## Cómo funciona

1. **Market Gap**: comparamos el precio del anuncio con la media de la zona.
2. **Oportunidad**: un gap superior a ~15% puede señalar un TOP DEAL.
3. **Estrategia**: usa el gap al hablar con el propietario (datos, no promesas vacías).

## Ejemplo

- Precio anuncio: 200.000 €
- Media zona: 250.000 €
- **Market Gap: -20%**
    `,
  },
  fr: {
    title: 'Guide arbitrage',
    content: `
# Guide arbitrage

L’arbitrage immobilier, c’est repérer des biens affichés **sous** une valeur de marché cohérente.

## Fonctionnement

1. **Market Gap** : comparaison prix affiché / moyenne locale.
2. **Opportunité** : un écart > ~15 % peut signaler une TOP DEAL.
3. **Jeu** : utilisez l’écart dans le dialogue propriétaire (faits, pas promesses vides).

## Exemple

- Prix affiché : 200 000 €
- Moyenne zone : 250 000 €
- **Market Gap : -20 %**
    `,
  },
  de: {
    title: 'Arbitrage-Leitfaden',
    content: `
# Arbitrage-Leitfaden

Immobilien-Arbitrage: Objekte finden, die **unter** einem plausiblen Marktwert angeboten werden.

## Ablauf

1. **Market Gap**: Angebotspreis vs. lokaler Durchschnitt.
2. **Chance**: Lücken > ~15 % können TOP-DEAL-Signale sein.
3. **Gespräch**: Gap sachlich gegenüber Eigentümern nutzen.

## Beispiel

- Angebotspreis: 200.000 €
- Zonendurchschnitt: 250.000 €
- **Market Gap: -20 %**
    `,
  },
  pt: {
    title: 'Guia de arbitragem',
    content: `
# Guia de arbitragem

Arbitragem imobiliária é identificar imóveis anunciados **abaixo** de um valor de mercado razoável.

## Como funciona

1. **Market Gap**: comparamos o preço do anúncio com a média da zona.
2. **Oportunidade**: gap acima de ~15% pode indicar TOP DEAL.
3. **Estratégia**: use o gap na conversa com o proprietário (dados, não promessas vazias).

## Exemplo

- Preço do anúncio: 200 000 €
- Média da zona: 250 000 €
- **Market Gap: -20%**
    `,
  },
  ar: {
    title: 'دليل المراجحة',
    content: `
# دليل المراجحة

المراجحة العقارية تعني العثور على عروض بسعر **أدنى** من قيمة السوق المعقولة.

## آلية العمل

1. **Market Gap**: مقارنة سعر الإعلان بمتوسط المنطقة.
2. **الفرصة**: فجوة أكبر من ~15٪ قد تشير إلى صفقة مميزة.
3. **الاستراتيجية**: استخدم الفجوة في الحديث مع المالك (بيانات لا وعوداً فارغة).

## مثال

- سعر الإعلان: 200٬000 €
- متوسط المنطقة: 250٬000 €
- **Market Gap: -20%**
    `,
  },
};
