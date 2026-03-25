/**
 * ES–AR for 3D Virtual Staging docs (IT/EN in doc-content.ts).
 */

import type { DocArticleMultilingual } from '@/lib/docs/doc-article';

type ExtraLocales = Pick<DocArticleMultilingual, 'es' | 'fr' | 'de' | 'pt' | 'ar'>;

export const docStagingGuideLocales: ExtraLocales = {
  es: {
    title: 'Guía de staging 3D',
    content: `
# Guía de staging 3D

El staging 3D genera **visualizaciones** (mobiliario, luz, estilo) a partir de fotos del inmueble para que propietarios y compradores imaginen el potencial.

## Cuándo usarlo

- **Vacío o poco atractivo**: refuerza salón, dormitorio o zonas clave sin obra física.
- **Reforma en venta**: muestra una línea coherente (moderno, escandinavo, etc.) alineada con el precio pedido.
- **Multicanal**: exporta o comparte vistas para portales, WhatsApp o presentaciones.

## Buenas prácticas

1. Sube **fotos nítidas** y bien iluminadas; evita ángulos extremos que distorsionen.
2. Mantén el **estilo creíble** para el barrio y el target (inversor vs familia).
3. Etiqueta las imágenes como **visualización / render** cuando la normativa o el portal lo exijan.

## Expectativas

El resultado es una **herramienta de marketing**, no un proyecto de obra: revisa siempre antes de publicar.
    `,
  },
  fr: {
    title: 'Guide du staging 3D',
    content: `
# Guide du staging 3D

Le staging 3D produit des **visualisations** (mobilier, lumière, style) à partir de photos pour aider propriétaires et acheteurs à projeter le potentiel du bien.

## Quand l’utiliser

- **Logement vide ou peu mis en valeur** : valoriser séjour, chambres, pièces clés sans travaux.
- **Revente après travaux** : montrer une direction déco cohérente avec le prix demandé.
- **Multi-canal** : exports pour portails, WhatsApp ou supports commerciaux.

## Bonnes pratiques

1. Photos **nettes et bien exposées** ; éviter les angles trop extrêmes.
2. Style **crédible** pour le quartier et la cible (investisseur vs famille).
3. Mention **visualisation / rendu** si le portail ou la loi l’exigent.

## Attentes

Outil de **marketing**, pas un plan de chantier : toujours valider avant publication.
    `,
  },
  de: {
    title: '3D-Staging-Anleitung',
    content: `
# 3D-Staging-Anleitung

3D-Staging erzeugt **Visualisierungen** (Möblierung, Licht, Stil) aus Fotos, damit Eigentümer und Käufer das Potenzial erkennen.

## Wann einsetzen

- **Leer oder wenig attraktiv**: Wohn-, Schlaf- und Kernräume aufwerten ohne Baustelle.
- **Verkauf nach Konzept**: eine nachvollziehbare Designlinie passend zum Preis zeigen.
- **Mehrkanal**: Exporte für Portale, WhatsApp oder Präsentationen.

## Best Practices

1. **Scharfe, gut belichtete** Fotos; extreme Verzerrungen vermeiden.
2. **Glaubwürdiger Stil** für Lage und Käuferprofil (Investor vs. Familie).
3. Kennzeichnung als **Visualisierung / Render**, falls Portal oder Recht es verlangen.

## Erwartung

**Marketing-Tool**, kein Bauplan — vor Veröffentlichung prüfen.
    `,
  },
  pt: {
    title: 'Guia de staging 3D',
    content: `
# Guia de staging 3D

O staging 3D gera **visualizações** (mobiliário, luz, estilo) a partir de fotos para proprietários e compradores perceberem o potencial do imóvel.

## Quando usar

- **Vazio ou pouco apresentável**: valorizar sala, quartos e zonas-chave sem obra real.
- **Revenda com conceito**: mostrar uma linha decorativa coerente com o preço.
- **Multicanal**: partilhar ou exportar para portais, WhatsApp ou apresentações.

## Boas práticas

1. Fotos **nítidas e bem iluminadas**; evitar ângulos que distorçam.
2. **Estilo credível** para a zona e o público (investidor vs família).
3. Indicar **visualização / render** quando o portal ou a lei exijam.

## Expectativa

Ferramenta de **marketing**, não projeto de obra — validar antes de publicar.
    `,
  },
  ar: {
    title: 'دليل التجهيز ثلاثي الأبعاد',
    content: `
# دليل التجهيز ثلاثي الأبعاد

يولّد التجهيز ثلاثي الأبعاد **صوراً مرئية** (أثاث، إضاءة، أسلوب) من صور العقار لمساعدة المالكين والمشترين على تخيل الإمكانات.

## متى تستخدمه

- **فراغ أو ضعف جاذبية**: إبراز غرف المعيشة والنوم دون أعمال بناء.
- **إعادة بيع بمفهوم تصميم**: عرض اتجاه متسق مع السعر المطلوب.
- **قنوات متعددة**: تصدير أو مشاركة للبوابات أو واتساب أو عروض.

## أفضل الممارسات

1. صور **واضحة ومضاءة جيداً**؛ تجنب الزوايا المبالغ فيها.
2. **أسلوب واقعي** للحي والفئة (مستثمر مقابل عائلة).
3. ذكر **تصور / رندر** إذا اشترط البوابة أو القانون.

## التوقعات

أداة **تسويق** وليست مخطط بناء — راجع قبل النشر.
    `,
  },
};

export const docStagingWhatsappLocales: ExtraLocales = {
  es: {
    title: 'Envío por WhatsApp',
    content: `
# Envío por WhatsApp

Comparte **renders 3D** o comparativas antes/después con propietarios y compradores en el canal donde ya responden.

## Qué enviar

- **Una imagen fuerte** por mensaje; evita carruseles pesados en redes móviles.
- **Texto corto**: qué muestra la imagen y el siguiente paso (visita, llamada, enlace al anuncio).
- **Consentimiento**: confirma que quieren recibir material por WhatsApp cuando aplique el RGPD o normas locales.

## Flujo sugerido

1. Genera o selecciona la vista en el producto **Virtual Staging** del dashboard.
2. Exporta o usa la acción de **compartir** si está disponible.
3. Registra en el **CRM** que enviaste el material y la reacción del cliente.

## Calidad

Comprime sin destruir detalle en móviles: un archivo demasiado grande reduce la tasa de apertura.
    `,
  },
  fr: {
    title: 'Envoi via WhatsApp',
    content: `
# Envoi via WhatsApp

Partagez des **rendus 3D** ou des avant/après avec propriétaires et acheteurs sur le canal où ils réagissent le plus vite.

## Contenu à envoyer

- **Une image forte** par message ; évitez les envois trop lourds sur mobile.
- **Texte court** : ce que montre l’image et la suite (visite, appel, lien annonce).
- **Consentement** : validez l’envoi sur WhatsApp si RGPD ou loi locale l’exigent.

## Déroulé

1. Générez ou choisissez la vue dans **Virtual Staging** sur le tableau de bord.
2. Exportez ou utilisez **Partager** si proposé.
3. Notez dans le **CRM** l’envoi et la réaction.

## Qualité

Compressez sans trop dégrader : les fichiers trop lourds réduisent l’ouverture.
    `,
  },
  de: {
    title: 'Versand per WhatsApp',
    content: `
# Versand per WhatsApp

Teilen Sie **3D-Renderings** oder Vorher-Nachher-Vergleiche mit Eigentümern und Käufern über den Kanal, auf dem sie am schnellsten antworten.

## Was senden

- **Ein starkes Bild** pro Nachricht; keine zu großen Dateien fürs Handy.
- **Kurzer Text**: was das Bild zeigt und nächster Schritt (Besichtigung, Anruf, Inseratslink).
- **Einwilligung**: WhatsApp-Versand nur bei Zustimmung (DSGVO / lokales Recht).

## Ablauf

1. Ansicht in **Virtual Staging** im Dashboard erzeugen oder wählen.
2. Export oder **Teilen**, falls vorhanden.
3. Versand und Rückmeldung im **CRM** festhalten.

## Qualität

Komprimieren ohne wichtige Details zu verlieren — zu große Dateien werden seltener geöffnet.
    `,
  },
  pt: {
    title: 'Envio via WhatsApp',
    content: `
# Envio via WhatsApp

Partilhe **renders 3D** ou comparações antes/depois com proprietários e compradores no canal onde respondem mais depressa.

## O que enviar

- **Uma imagem forte** por mensagem; evite ficheiros pesados no telemóvel.
- **Texto curto**: o que a imagem mostra e o próximo passo (visita, chamada, link do anúncio).
- **Consentimento**: confirme que aceitam WhatsApp quando RGPD ou lei local exigirem.

## Fluxo

1. Gere ou escolha a vista em **Virtual Staging** no painel.
2. Exporte ou use **Partilhar** se existir.
3. Registe no **CRM** o envio e a reação.

## Qualidade

Comprima sem perder detalhe — ficheiros grandes reduzem aberturas.
    `,
  },
  ar: {
    title: 'الإرسال عبر واتساب',
    content: `
# الإرسال عبر واتساب

شارك **صور التصيير ثلاثية الأبعاد** أو مقارنات قبل/بعد مع المالكين والمشترين على القناة التي يردون عليها أسرع.

## ماذا ترسل

- **صورة قوية** لكل رسالة؛ تجنب الملفات الثقيلة على الجوال.
- **نص قصير**: ماذا تعرض الصورة والخطوة التالية (زيارة، اتصال، رابط الإعلان).
- **الموافقة**: تأكد من قبول واتساب عندما يفرض GDPR أو القانون المحلي ذلك.

## المسار

1. أنشئ أو اختر المشهد من **التجهيز الافتراضي** في لوحة التحكم.
2. صدّر أو استخدم **مشاركة** إن وُجدت.
3. سجّل في **CRM** الإرسال ورد الفعل.

## الجودة

اضغط الملف دون إتلاف التفاصيل — الملفات الكبيرة تقلل معدل الفتح.
    `,
  },
};
