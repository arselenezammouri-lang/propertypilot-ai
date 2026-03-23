/**
 * ES–AR for Aura VR doc (IT/EN in doc-content.ts).
 */

import type { DocArticleMultilingual } from '@/lib/docs/doc-article';

type ExtraLocales = Pick<DocArticleMultilingual, 'es' | 'fr' | 'de' | 'pt' | 'ar'>;

export const docAuraVrGuideLocales: ExtraLocales = {
  es: {
    title: 'Guía Aura VR',
    content: `
# Guía Aura VR

**Aura VR** genera una experiencia inmersiva (vistas 360 / tour) a partir de fotos del inmueble para compartir con propietarios o compradores en WhatsApp, email o presentaciones.

## Antes de generar

1. Sube **fotos amplias** de las estancias principales (salón, cocina, vistas clave).
2. Comprueba tu **plan**: la función puede estar limitada a Pro/Agency según configuración del producto.
3. Revisa **derechos de imagen** si usas fotos del vendedor o de terceros.

## Después de generar

- Prueba el enlace en **móvil y escritorio** antes de enviarlo al cliente.
- Acompaña el enlace con **un texto corto** (qué ver y siguiente paso: visita, oferta).
- Guarda la versión en **CRM** o biblioteca con fecha.

## Expectativas

Es una herramienta de **marketing y storytelling**, no sustituye visita física ni mediciones técnicas. La calidad depende de la resolución y la iluminación de las fotos de origen.
    `,
  },
  fr: {
    title: 'Guide Aura VR',
    content: `
# Guide Aura VR

**Aura VR** produit une expérience immersive (vues 360 / visite) à partir des photos du bien pour WhatsApp, e-mail ou présentations.

## Avant de générer

1. Importez des photos **larges** des pièces clés (séjour, cuisine, vues).
2. Vérifiez votre **forfait** : la fonction peut être réservée Pro/Agency selon le produit.
3. Respectez les **droits d’image** (vendeur, tiers).

## Après génération

- Testez le lien sur **mobile et desktop** avant envoi client.
- Ajoutez un **texte court** (contenu + prochaine étape : visite, offre).
- Archivez dans le **CRM** ou la bibliothèque avec date.

## Attentes

Outil de **marketing**, pas de visite physique ni de mesures techniques. La qualité dépend des photos sources (résolution, lumière).
    `,
  },
  de: {
    title: 'Aura VR — Anleitung',
    content: `
# Aura VR — Anleitung

**Aura VR** erstellt aus Fotos eine immersive **360°-/Tour-Erfahrung** für WhatsApp, E-Mail oder Präsentationen.

## Vor dem Generieren

1. **Weitwinkel- oder Raumfotos** der Kernräume hochladen (Wohnen, Küche, Aussichten).
2. **Tarif** prüfen: Funktion ggf. nur Pro/Agency.
3. **Bildrechte** beachten (Eigentümer, Dritte).

## Nach dem Generieren

- Link auf **Mobilgerät und Desktop** testen.
- **Kurzer Begleittext** (was zu sehen ist, nächster Schritt: Besichtigung, Angebot).
- Im **CRM** oder der Bibliothek mit Datum ablegen.

## Erwartung

**Marketing-Tool**, kein Ersatz für Vor-Ort-Termin oder technische Vermessung. Qualität hängt von Auflösung und Licht der Ausgangsbilder ab.
    `,
  },
  pt: {
    title: 'Guia Aura VR',
    content: `
# Guia Aura VR

O **Aura VR** cria uma experiência imersiva (vistas 360 / tour) a partir de fotos do imóvel para WhatsApp, email ou apresentações.

## Antes de gerar

1. Carregue fotos **amplas** das divisões principais (sala, cozinha, vistas).
2. Confirme o **plano**: a função pode estar em Pro/Agency conforme o produto.
3. Respeite **direitos de imagem** (vendedor, terceiros).

## Depois de gerar

- Teste a ligação em **telemóvel e desktop** antes de enviar ao cliente.
- Inclua **texto curto** (o que ver e próximo passo: visita, proposta).
- Guarde no **CRM** ou biblioteca com data.

## Expectativa

Ferramenta de **marketing**, não substitui visita presencial nem medições técnicas. A qualidade depende da resolução e da luz das fotos.
    `,
  },
  ar: {
    title: 'دليل Aura VR',
    content: `
# دليل Aura VR

يُنشئ **Aura VR** تجربة غامرة (360° / جولة) من صور العقار لمشاركتها عبر واتساب أو البريد أو العروض.

## قبل التوليد

1. ارفع صوراً **واسعة الزاوية** للغرف الرئيسية (معيشة، مطبخ، إطلالات).
2. راجع **خطتك**: قد تكون الميزة لـ Pro/Agency حسب المنتج.
3. احترم **حقوق الصور** (البائع أو الغير).

## بعد التوليد

- اختبر الرابط على **الجوال وسطح المكتب** قبل الإرسال.
- أضف **نصاً قصيراً** (ما سيراه والخطوة التالية: زيارة، عرض).
- احفظ في **CRM** أو المكتبة مع التاريخ.

## التوقعات

أداة **تسويق** لا تغني عن الزيارة الميدانية ولا القياسات الفنية. الجودة تعتمد على دقة وإضاءة الصور الأصلية.
    `,
  },
};
