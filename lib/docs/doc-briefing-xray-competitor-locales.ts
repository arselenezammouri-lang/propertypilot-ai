/**
 * ES–AR for Smart Briefing, X-Ray, Competitor Radar docs (IT/EN in doc-content.ts).
 */

import type { DocArticleMultilingual } from '@/lib/docs/doc-article';

type ExtraLocales = Pick<DocArticleMultilingual, 'es' | 'fr' | 'de' | 'pt' | 'ar'>;

export const docBriefingGuideLocales: ExtraLocales = {
  es: {
    title: 'Guía del Smart Briefing',
    content: `
# Guía del Smart Briefing

El **Smart Briefing** resume un inmueble en pros y contras, público objetivo y ángulos de venta para preparar visitas o mensajes rápidos.

## Qué obtienes

- **Fortalezas y riesgos** detectados en ficha y fotos (orientativos).
- **Buyer personas** sugeridas (inversor, familia, expat…) para alinear tono.
- **Ganchos** para titular, WhatsApp o llamada de seguimiento.

## Buenas prácticas

1. Revisa siempre el texto antes de enviarlo al cliente: la IA puede **alucinar** detalles no visibles en las fotos.
2. Cruza con datos reales: planos, certificado energético, estado de reformas.
3. Guarda la versión final en la **biblioteca** o CRM con fecha y fuente.

## Límites

No es tasación ni informe técnico: usa el briefing como **borrador profesional**.
    `,
  },
  fr: {
    title: 'Guide du Smart Briefing',
    content: `
# Guide du Smart Briefing

Le **Smart Briefing** résume un bien : atouts, points de vigilance, cibles acheteurs et angles pour visites ou messages rapides.

## Contenu

- **Forces et risques** déduits de l’annonce et des photos (indicatif).
- **Profils acheteurs** proposés pour harmoniser le ton.
- **Accroches** pour titre, WhatsApp ou relance téléphonique.

## Bonnes pratiques

1. Relisez avant envoi client : l’IA peut **inventer** ce qui n’apparaît pas sur les visuels.
2. Croisez avec données réelles : plans, DPE, état des travaux.
3. Archivez la version finale en **bibliothèque** ou CRM avec date et source.

## Limites

Pas d’estimation ni de rapport technique : usage comme **brouillon pro**.
    `,
  },
  de: {
    title: 'Smart-Briefing-Anleitung',
    content: `
# Smart-Briefing-Anleitung

Das **Smart Briefing** fasst eine Immobilie zusammen: Stärken, Risiken, Käuferprofile und Verkaufsargumente für Besichtigungen oder Kurznachrichten.

## Inhalt

- **Stärken und Risiken** aus Exposé und Fotos (indikativ).
- **Käufer-Personas** für konsistenten Ton.
- **Hooks** für Überschrift, WhatsApp oder Nachfass-Telefonat.

## Best Practices

1. Vor Kundenversand prüfen: KI kann **halluzinieren**, was auf Bildern nicht erkennbar ist.
2. Mit echten Daten abgleichen: Grundrisse, Energieausweis, Sanierungsstand.
3. Finale Version in **Bibliothek** oder CRM mit Datum und Quelle speichern.

## Grenzen

Keine Bewertung und kein Gutachten — nur **professioneller Entwurf**.
    `,
  },
  pt: {
    title: 'Guia do Smart Briefing',
    content: `
# Guia do Smart Briefing

O **Smart Briefing** resume um imóvel: prós, contras, públicos-alvo e ângulos para visitas ou mensagens rápidas.

## O que recebe

- **Pontos fortes e riscos** a partir da ficha e fotos (orientativos).
- **Personas** sugeridas para alinhar o tom.
- **Ganchos** para título, WhatsApp ou follow-up telefónico.

## Boas práticas

1. Revise antes de enviar ao cliente: a IA pode **inventar** o que não está nas imagens.
2. Cruze com dados reais: plantas, certificado energético, estado de obras.
3. Guarde a versão final na **biblioteca** ou CRM com data e fonte.

## Limitações

Não é avaliação nem relatório técnico — use como **rascunho profissional**.
    `,
  },
  ar: {
    title: 'دليل الإحاطة الذكية',
    content: `
# دليل الإحاطة الذكية

تلخص **الإحاطة الذكية** العقار: الإيجابيات والمخاطر والفئات المستهدفة وزوايا البيع للزيارات أو الرسائل السريعة.

## المخرجات

- **نقاط القوة والمخاطر** من الإعلان والصور (إرشادية).
- **شخصيات مشترين** مقترحة لتوحيد الأسلوب.
- **خطافات** للعنوان أو واتساب أو متابعة هاتفية.

## أفضل الممارسات

1. راجع قبل الإرسال للعميل: قد **تخطئ** الذكاء الاصطناعي في تفاصيل غير ظاهرة.
2. طابق مع بيانات حقيقية: مخططات، شهادة الطاقة، حالة الترميم.
3. احفظ النسخة النهائية في **المكتبة** أو CRM مع التاريخ والمصدر.

## حدود

ليس تقييماً ولا تقريراً فنياً — استخدمه كـ**مسودة احترافية**.
    `,
  },
};

export const docBriefingClientReadyLocales: ExtraLocales = {
  es: {
    title: 'Texto listo para el cliente',
    content: `
# Texto listo para el cliente

Genera párrafos **cortos y claros** para WhatsApp, email o SMS: resumen del inmueble, próximo paso y tono profesional.

## Estructura sugerida

1. **Gancho** (1 frase): qué destaca el piso o local.
2. **Datos duros** (2–3 bullets): zona, m², planta, orientación si constan en la ficha.
3. **CTA**: visita, llamada o envío de documentación.

## Tono

- Evita jerga interna («gap», «sniper») salvo que el cliente sea inversor experto.
- No prometas precio de venta ni plazos legales sin respaldo.

## Privacidad

No pegues datos personales del propietario sin consentimiento; usa solo lo que ya es público o te han autorizado a compartir.
    `,
  },
  fr: {
    title: 'Texte prêt pour le client',
    content: `
# Texte prêt pour le client

Produisez des paragraphes **courts** pour WhatsApp, e-mail ou SMS : résumé du bien, prochaine étape, ton pro.

## Structure

1. **Accroche** (1 phrase) : ce qui fait la différence.
2. **Faits** (2–3 puces) : zone, surface, étage, exposition si mentionnés.
3. **CTA** : visite, appel ou envoi de documents.

## Ton

- Évitez le jargon interne (« gap », « sniper ») sauf client expert.
- Pas de promesse de prix ou de délais juridiques sans base.

## Confidentialité

Pas de données personnelles du propriétaire sans accord ; limitez-vous au public ou autorisé.
    `,
  },
  de: {
    title: 'Kundentext fertig',
    content: `
# Kundentext fertig

Erzeugen Sie **kurze** Absätze für WhatsApp, E-Mail oder SMS: Objektkern, nächster Schritt, professioneller Ton.

## Aufbau

1. **Hook** (ein Satz): Alleinstellungsmerkmal.
2. **Fakten** (2–3 Stichpunkte): Lage, Fläche, Etage, Ausrichtung wenn in der Datenlage.
3. **CTA**: Besichtigung, Anruf oder Unterlagen.

## Ton

- Kein internes Jargon (« Gap », « Sniper ») außer beim Profi-Investor.
- Keine Preis- oder Fristversprechen ohne Grundlage.

## Datenschutz

Keine personenbezogenen Eigentümerdaten ohne Einwilligung; nur Öffentliches oder Freigegebenes.
    `,
  },
  pt: {
    title: 'Texto pronto para o cliente',
    content: `
# Texto pronto para o cliente

Gere blocos **curtos** para WhatsApp, email ou SMS: resumo do imóvel, próximo passo, tom profissional.

## Estrutura

1. **Gancho** (1 frase): o que diferencia o imóvel.
2. **Dados** (2–3 itens): zona, área, andar, orientação se constarem na ficha.
3. **CTA**: visita, chamada ou envio de documentos.

## Tom

- Evite jargão interno («gap», «sniper») salvo cliente experto.
- Sem promessas de preço ou prazos legais sem base.

## Privacidade

Sem dados pessoais do proprietário sem consentimento; só o público ou autorizado.
    `,
  },
  ar: {
    title: 'نص جاهز للعميل',
    content: `
# نص جاهز للعميل

أنشئ فقرات **قصيرة** لواتساب أو البريد أو الرسائل: ملخص العقار، الخطوة التالية، نبرة احترافية.

## هيكل مقترح

1. **خطاف** (جملة واحدة): ما يميز العقار.
2. **حقائق** (2–3 نقاط): المنطقة، المساحة، الطابق، التوجيه إن وُجدت في الإعلان.
3. **دعوة إجراء**: زيارة، اتصال، أو إرسال مستندات.

## النبرة

- تجنب المصطلحات الداخلية («gap»، «sniper») إلا مع مستثمر خبير.
- لا توعد بسعر أو مواعيد قانونية دون أساس.

## الخصوصية

لا تلصق بيانات شخصية للمالك دون موافقة؛ علنية أو مصرّح بها فقط.
    `,
  },
};

export const docXrayGuideLocales: ExtraLocales = {
  es: {
    title: 'Análisis técnico de imágenes',
    content: `
# Análisis técnico de imágenes (X-Ray)

**X-Ray** analiza fotos y, cuando aplica, planos para señalar **posibles** defectos, calidad de acabados o puntos fuertes visibles.

## Cómo usarlo

1. Sube **imágenes nítidas** de habitaciones, baños, fachada y zonas húmedas.
2. Lee el informe como **lista de verificación**, no como peritaje.
3. Marca en el **CRM** qué puntos requieren visita técnica o pregunta al vendedor.

## Límites

- No ve dentro de paredes ni instalaciones ocultas.
- No sustituye **informe de edificio**, **ITE** ni certificado oficial: confirma siempre in situ.

## Responsabilidad

Quien vende o alquila debe **validar** cualquier afirmación sensible ante el cliente final.
    `,
  },
  fr: {
    title: 'Analyse technique des images',
    content: `
# Analyse technique des images (X-Ray)

**X-Ray** inspecte photos et, le cas échéant, plans pour signaler des **hypothèses** sur défauts visibles, finitions ou atouts.

## Utilisation

1. Importez des photos **nettes** : pièces, sanitaires, façade, zones humides.
2. Traitez le rapport comme **checklist**, pas comme expertise judiciaire.
3. Notez dans le **CRM** ce qui nécessite visite technique ou question au vendeur.

## Limites

- Pas de vision dans les murs ou installations cachées.
- Ne remplace pas **état des lieux**, **DTG** ou diagnostics réglementaires.

## Responsabilité

Le professionnel doit **valider** toute affirmation sensible auprès du client final.
    `,
  },
  de: {
    title: 'Technische Bildanalyse',
    content: `
# Technische Bildanalyse (X-Ray)

**X-Ray** wertet Fotos und ggf. Grundrisse aus und markiert **mögliche** sichtbare Mängel, Ausstattung oder Highlights.

## Vorgehen

1. **Scharfe** Bilder von Zimmern, Bädern, Fassade, Feuchträumen hochladen.
2. Bericht als **Checkliste** lesen, nicht als Gutachten.
3. Im **CRM** festhalten, was Vor-Ort-Klärung braucht.

## Grenzen

- Keine Sicht hinter Wände oder in verdeckte Leitungen.
- Ersetzt keinen **Zustandsbericht** oder gesetzlich vorgeschriebene Gutachten.

## Verantwortung

Makler/in muss sensible Aussagen **gegenüber** dem Endkunden verifizieren.
    `,
  },
  pt: {
    title: 'Análise técnica de imagens',
    content: `
# Análise técnica de imagens (X-Ray)

O **X-Ray** analisa fotos e, quando aplicável, plantas para apontar **possíveis** defeitos visíveis, acabamentos ou pontos fortes.

## Como usar

1. Carregue fotos **nítidas** de divisões, casas de banho, fachada e zonas húmidas.
2. Leia o relatório como **lista de verificação**, não como perícia.
3. Registe no **CRM** o que exige visita técnica ou pergunta ao vendedor.

## Limitações

- Não «vê» dentro de paredes ou instalações ocultas.
- Não substitui **relatório de estado** nem inspeções obrigatórias.

## Responsabilidade

O profissional deve **validar** afirmações sensíveis perante o cliente final.
    `,
  },
  ar: {
    title: 'التحليل التقني للصور',
    content: `
# التحليل التقني للصور (X-Ray)

يحلل **X-Ray** الصور وعند الحاجة المخططات لإبراز **احتمالات** عيوب مرئية أو جودة تشطيبات أو نقاط قوة.

## الاستخدام

1. ارفع صوراً **واضحة** للغرف والحمامات والواجهة والمناطق الرطبة.
2. اقرأ التقرير كـ**قائمة تحقق** لا كخبرة قانونية.
3. سجّل في **CRM** ما يحتاج زيارة فنية أو سؤالاً للبائع.

## حدود

- لا يرى داخل الجدرار أو التمديدات المخفية.
- لا يغني عن **تقرير حالة** أو فحوصات إلزامية.

## المسؤولية

على المختص **التحقق** من أي ادعاء حساس أمام العميل النهائي.
    `,
  },
};

export const docXrayRenovationLocales: ExtraLocales = {
  es: {
    title: 'Presupuesto de reforma',
    content: `
# Presupuesto de reforma (orientativo)

La herramienta puede **ordenar magnitudes** de obra (cocina, baño, pintura, suelos) a partir de fotos y metadatos: sirve para conversar, no para firmar contratos.

## Cómo presentarlo

1. Indica siempre «**estimación**» o «**rango**» frente al cliente.
2. Desglosa partidas grandes; evita un único número mágico.
3. Añade margen para **imprevistos** (humedades, electricidad, licencias).

## Límites

- Los precios varían por ciudad, mano de obra y calidad de materiales.
- No sustituye **presupuesto de empresa** ni visita de reformista.

## Compliance

En algunos mercados las reformas requieren **licencias**: verifica con técnico y ayuntamiento antes de prometer plazos.
    `,
  },
  fr: {
    title: 'Budget de rénovation',
    content: `
# Budget de rénovation (indicatif)

L’outil peut **structurer des ordres de grandeur** (cuisine, salle de bain, peinture, sols) à partir de photos : support de discussion, pas de devis signé.

## Présentation

1. Toujours dire « **estimation** » ou « **fourchette** » au client.
2. Détailler les postes ; éviter un chiffre unique trompeur.
3. Prévoir une marge **aléas** (humidité, électricité, autorisations).

## Limites

- Prix variables selon ville, main-d’œuvre et gamme matériaux.
- Ne remplace pas **devis d’entreprise** ni visite artisan.

## Conformité

Selon les marchés, travaux soumis à **permis** : vérifier avant de promettre des délais.
    `,
  },
  de: {
    title: 'Renovierungsbudget',
    content: `
# Renovierungsbudget (Richtwert)

Das Tool kann **Größenordnungen** (Küche, Bad, Malerarbeiten, Böden) aus Fotos strukturieren — Gesprächsgrundlage, kein unterschriebener Kostenvoranschlag.

## Präsentation

1. Beim Kunden immer « **Schätzung** » oder « **Spanne** » sagen.
2. Posten aufschlüsseln; keine einzelne «Wunderzahl».
3. **Risikopuffer** (Feuchte, Elektrik, Genehmigungen) einplanen.

## Grenzen

- Preise stark abhängig von Stadt, Lohn und Materialqualität.
- Ersetzt keinen **Handwerker-Angebot** und keine Baustellenbegehung.

## Compliance

Je nach Markt **Genehmigungen** nötig — vor Terminzusagen klären.
    `,
  },
  pt: {
    title: 'Orçamento de renovação',
    content: `
# Orçamento de renovação (orientativo)

A ferramenta pode **estruturar ordens de grandeza** (cozinha, casa de banho, pintura, pavimentos) a partir de fotos: apoio à conversa, não orçamento vinculativo.

## Como apresentar

1. Diga sempre «**estimativa**» ou «**intervalo**» ao cliente.
2. Detalhe rubricas; evite um único número «mágico».
3. Inclua margem para **imprevistos** (humidade, eletricidade, licenças).

## Limitações

- Preços variam com cidade, mão de obra e materiais.
- Não substitui **orçamento de empresa** nem visita de empreiteiro.

## Conformidade

Em alguns mercados as obras exigem **licenças**: confirme antes de prometer prazos.
    `,
  },
  ar: {
    title: 'ميزانية التجديد',
    content: `
# ميزانية التجديد (إرشادية)

قد ترتّب الأداة **تقديرات تقريبية** (مطبخ، حمام، دهان، أرضيات) من الصور: للنقاش فقط وليست عرض سعر ملزم.

## العرض

1. قل دائماً «**تقدير**» أو «**نطاق**» للعميل.
2. فصّل البنود؛ تجنب رقماً واحداً مضللاً.
3. أضف هامشاً لل**مفاجآت** (رطوبة، كهرباء، تراخيص).

## حدود

- الأسعار تختلف بالمدينة والعمالة والمواد.
- لا يغني عن **عرض مقاول** ولا عن معاينة موقع.

## الامتثال

في بعض الأسواق الترميم يحتاج **تراخيص** — تحقق قبل وعد المواعيد.
    `,
  },
};

export const docCompetitorRadarLocales: ExtraLocales = {
  es: {
    title: 'Detección de mandatos en vencimiento',
    content: `
# Radar de competencia — mandatos y anuncios estancados

El radar ayuda a localizar inmuebles **llevando mucho tiempo** online o con señales de mandato débil, para un contacto respetuoso con el propietario.

## Qué busca (conceptualmente)

- Anuncios con **mucho tiempo** publicados (ej. 120+ días según tu mercado).
- Patrones que sugieren **poca rotación** o necesidad de reposicionar precio o marketing.

## Enfoque

1. **Datos primero**: menciona días en portal o comparables, no juicios personales.
2. Ofrece **valor** (nuevo pack fotos, precio, canal internacional) antes de pedir exclusiva.
3. Registra en el **CRM** cada contacto para no duplicar con compañeros.

## Ética y ley

Respeta privacidad, opt-out y normas de **prospección**: no acoses; un «no» cerrado es definitivo.
    `,
  },
  fr: {
    title: 'Détection de mandats / annonces stagnantes',
    content: `
# Radar concurrentiel — mandats et annonces qui stagnent

Le radar met en avant des biens **longtemps en ligne** ou avec des signaux de mandat fragile, pour un contact respectueux.

## Signaux (conceptuels)

- Annonces avec **durée élevée** (ex. 120+ jours selon le marché).
- Indices de **faible rotation** ou besoin de repositionnement prix / marketing.

## Approche

1. **Faits** : jours en ligne, comparables, pas de jugement personnel.
2. Proposer de la **valeur** (photos, prix, diffusion) avant d’exiger l’exclusivité.
3. **CRM** : tracer chaque contact pour éviter les doublons d’équipe.

## Éthique et droit

Respecter vie privée, opt-out et règles de **démarchage** ; un refus ferme s’arrête là.
    `,
  },
  de: {
    title: 'Erkennung stagnierender Mandate / Inserate',
    content: `
# Competitor Radar — lange online / schwache Exklusivität

Der Radar hebt Objekte hervor, die **sehr lange** inseriert sind oder Signale für schwaches Mandat zeigen — für respektvollen Erstkontakt.

## Signale (konzeptionell)

- Inserate mit **langer Laufzeit** (z. B. 120+ Tage je Markt).
- Hinweise auf **geringe Rotation** oder Neu-Positionierung nötig.

## Vorgehen

1. **Fakten**: Tage online, Vergleichswerte, kein persönliches Urteil.
2. **Mehrwert** anbieten (Fotos, Preis, Kanäle) vor Exklusivitätswunsch.
3. **CRM**: jeden Kontakt loggen — keine Doppelungen im Team.

## Ethik & Recht

Datenschutz, Opt-out und **Akquise-Regeln** einhalten; klares Nein akzeptieren.
    `,
  },
  pt: {
    title: 'Deteção de mandatos / anúncios parados',
    content: `
# Radar de concorrentes — mandatos e anúncios estagnados

O radar destaca imóveis **há muito tempo** online ou com sinais de mandato frágil, para contacto respeitoso.

## Sinais (conceituais)

- Anúncios com **longa permanência** (ex. 120+ dias conforme o mercado).
- Padrões de **baixa rotação** ou necessidade de reposicionar preço ou marketing.

## Abordagem

1. **Dados**: dias no portal, comparáveis, sem julgamentos pessoais.
2. Ofereça **valor** (fotos, preço, canais) antes de pedir exclusividade.
3. **CRM**: registe cada contacto para evitar duplicação na equipa.

## Ética e lei

Respeite privacidade, opt-out e regras de **prospeção**; um «não» firme é final.
    `,
  },
  ar: {
    title: 'رصد التفويضات / الإعلانات الراكدة',
    content: `
# رادار المنافسين — تفويضات وإعلانات راكدة

يساعد الرادار على إبراز عقارات **طال عرضها** أو تظهر عليها إشارات ضعف في التفويض، لتواصل محترم مع المالك.

## إشارات (مفاهيمية)

- إعلانات ب**مدة طويلة** (مثل 120+ يوماً حسب السوق).
- أنماط **دوران منخفض** أو حاجة لإعادة تسعير أو تسويق.

## الأسلوب

1. **حقائق**: أيام العرض، مقارنات، دون أحكام شخصية.
2. قدّم **قيمة** (صور، سعر، قنوات) قبل طلب الحصرية.
3. **CRM**: سجّل كل تواصل لتفادي التكرار بين الزملاء.

## الأخلاق والقانون

احترم الخصوصية والانسحاب وقواعد **التسويق**؛ الرفض القاطع نهائي.
    `,
  },
};
