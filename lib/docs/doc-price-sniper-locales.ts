/**
 * ES–AR for Price Drop Sniper docs (IT/EN in doc-content.ts).
 */

import type { DocArticleMultilingual } from '@/lib/docs/doc-article';

type ExtraLocales = Pick<DocArticleMultilingual, 'es' | 'fr' | 'de' | 'pt' | 'ar'>;

export const docSniperGuideLocales: ExtraLocales = {
  es: {
    title: 'Cómo funciona Sniper',
    content: `
# Price Drop Sniper

Sniper detecta anuncios cuando **baja el precio** para que actúes antes que la competencia.

## Capacidades

- **Detección rápida**: alertas tras una bajada
- **Historial de precio**: evolución en el tiempo
- **Guiones de contacto**: mensajes centrados en el propietario

## Estrategia

1. Contacta en las primeras horas o días tras la bajada
2. Menciona el **reposicionamiento** en el mercado, sin presión agresiva
3. Propón visita o valoración profesional como siguiente paso
    `,
  },
  fr: {
    title: 'Fonctionnement du Sniper',
    content: `
# Price Drop Sniper

Le Sniper signale les annonces lorsque le **prix baisse**, pour que vous réagissiez avant les concurrents.

## Fonctions

- **Détection rapide** : alertes après une baisse
- **Historique des prix** : suivi dans le temps
- **Scripts de prise de contact** : messages orientés propriétaire

## Stratégie

1. Relancer dans les heures ou jours suivant la baisse
2. Évoquer le **repositionnement** marché, sans pression excessive
3. Proposer visite ou estimation comme prochaine étape
    `,
  },
  de: {
    title: 'So funktioniert der Sniper',
    content: `
# Price Drop Sniper

Der Sniper meldet Inserate bei **Preissenkungen**, damit Sie vor der Konkurrenz handeln.

## Funktionen

- **Schnelle Erkennung**: Alerts nach Abschlag
- **Preisverlauf**: Entwicklung über die Zeit
- **Ansprache-Skripte**: fokus Eigentümer

## Strategie

1. Kurz nach der Senkung kontaktieren
2. **Neupositionierung** sachlich ansprechen, ohne Druck
3. Besichtigung oder Bewertung als nächsten Schritt anbieten
    `,
  },
  pt: {
    title: 'Como funciona o Sniper',
    content: `
# Price Drop Sniper

O Sniper deteta anúncios quando o **preço desce** para agir antes da concorrência.

## Capacidades

- **Deteção rápida**: alertas após a queda
- **Histórico de preço**: evolução ao longo do tempo
- **Guiões de contacto**: mensagens focadas no proprietário

## Estratégia

1. Contacte nas primeiras horas ou dias após a queda
2. Refira o **reposicionamento** no mercado, sem pressão excessiva
3. Proponha visita ou avaliação como próximo passo
    `,
  },
  ar: {
    title: 'كيف يعمل Sniper',
    content: `
# Price Drop Sniper

يرصد Sniper الإعلانات عند **انخفاض السعر** لتتحرك قبل المنافسين.

## القدرات

- **كشف سريع**: تنبيهات بعد الانخفاض
- **سجل الأسعار**: التغير مع الوقت
- **نصوص تواصل**: تركز على المالك

## الاستراتيجية

1. تواصل في الساعات أو الأيام الأولى بعد الانخفاض
2. أشر إلى **إعادة التموضع** في السوق دون ضغط مبالغ فيه
3. اقترح زيارة أو تقييماً كخطوة تالية
    `,
  },
};

export const docSniperStrategyLocales: ExtraLocales = {
  es: {
    title: 'Estrategia Sniper',
    content: `
# Estrategia Sniper

Un ribasso de precio es una **ventana de conversación**: el propietario ya ha movido una palanca; tu trabajo es aportar valor sin sonar desesperado.

## Mensaje

- Reconoce el cambio: «He visto el ajuste en [portal]».
- Conecta con datos: días en mercado, comparables, interés de compradores si es real.
- Evita «te lo dije» o presionar por firma en la primera frase.

## Timing

- **24–72 h** tras la bajada suele ser el mejor equilibrio entre rapidez y no invasión.
- Si ya hubo contacto previo, retoma el hilo con el nuevo precio como gancho.

## CRM

Crea tarea **seguimiento + recordatorio** y enlaza el anuncio. Si usas automatizaciones, no dispares cadenas genéricas: personaliza el primer toque.

## Cumplimiento

Respeta opt-out, listas Robinson (o equivalentes) y normativa de prospección en tu jurisdicción.
    `,
  },
  fr: {
    title: 'Stratégie Sniper',
    content: `
# Stratégie Sniper

Une baisse de prix ouvre une **fenêtre de dialogue** : le propriétaire a déjà bougé ; votre rôle est d’apporter de la valeur sans paraître pressant.

## Message

- Reconnaître le mouvement : « J’ai vu l’ajustement sur [portail] ».
- Appuyer sur des faits : jours en ligne, comparables, acheteurs qualifiés si réel.
- Éviter le ton « je vous l’avais dit » ou l’exigence de mandat dès la première phrase.

## Timing

- **24–72 h** après la baisse : souvent le bon compromis entre réactivité et respect.
- Si contact antérieur, reprenez le fil avec le nouveau prix comme accroche.

## CRM

Tâche de **suivi + rappel** et lien vers l’annonce. Automatisations : évitez les séquences génériques sur le premier contact.

## Conformité

Respectez opt-out, listes d’opposition et cadre local de prospection.
    `,
  },
  de: {
    title: 'Sniper-Strategie',
    content: `
# Sniper-Strategie

Eine Preissenkung ist ein **Gesprächsfenster**: der Eigentümer hat bereits signalisiert; Sie liefern Wert ohne aufdringlich zu wirken.

## Botschaft

- Änderung anerkennen: „Ich habe die Anpassung auf [Portal] gesehen.“
- Mit Fakten untermauern: Tage online, Vergleichswerte, echte Käuferinteresse.
- Kein „ich hab’s Ihnen gesagt“ und kein Mandatszwang im ersten Satz.

## Timing

- **24–72 Std.** nach Senkung oft guter Kompromiss aus Tempo und Zurückhaltung.
- Bei früherem Kontakt: Faden mit neuem Preis wieder aufnehmen.

## CRM

Follow-up-**Aufgabe + Erinnerung** und Inseratslink. Bei Automationen: keinen generischen ersten Schritt.

## Compliance

Opt-out, Robinson-Liste (o.ä.) und lokale Akquise-Regeln beachten.
    `,
  },
  pt: {
    title: 'Estratégia Sniper',
    content: `
# Estratégia Sniper

Uma queda de preço abre uma **janela de conversa**: o proprietário já mexeu numa alavanca; o seu papel é acrescentar valor sem parecer invasivo.

## Mensagem

- Reconheça o movimento: «Vi o ajuste em [portal]».
- Apoie em factos: dias online, comparáveis, interesse de compradores se for real.
- Evite «eu avisei» ou exigir exclusividade na primeira frase.

## Timing

- **24–72 h** após a queda costuma equilibrar rapidez e respeito.
- Se já houve contacto, retome com o novo preço como gancho.

## CRM

Tarefa de **seguimento + lembrete** com link ao anúncio. Em automações, evite o primeiro passo totalmente genérico.

## Conformidade

Respeite opt-out, listas de oposição e regras locais de prospecção.
    `,
  },
  ar: {
    title: 'استراتيجية Sniper',
    content: `
# استراتيجية Sniper

خفض السعر يفتح **نافذة حوار**: المالك تحرك بالفعل؛ دورك تقديم قيمة دون إلحاح مزعج.

## الرسالة

- اعترف بالتغيير: «لاحظت التعديل على [البوابة]».
- دعم بحقائق: أيام العرض، مقارنات، اهتمام مشترين إن كان حقيقياً.
- تجنب «قلت لك» أو طلب تفويض في الجملة الأولى.

## التوقيت

- **24–72 ساعة** بعد الانخفاض غالباً توازن بين السرعة والاحترام.
- إن سبق تواصل، استأنف بخطاف السعر الجديد.

## CRM

مهمة **متابعة + تذكير** مع رابط الإعلان. في الأتمتة، تجنب أول رسالة عامة تماماً.

## الامتثال

احترم إلغاء الاشتراك والقوائم المحلية وقواعد الاتصال التسويقي.
    `,
  },
};
