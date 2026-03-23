/**
 * ES–AR for perfect-copy, CRM pipeline, account billing (IT/EN in doc-content.ts).
 */

import type { DocArticleMultilingual } from '@/lib/docs/doc-article';

type ExtraLocales = Pick<DocArticleMultilingual, 'es' | 'fr' | 'de' | 'pt' | 'ar'>;

export const docPerfectCopyLocales: ExtraLocales = {
  es: {
    title: 'Perfect Copy — guía rápida',
    content: `
# Perfect Copy

Genera **cinco variantes** del mismo anuncio (profesional, emocional, corto, SEO, luxury) a partir de los datos del inmueble.

## Campos importantes

- **Tipo de anuncio e inmueble**: definen léxico y tono.
- **Zona / ubicación**: sirve para referencias de mercado y titulares.
- **Características y puntos fuertes**: más detalle = copy más convincente; incluye m², plantas, luz, vistas, entorno.
- **Cliente objetivo** (inversor, familia, expat…): orienta el gancho y la CTA.
- **Tono y portal**: adapta estilo y longitud al canal (Idealista, Zillow, web de agencia).

## Consejos

1. Rellena al menos los campos obligatorios (\*) antes de generar.
2. Usa las pestañas para comparar variantes y copia la que publiques.
3. Guarda tu favorita en la **biblioteca de anuncios** para reutilizarla.
    `,
  },
  fr: {
    title: 'Perfect Copy — guide rapide',
    content: `
# Perfect Copy

Générez **cinq variantes** de la même annonce (professionnel, émotionnel, court, SEO, luxe) à partir des données du bien.

## Champs importants

- **Type d’annonce et de bien** : vocabulaire et ton.
- **Zone / localisation** : repères marché et titres ciblés.
- **Caractéristiques et atouts** : plus de détails = copy plus convaincant ; surface, étages, lumière, vues, proximités.
- **Client cible** (investisseur, famille, expat…) : accroches et CTA.
- **Ton et portail** : longueur et style selon le canal (Idealista, Zillow, site agence).

## Conseils

1. Renseignez les champs obligatoires (\*) avant de générer.
2. Utilisez les onglets pour comparer et copier la variante publiée.
3. Enregistrez votre préféré dans la **bibliothèque d’annonces** pour réutilisation.
    `,
  },
  de: {
    title: 'Perfect Copy — Kurzanleitung',
    content: `
# Perfect Copy

Erzeugen Sie **fünf Varianten** derselben Anzeige (professionell, emotional, kurz, SEO, Luxury) aus den Objektdaten.

## Wichtige Felder

- **Anzeigen- und Objekttyp**: Wortschatz und Ton.
- **Lage / Standort**: Markthinweise und gezielte Überschriften.
- **Ausstärken und Stärken**: mehr Details = überzeugenderer Text; m², Etagen, Licht, Aussicht, Umgebung.
- **Zielkunde** (Investor, Familie, Expat …): Hooks und CTAs.
- **Ton und Portal**: Länge und Stil pro Kanal (Idealista, Zillow, Agenturseite).

## Tipps

1. Pflichtfelder (\*) vor dem Generieren ausfüllen.
2. Tabs zum Vergleichen nutzen und die Variante kopieren, die Sie veröffentlichen.
3. Favorit in der **Inserate-Bibliothek** speichern.
    `,
  },
  pt: {
    title: 'Perfect Copy — guia rápida',
    content: `
# Perfect Copy

Gere **cinco variantes** do mesmo anúncio (profissional, emocional, curto, SEO, luxury) com base nos dados do imóvel.

## Campos importantes

- **Tipo de anúncio e imóvel**: definem léxico e tom.
- **Zona / localização**: referências de mercado e títulos.
- **Características e pontos fortes**: mais detalhe = copy mais convincente; m², pisos, luz, vistas, envolvente.
- **Cliente-alvo** (investidor, família, expat…): orienta o gancho e o CTA.
- **Tom e portal**: adapta estilo e comprimento ao canal (Idealista, Zillow, site da agência).

## Dicas

1. Preencha os campos obrigatórios (\*) antes de gerar.
2. Use os separadores para comparar variantes e copie a que vai publicar.
3. Guarde o favorito na **biblioteca de anúncios** para reutilizar.
    `,
  },
  ar: {
    title: 'Perfect Copy — دليل سريع',
    content: `
# Perfect Copy

أنشئ **خمس نسخ** من نفس الإعلان (احترافي، عاطفي، قصير، SEO، فاخر) من بيانات العقار.

## حقول مهمة

- **نوع الإعلان والعقار**: يحددان المفردات والأسلوب.
- **المنطقة / الموقع**: مراجع السوق والعناوين المستهدفة.
- **الميزات ونقاط القوة**: كلما زاد التفصيل زادت قوة النص؛ المساحة، الطوابق، الإضاءة، الإطلالات، المحيط.
- **العميل المستهدف** (مستثمر، عائلة، مغترب…): يوجّه الافتتاحية ودعوة الإجراء.
- **النبرة والبوابة**: يكيّف الطول والأسلوب حسب القناة (Idealista، Zillow، موقع الوكالة).

## نصائح

1. املأ الحقول الإلزامية (\*) قبل التوليد.
2. استخدم التبويبات للمقارنة وانسخ النسخة التي تنشرها.
3. احفظ المفضلة في **مكتبة الإعلانات** لإعادة الاستخدام.
    `,
  },
};

export const docPipelineLocales: ExtraLocales = {
  es: {
    title: 'Pipeline de leads — cómo usarla',
    content: `
# Pipeline de leads

La vista de **columnas** (Kanban) muestra los leads por fase: Nuevos → Contactados → Seguimiento → Cerrados / Perdidos.

## Cómo funciona

1. **Arrastra** una tarjeta entre columnas para actualizar el estado (guardado automático).
2. Abre el **detalle del lead** para notas, puntuación IA y seguimientos.
3. Las **reglas de automatización CRM** pueden reaccionar al cambio de estado (si están configuradas).

## Buenas prácticas

- Mueve a «Contactados» solo tras un contacto real.
- Usa Seguimiento para visitas o devoluciones de llamada.
- Cambia a la **lista de leads** (tabla) cuando necesites filtros y ordenación.
    `,
  },
  fr: {
    title: 'Pipeline leads — mode d’emploi',
    content: `
# Pipeline leads

La vue **colonnes** (Kanban) affiche les leads par étape : Nouveaux → Contactés → Suivi → Clôturés / Perdus.

## Fonctionnement

1. **Glissez** une carte d’une colonne à l’autre pour mettre à jour le statut (sauvegarde auto).
2. Ouvrez le **détail du lead** pour les notes, le score IA et les relances.
3. Les **règles d’automatisation CRM** peuvent réagir au changement de statut (si configurées).

## Bonnes pratiques

- Passez à Contacté seulement après un vrai échange.
- Utilisez Suivi pour visites ou rappels.
- Basculez vers la **liste des leads** (tableau) pour filtres et tri.
    `,
  },
  de: {
    title: 'Lead-Pipeline — Bedienung',
    content: `
# Lead-Pipeline

Die **Spaltenansicht** (Kanban) zeigt Leads nach Phase: Neu → Kontaktiert → Follow-up → Geschlossen / Verloren.

## Ablauf

1. **Ziehen** Sie eine Karte zwischen Spalten, um den Status zu ändern (automatisches Speichern).
2. **Lead-Detail** für Notizen, KI-Score und Follow-ups öffnen.
3. **CRM-Automatisierungsregeln** können auf Statuswechsel reagieren (falls eingerichtet).

## Best Practices

- Erst nach echtem Kontakt auf „Kontaktiert“ setzen.
- Follow-up für Besichtigungen oder Rückrufe nutzen.
- Zur **Lead-Liste** (Tabelle) wechseln für Filter und Sortierung.
    `,
  },
  pt: {
    title: 'Pipeline de leads — como usar',
    content: `
# Pipeline de leads

A vista em **colunas** (Kanban) mostra os leads por fase: Novos → Contactados → Follow-up → Fechados / Perdidos.

## Como funciona

1. **Arraste** um cartão entre colunas para atualizar o estado (gravação automática).
2. Abra o **detalhe do lead** para notas, pontuação IA e follow-ups.
3. As **regras de automação CRM** podem reagir à mudança de estado (se configuradas).

## Boas práticas

- Só mova para Contactados após contacto real.
- Use Follow-up para visitas ou callbacks.
- Mude para a **lista de leads** (tabela) quando precisar de filtros e ordenação.
    `,
  },
  ar: {
    title: 'مسار العملاء المحتملين — طريقة الاستخدام',
    content: `
# مسار العملاء المحتملين

عرض **الأعمدة** (كانبان) يعرض العملاء حسب المرحلة: جدد ← تم التواصل ← متابعة ← مغلق / مفقود.

## آلية العمل

1. **اسحب** البطاقة بين الأعمدة لتحديث الحالة (حفظ تلقائي).
2. افتح **تفاصيل العميل** للملاحظات ودرجة الذكاء الاصطناعي والمتابعات.
3. قد تتفاعل **قواعد أتمتة CRM** مع تغيير الحالة (إن وُجدت).

## أفضل الممارسات

- انقل إلى «تم التواصل» فقط بعد تواصل فعلي.
- استخدم المتابعة للزيارات أو المعاودة.
- انتقل إلى **قائمة العملاء** (جدول) عند الحاجة للتصفية والفرز.
    `,
  },
};

export const docBillingGuideLocales: ExtraLocales = {
  es: {
    title: 'Plan y facturación',
    content: `
# Plan y facturación

Gestiona **mejoras de plan**, el **Stripe Customer Portal** (método de pago, facturas) y el **estado** de la suscripción.

## Qué revisar

- El **plan actual** y la insignia (Free, Starter, Pro, Agency) deben coincidir con lo contratado.
- Si el pago está **pendiente** o falló, usa el portal del cliente o reintenta el checkout.
- **Cancelar al final del periodo**: mantienes acceso hasta la fecha indicada.

## Seguridad

Los pagamentos pasan por **Stripe**; PropertyPilot no almacena los datos completos de la tarjeta. Para cargos, revisa primero el portal Stripe vinculado al email de tu cuenta.
    `,
  },
  fr: {
    title: 'Forfait et facturation',
    content: `
# Forfait et facturation

Gérez les **mises à niveau**, le **portail client Stripe** (moyen de paiement, factures) et le **statut** d’abonnement.

## Points à vérifier

- Le **forfait actuel** et le badge (Free, Starter, Pro, Agency) doivent correspondre à votre achat.
- Si le paiement est **en attente** ou a échoué, utilisez le portail ou relancez le checkout.
- **Annulation en fin de période** : accès jusqu’à la date indiquée.

## Sécurité

Les paiements passent par **Stripe** ; PropertyPilot ne stocke pas les données complètes de carte. En cas de problème de prélèvement, vérifiez d’abord le portail Stripe lié à l’e-mail du compte.
    `,
  },
  de: {
    title: 'Plan & Abrechnung',
    content: `
# Plan & Abrechnung

Verwalten Sie **Upgrades**, das **Stripe-Kundenportal** (Zahlungsmittel, Rechnungen) und den Abo-**Status**.

## Prüfen

- **Aktueller Plan** und Badge (Free, Starter, Pro, Agency) sollten zum Kauf passen.
- Bei **ausstehendem** oder fehlgeschlagenem Zahlungsvorgang: Portal nutzen oder Checkout wiederholen.
- **Kündigung zum Periodenende**: Zugang bis zum angezeigten Datum.

## Sicherheit

Zahlungen laufen über **Stripe**; PropertyPilot speichert keine vollständigen Kartendaten. Bei Abbuchungsproblemen zuerst das Stripe-Portal zur Account-E-Mail prüfen.
    `,
  },
  pt: {
    title: 'Plano e faturação',
    content: `
# Plano e faturação

Gira **upgrades**, o **Stripe Customer Portal** (método de pagamento, faturas) e o **estado** da subscrição.

## O que verificar

- O **plano atual** e o distintivo (Free, Starter, Pro, Agency) devem corresponder ao que comprou.
- Se o pagamento estiver **pendente** ou falhou, use o portal do cliente ou tente novamente o checkout.
- **Cancelar no fim do período**: mantém acesso até à data indicada.

## Segurança

Os pagamentos passam pela **Stripe**; o PropertyPilot não armazena dados completos do cartão. Para cobranças, verifique primeiro o portal Stripe associado ao email da conta.
    `,
  },
  ar: {
    title: 'الخطة والفوترة',
    content: `
# الخطة والفوترة

أدر **الترقيات** و**بوابة عميل Stripe** (طريقة الدفع، الفواتير) و**حالة** الاشتراك.

## ما الذي تتحقق منه

- يجب أن يتطابق **الخطة الحالية** والشارة (Free، Starter، Pro، Agency) مع ما اشتريته.
- إذا كان الدفع **معلقاً** أو فشل، استخدم بوابة العميل أو أعد محاولة الدفع.
- **إلغاء في نهاية الفترة**: يبقى الوصول حتى التاريخ المعروض.

## الأمان

تمر المدفوعات عبر **Stripe**؛ لا يخزن PropertyPilot بيانات البطاقة كاملة. لمشاكل الخصم، راجع أولاً بوابة Stripe المرتبطة ببريد الحساب.
    `,
  },
};
