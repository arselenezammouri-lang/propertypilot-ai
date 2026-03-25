/**
 * ES–AR for AI Voice docs (IT/EN in doc-content.ts).
 */

import type { DocArticleMultilingual } from '@/lib/docs/doc-article';

type ExtraLocales = Pick<DocArticleMultilingual, 'es' | 'fr' | 'de' | 'pt' | 'ar'>;

export const docAiVoiceVoiceSetupLocales: ExtraLocales = {
  es: {
    title: 'Configuración de llamadas IA',
    content: `
# Configuración de llamadas IA

Las llamadas salientes usan **Bland AI** (o la integración de voz activa en tu plan). Aquí defines quién eres, qué dices y cómo queda registrado el resultado.

## Antes de llamar

1. Comprueba que la **clave API** y el remitente/número estén configurados en workspace o entorno (solo admin).
2. Elige **idioma y mercado** alineados con el propietario (como el selector de idioma de la app).
3. Haz una **llamada corta de prueba** a un número interno antes del primer contacto real.

## Guiones y cumplimiento

- Usa solo **datos públicos** del anuncio e información que tendrías en una llamada normal.
- Respeta el **opt-out** y la normativa de llamadas comerciales de tu país.
- Anota resultado y siguiente paso en el **CRM** justo después.
    `,
  },
  fr: {
    title: 'Configuration des appels IA',
    content: `
# Configuration des appels IA

Les appels sortants passent par **Bland AI** (ou l’intégration vocale active sur votre offre). Vous y définissez identité, message et traçabilité des résultats.

## Avant d’appeler

1. Vérifiez **clé API** et identité expéditeur dans le workspace ou l’environnement (admin).
2. Choisissez **langue et marché** cohérents avec le propriétaire (sélecteur de langue de l’app).
3. Effectuez un **appel test court** vers un numéro interne avant la prospection réelle.

## Scripts et conformité

- N’utilisez que des **données publiques** d’annonce et ce qu’aurait un agent en appel normal.
- Respectez **opt-out** et règles de démarchage téléphonique locales.
- Enregistrez l’issue et la suite dans le **CRM** immédiatement après.
    `,
  },
  de: {
    title: 'KI-Anruf einrichten',
    content: `
# KI-Anruf einrichten

Ausgehende Anrufe nutzen **Bland AI** (oder die aktive Voice-Integration Ihres Tarifs). Hier legen Sie Identität, Inhalt und Protokollierung fest.

## Vor dem Wählen

1. **API-Schlüssel** und Absender in Workspace/Umgebung prüfen (Admin).
2. **Sprache und Markt** passend zum Eigentümer wählen (wie Sprachwahl in der App).
3. **Kurzen Testanruf** auf eine interne Nummer vor erstem Echt-Kontakt.

## Skripte & Compliance

- Nur **öffentliche Inseratsdaten** und Infos, die auch ein normaler Anruf hätte.
- **Opt-out** und Telefon-Marketing-Rechte einhalten.
- Ergebnis und Next Step direkt im **CRM** dokumentieren.
    `,
  },
  pt: {
    title: 'Configuração de chamadas IA',
    content: `
# Configuração de chamadas IA

As chamadas de saída usam **Bland AI** (ou a integração de voz ativa no seu plano). Aqui define quem é, o que diz e como fica registado o resultado.

## Antes de ligar

1. Confirme **chave API** e identidade do remetente no workspace ou ambiente (admin).
2. Escolha **idioma e mercado** alinhados com o proprietário (seletor da app).
3. Faça uma **chamada de teste curta** para um número interno antes do primeiro contacto real.

## Guiões e conformidade

- Use apenas **dados públicos** do anúncio e o que teria numa chamada normal.
- Respeite **opt-out** e regras de chamadas comerciais no seu país.
- Registe resultado e próximo passo no **CRM** logo a seguir.
    `,
  },
  ar: {
    title: 'إعداد المكالمات بالذكاء الاصطناعي',
    content: `
# إعداد المكالمات بالذكاء الاصطناعي

تستخدم المكالمات الصادرة **Bland AI** (أو تكامل الصوت الفعّال في خطتك). هنا تضبط الهوية والنص وتسجيل النتيجة.

## قبل الاتصال

1. تأكد من **مفتاح API** وهوية المرسل في مساحة العمل أو البيئة (للمسؤول).
2. اختر **اللغة والسوق** بما يتوافق مع المالك (مثل محدد اللغة في التطبيق).
3. نفّذ **مكالمة اختبار قصيرة** إلى رقم داخلي قبل أول تواصل حقيقي.

## النصوص والامتثال

- استخدم فقط **بيانات الإعلان العلنية** وما كان سيستخدمه وسيط في مكالمة عادية.
- احترم **الانسحاب** وقواعد الاتصال التسويقي في بلدك.
- سجّل النتيجة والخطوة التالية في **CRM** مباشرة بعد المكالمة.
    `,
  },
};

export const docAiVoiceCallScriptsLocales: ExtraLocales = {
  es: {
    title: 'Guiones de llamada personalizados',
    content: `
# Guiones para conseguir mandatos

Un guion claro convierte la prospección fría en visitas concertadas.

## Plantilla base

"Hola, llamo por el anuncio en [Ubicación]. Podríamos tener un comprador cualificado — ¿le vendría bien una visita corta esta semana?"

## Variantes

- **Brecha de mercado**: potencial frente a comparables recientes
- **Tras una bajada de precio**: he visto el nuevo precio…
- **Urgencia**: el inmueble lleva tiempo publicado…
    `,
  },
  fr: {
    title: 'Scripts d’appel personnalisés',
    content: `
# Scripts pour obtenir des mandats

Un script clair transforme la prospection froide en rendez-vous.

## Modèle de base

« Bonjour, j’appelle au sujet de l’annonce [Lieu]. Nous pourrions avoir un acheteur qualifié — seriez-vous ouvert à une courte visite cette semaine ? »

## Variantes

- **Écart marché** : potentiel vs comparables récents
- **Après baisse de prix** : j’ai vu votre repositionnement…
- **Urgence** : le bien est en ligne depuis…
    `,
  },
  de: {
    title: 'Individuelle Gesprächsskripte',
    content: `
# Skripte für Mandate

Ein klares Skript macht aus Kaltakquise Termine.

## Basisvorlage

„Guten Tag, ich rufe wegen des Inserats in [Ort] an. Wir haben möglicherweise einen qualifizierten Käufer — wäre ein kurzer Besichtigungstermin diese Woche möglich?“

## Varianten

- **Marktlücke**: Potenzial vs. aktuelle Vergleichswerte
- **Nach Preissenkung**: ich habe die neue Positionierung gesehen…
- **Dringlichkeit**: das Objekt steht seit… online
    `,
  },
  pt: {
    title: 'Guiões de chamada personalizados',
    content: `
# Guiões para obter mandatos

Um guião claro transforma contacto frio em marcações.

## Modelo base

"Olá, ligo sobre o anúncio em [Local]. Podemos ter um comprador qualificado — estaria disponível para uma visita breve esta semana?"

## Variantes

- **Gap de mercado**: potencial face a comparáveis recentes
- **Após queda de preço**: vi o novo preço…
- **Urgência**: o imóvel está online há…
    `,
  },
  ar: {
    title: 'نصوص مكالمات مخصصة',
    content: `
# نصوص للحصول على تفويضات

النص الواضح يحوّل الاتصال البارد إلى مواعيد.

## قالب أساسي

«مرحباً، أتصل بخصوص الإعلان في [الموقع]. قد يكون لدينا مشتري مؤهل — هل يمكن جدولة زيارة قصيرة هذا الأسبوع؟»

## متغيرات

- **فجوة السوق**: مقارنة بالصفقات المماثلة
- **بعد خفض السعر**: لاحظت إعادة التسعير…
- **إلحاح**: العقار معروض منذ…
    `,
  },
};

export const docAiVoiceObstacleLocales: ExtraLocales = {
  es: {
    title: 'Gestión de objeciones',
    content: `
# Gestión de objeciones

El propietario suele oponerse en **precio**, **plazo** o **confianza**. La IA puede sugerir respuestas; el tono humano sigue siendo clave.

## Objeciones frecuentes

- **«No vendo / lo pienso»**: pide permiso para volver a llamar con un dato de mercado (comparables, días online).
- **«Ya tengo agente»**: respeta la relación; ofrece solo una segunda opinión o un comprador real si existe.
- **«El precio es bajo»**: ancla en Market Gap o rango de zona, sin prometer resultados.

## Flujo sugerido

1. **Escucha** sin interrumpir.
2. **Reformula** («Si entendí bien, la duda es…»).
3. **Propón un micro-paso** (visita, envío de comparables, llamada con fecha fija).

## Nota

Revisa siempre el texto sugerido por la IA antes de enviar mensajes o asumir compromisos.
    `,
  },
  fr: {
    title: 'Gestion des objections',
    content: `
# Gestion des objections

Le propriétaire bloque souvent sur **prix**, **délai** ou **confiance**. L’IA peut proposer des réponses — votre ton humain reste décisif.

## Objections fréquentes

- **« Je ne vends pas / je réfléchis »** : demander la permission de rappeler avec un fait de marché (comps, jours en ligne).
- **« J’ai déjà un agent »** : respecter le lien ; proposer seulement un second avis ou un acheteur réel.
- **« Prix trop bas »** : ancrer sur Market Gap ou fourchettes locales, sans promesse d’issue.

## Déroulé conseillé

1. **Écouter** sans couper.
2. **Reformuler** (« Si je comprends, le sujet est… »).
3. **Proposer un micro-pas** (visite, comps par e-mail, rappel à date fixe).

## Note

Toujours **relire** les suggestions IA avant envoi ou engagement.
    `,
  },
  de: {
    title: 'Einwandbehandlung',
    content: `
# Einwandbehandlung

Eigentümer blocken oft bei **Preis**, **Timing** oder **Vertrauen**. Die KI kann Antworten vorschlagen — Ihr menschlicher Ton entscheidet.

## Häufige Einwände

- **„Verkaufe nicht / überlege“**: Erlaubnis für Rückruf mit einem Marktfakt (Vergleichswerte, Tage online).
- **„Habe schon einen Makler“**: Beziehung respektieren; nur zweite Meinung oder echten Käufer anbieten.
- **„Preis zu niedrig“**: mit Market Gap oder Bandbreiten argumentieren — keine Erfolgsgarantie.

## Ablauf

1. **Zuhören** ohne zu unterbrechen.
2. **Spiegeln** („Wenn ich Sie richtig verstehe, geht es um…“).
3. **Kleinen nächsten Schritt** anbieten (Besichtigung, Comps per Mail, Rückruf mit Datum).

## Hinweis

KI-Texte immer **prüfen**, bevor Sie Nachrichten senden oder Zusagen machen.
    `,
  },
  pt: {
    title: 'Gestão de objeções',
    content: `
# Gestão de objeções

O proprietário costuma resistir em **preço**, **prazo** ou **confiança**. A IA pode sugerir respostas — o tom humano continua essencial.

## Objeções frequentes

- **«Não vendo / estou a pensar»**: peça permissão para voltar a ligar com um dado de mercado (comparáveis, dias online).
- **«Já tenho agente»**: respeite a relação; ofereça só segunda opinião ou comprador real.
- **«Preço baixo demais»**: ancora em Market Gap ou faixas da zona, sem prometer resultado.

## Fluxo sugerido

1. **Ouça** sem interromper.
2. **Reformule** («Se percebi bem, a questão é…»).
3. **Proponha um micro-passo** (visita, comparáveis por email, chamada com data).

## Nota

Revise sempre o texto sugerido pela IA antes de enviar ou assumir compromissos.
    `,
  },
  ar: {
    title: 'التعامل مع الاعتراضات',
    content: `
# التعامل مع الاعتراضات

غالباً يعترض المالك على **السعر** أو **التوقيت** أو **الثقة**. يمكن للذكاء الاصطناعي اقتراح ردود — لكن نبرتك البشرية تحسم الأمر.

## اعتراضات شائعة

- **«لا أبيع / أفكر»**: اطلب الإذن بالمعاودة مع حقيقة سوقية (مقارنات، أيام العرض).
- **«لدي وسيط»**: احترم العلاقة؛ اعرض رأياً ثانياً أو مشترياً حقيقياً فقط.
- **«السعر منخفض»**: اربط بـ Market Gap أو نطاق المنطقة دون ضمان نتيجة.

## تسلسل مقترح

1. **استمع** دون مقاطعة.
2. **أعد صياغة** الاعتراض («إن فهمتك، القلق هو…»).
3. **اقترح خطوة صغيرة** (زيارة، مقارنات بالبريد، معاودة بتاريخ محدد).

## ملاحظة

راجع دائماً نصوص الذكاء الاصطناعي قبل الإرسال أو الالتزام.
    `,
  },
};
