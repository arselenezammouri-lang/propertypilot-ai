/**
 * ES–AR markdown for getting-started articles (IT/EN in doc-content.ts).
 */

import type { DocArticleMultilingual } from '@/lib/docs/doc-article';

type ExtraLocales = Pick<DocArticleMultilingual, 'es' | 'fr' | 'de' | 'pt' | 'ar'>;

export const docFirstListingLocales: ExtraLocales = {
  es: {
    title: 'Crea tu primer anuncio',
    content: `
# Crea tu primer anuncio

En pocos minutos puedes pasar de **datos en bruto** a copy listo para los portales.

## Recorrido recomendado

1. **Generar anuncio** (\`/dashboard/listings\`) — flujo guiado para crear y guardar.
2. **Perfect Copy** — si quieres **5 variantes** (profesional, emocional, corto, SEO, luxury) desde un formulario estructurado.
3. **Biblioteca** — guarda la mejor variante y ábrela cuando publiques en Idealista, Immobiliare, MLS, etc.

## Consejo

Completa **zona**, **superficie**, **comprador objetivo** y **puntos fuertes**: el resultado será más creíble y adaptado a tu mercado.
    `,
  },
  fr: {
    title: 'Créez votre première annonce',
    content: `
# Créez votre première annonce

En quelques minutes, passez des **données brutes** à une annonce prête pour les portails.

## Parcours recommandé

1. **Générer une annonce** (\`/dashboard/listings\`) — parcours guidé pour créer et enregistrer.
2. **Perfect Copy** — si vous voulez **cinq variantes** (professionnel, émotionnel, court, SEO, luxe) via un formulaire structuré.
3. **Bibliothèque** — enregistrez la meilleure variante et rouvrez-la lors de la publication sur Idealista, Immobiliare, MLS, etc.

## Astuce

Renseignez **zone**, **surface**, **cible acheteur** et **points forts** pour un rendu plus crédible et adapté à votre marché.
    `,
  },
  de: {
    title: 'Erstellen Sie Ihr erstes Inserat',
    content: `
# Erstellen Sie Ihr erstes Inserat

In wenigen Minuten von **Rohdaten** zu portalreifem Text.

## Empfohlener Ablauf

1. **Inserat generieren** (\`/dashboard/listings\`) — geführter Ablauf zum Erstellen und Speichern.
2. **Perfect Copy** — wenn Sie **fünf Varianten** (professionell, emotional, kurz, SEO, Luxury) aus einem strukturierten Formular wollen.
3. **Bibliothek** — beste Variante speichern und beim Veröffentlichen auf Zillow, Idealista, MLS usw. wieder öffnen.

## Tipp

Geben Sie **Lage**, **Fläche**, **Zielkäufer** und **Stärken** an — die Ausgabe wird glaubwürdiger und marktgerechter.
    `,
  },
  pt: {
    title: 'Crie o seu primeiro anúncio',
    content: `
# Crie o seu primeiro anúncio

Em poucos minutos passa de **dados em bruto** a texto pronto para os portais.

## Percurso recomendado

1. **Gerar anúncio** (\`/dashboard/listings\`) — fluxo guiado para criar e guardar.
2. **Perfect Copy** — se quiser **5 variantes** (profissional, emocional, curto, SEO, luxury) a partir de um formulário estruturado.
3. **Biblioteca** — guarde a melhor variante e reabra ao publicar no Idealista, Immobiliare, MLS, etc.

## Dica

Preencha **zona**, **área**, **comprador-alvo** e **pontos fortes**: o resultado fica mais credível para o seu mercado.
    `,
  },
  ar: {
    title: 'أنشئ إعلانك الأول',
    content: `
# أنشئ إعلانك الأول

خلال دقائق انتقل من **البيانات الخام** إلى نص جاهز للبوابات.

## المسار الموصى به

1. **إنشاء إعلان** (\`/dashboard/listings\`) — مسار موجّه للإنشاء والحفظ.
2. **Perfect Copy** — إذا أردت **خمس نسخ** (احترافي، عاطفي، قصير، SEO، فاخر) من نموذج منظم.
3. **المكتبة** — احفظ أفضل نسخة وأعد فتحها عند النشر على Idealista أو Immobiliare أو MLS وغيرها.

## نصيحة

املأ **المنطقة** و**المساحة** و**المشتري المستهدف** و**نقاط القوة** ليكون الناتج أوثق وأنسب لسوقك.
    `,
  },
};

export const docWorkspaceSetupLocales: ExtraLocales = {
  es: {
    title: 'Configura tu espacio de trabajo',
    content: `
# Configura tu espacio de trabajo

En **Configuración del espacio de trabajo** activa solo lo que usas cada día: menos ruido, más velocidad.

## Qué hacer

1. Abre \`/dashboard/settings/workspace\`.
2. Activa los **módulos** que encajan con tu plan (CRM, voz, mapa, automatizaciones…).
3. Revisa **idioma y región** en la cabecera para copy y formatos coherentes.

## Por qué importa

Un espacio ordenado evita confusiones (p. ej. herramientas PRO innecesarias) y alinea al equipo en las mismas funciones.
    `,
  },
  fr: {
    title: 'Configurez votre espace de travail',
    content: `
# Configurez votre espace de travail

Dans **Paramètres de l’espace de travail**, activez uniquement ce que vous utilisez au quotidien : moins de bruit, plus de rapidité.

## Étapes

1. Ouvrez \`/dashboard/settings/workspace\`.
2. Activez les **modules** adaptés à votre forfait (CRM, voix, carte, automatisations…).
3. Vérifiez **langue et région** dans l’en-tête pour des textes et formats cohérents.

## Pourquoi c’est important

Un espace clair limite les erreurs (ex. outils PRO inutiles) et aligne l’équipe sur les mêmes fonctionnalités.
    `,
  },
  de: {
    title: 'Workspace einrichten',
    content: `
# Workspace einrichten

Unter **Workspace-Einstellungen** nur aktivieren, was Sie täglich nutzen: weniger Ablenkung, schneller arbeiten.

## Schritte

1. Öffnen Sie \`/dashboard/settings/workspace\`.
2. Schalten Sie **Module** ein, die zu Ihrem Tarif passen (CRM, Sprache, Karte, Automatisierungen …).
3. Prüfen Sie **Sprache und Region** in der Kopfzeile für konsistente Texte und Formate.

## Warum wichtig

Ein aufgeräumter Workspace vermeidet Verwirrung (z. B. nicht benötigte PRO-Tools) und hält Teams auf denselben Features ausgerichtet.
    `,
  },
  pt: {
    title: 'Configure o seu espaço de trabalho',
    content: `
# Configure o seu espaço de trabalho

Em **Definições do espaço de trabalho**, ative apenas o que usa todos os dias: menos ruído, mais rapidez.

## Passos

1. Abra \`/dashboard/settings/workspace\`.
2. Ative os **módulos** adequados ao seu plano (CRM, voz, mapa, automatizações…).
3. Confirme **idioma e região** no cabeçalho para textos e formatos consistentes.

## Porquê importa

Um espaço organizado evita confusão (ex.: ferramentas PRO desnecessárias) e alinha a equipa nas mesmas funcionalidades.
    `,
  },
  ar: {
    title: 'إعداد مساحة العمل',
    content: `
# إعداد مساحة العمل

في **إعدادات مساحة العمل**، فعّل فقط ما تستخدمه يومياً: أقل تشويشاً وأسرع في العمل.

## الخطوات

1. افتح \`/dashboard/settings/workspace\`.
2. شغّل **الوحدات** المناسبة لخطتك (CRM، الصوت، الخريطة، الأتمتة…).
3. راجع **اللغة والمنطقة** من الرأس لضمان نصوص وتنسيقات متسقة.

## لماذا يهم ذلك

مساحة عمل مرتبة تقلل الأخطاء (مثل أدوات PRO غير لازمة) وتوحّد الفريق على نفس الميزات.
    `,
  },
};
