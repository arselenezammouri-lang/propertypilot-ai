/**
 * ES–AR for Commercial Intelligence + Territory Commander docs (IT/EN in doc-content.ts).
 */

import type { DocArticleMultilingual } from '@/lib/docs/doc-article';

type ExtraLocales = Pick<DocArticleMultilingual, 'es' | 'fr' | 'de' | 'pt' | 'ar'>;

export const docCommercialGuideLocales: ExtraLocales = {
  es: {
    title: 'Análisis de inmuebles comerciales',
    content: `
# Análisis de inmuebles comerciales

La vista **comercial** resume usos posibles, señales de mercado y **brechas** entre oferta y demanda en la zona.

## Qué revisar

- **Tipología y superficie útil**: adecuación a retail, hostelería, oficina ligera o mixto según normativa local.
- **Ficha y fotos**: escaparate, accesos, alturas libres, instalaciones visibles.
- **Comparables comerciales**: rentas, rotación y referencias de la calle o polígono.

## Cómo usarlo en la conversación

1. Prepara **2–3 datos** concretos (tráfico peatonal, competencia, precio/m²) antes de llamar al propietario.
2. Enlaza con **prospección**: si el gap es alto, úsalo como gancho sin prometer ocupación.
3. Anota en el **CRM** hipótesis de uso y próxima verificación urbanística si aplica.

## Límites

La IA **no sustituye** informe técnico ni asesoramiento legal: confirma usos y cargas con técnico y ayuntamiento.
    `,
  },
  fr: {
    title: 'Analyse immobilière commerciale',
    content: `
# Analyse immobilière commerciale

La vue **commerciale** synthétise les usages possibles, les signaux marché et les **écarts** entre offre et demande locale.

## Points à examiner

- **Typologie et surface utile**: adéquation retail, restauration, bureaux légers ou mixte selon le droit local.
- **Annonce et photos**: vitrine, accès, hauteur sous plafond, équipements visibles.
- **Commerces comparables**: loyers, rotation, références rue ou zone d’activité.

## Utilisation en rendez-vous

1. Préparez **2–3 faits** (flux piétons, concurrence, prix/m²) avant d’appeler le propriétaire.
2. Croisez avec la **prospection**: un fort écart peut ouvrir la discussion sans promesse d’occupation.
3. Notez dans le **CRM** l’hypothèse d’usage et la prochaine vérif urbanistique si besoin.

## Limites

L’IA **ne remplace** ni expertise technique ni conseil juridique: validez usages et charges avec des professionnels.
    `,
  },
  de: {
    title: 'Gewerbeimmobilien-Analyse',
    content: `
# Gewerbeimmobilien-Analyse

Die **Commercial**-Ansicht fasst mögliche Nutzungen, Marktsignale und **Lücken** zwischen Angebot und Nachfrage zusammen.

## Prüfpunkte

- **Typologie und Nutzfläche**: Einzelhandel, Gastronomie, leichte Büros oder Mix nach lokalem Recht.
- **Exposé und Fotos**: Schaufenster, Zugang, lichte Höhe, sichtbare Anlagen.
- **Vergleichsobjekte**: Mieten, Fluktuation, Referenzen Straße oder Gewerbegebiet.

## Im Gespräch

1. **2–3 harte Fakten** (Fußgängerfluss, Wettbewerb, €/m²) vor dem Eigentümer-Call vorbereiten.
2. Mit **Prospecting** verzahnen: große Lücke als Gesprächseinstieg, ohne Belegungsgarantie.
3. Im **CRM** Nutzungshypothese und ggf. nächsten Bauamt-Check festhalten.

## Grenzen

KI **ersetzt** keine Gutachten und keine Rechtsberatung: Nutzungen und Lasten mit Experten klären.
    `,
  },
  pt: {
    title: 'Análise de imóveis comerciais',
    content: `
# Análise de imóveis comerciais

A vista **comercial** resume usos possíveis, sinais de mercado e **lacunas** entre oferta e procura na zona.

## O que analisar

- **Tipologia e área útil**: adequação a retalho, restauração, escritórios leves ou misto conforme o ordenamento local.
- **Ficha e fotos**: montra, acessos, pé-direito, equipamentos visíveis.
- **Comparáveis**: rendas, rotatividade, referências na rua ou zona.

## Na conversa

1. Tenha **2–3 dados** (fluxo pedonal, concorrência, preço/m²) antes de contactar o proprietário.
2. Cruze com **prospeção**: gap elevado como gancho, sem prometer ocupação.
3. Registe no **CRM** a hipótese de uso e próxima verificação urbanística se necessário.

## Limitações

A IA **não substitui** parecer técnico nem assessoria jurídica: confirme usos e encargos com especialistas.
    `,
  },
  ar: {
    title: 'تحليل العقارات التجارية',
    content: `
# تحليل العقارات التجارية

يعرض الوضع **التجاري** الاستخدامات المحتملة وإشارات السوق و**الفجوات** بين العرض والطلب محلياً.

## ما تراجعه

- **النوع والمساحة الصافية**: ملاءمة للتجزئة أو المطاعم أو مكاتب خفيفة أو مختلط حسب التنظيم المحلي.
- **الإعلان والصور**: واجهة، مداخل، ارتفاع حر، تجهيزات ظاهرة.
- **مقارنات تجارية**: إيجارات، دوران، مراجع في الشارع أو المنطقة.

## في الحديث

1. جهّز **2–3 حقائق** (حركة المشاة، منافسة، سعر/م²) قبل الاتصال بالمالك.
2. اربط مع **التسويق**: فجوة كبيرة كمدخل دون وعد بالإشغال.
3. سجّل في **CRM** فرضية الاستخدام والتحقق التخطيطي إن لزم.

## حدود

الذكاء الاصطناعي **لا يغني** عن تقرير فني أو استشارة قانونية: أكّد الاستخدامات والأعباء مع مختصين.
    `,
  },
};

export const docCommercialBusinessLocales: ExtraLocales = {
  es: {
    title: 'Funciones clave para uso comercial',
    content: `
# Funciones clave para uso comercial

Estas señales ayudan a **clasificar** locales y a preparar preguntas al propietario o al técnico.

## Qué detecta el producto (cuando aplica)

- **Salida de humos / extracción**: relevante para hostelería; confirma normativa y instalación real.
- **Escaparate y lineal de fachada**: visibilidad y acceso peatonal.
- **Categoría de uso** (ej. equivalentes a clases C en algunos mercados): cruce con planeamiento urbano.

## Buenas prácticas

1. No asumas **licencia de actividad** solo por la ficha: verifica con el ayuntamiento.
2. Fotografía o visita **in situ** lo que la IA marque como «posible».
3. Documenta en el **CRM** cada hallazgo con fuente (foto, enlace, nota de llamada).

## Mercados distintos

Italia, España, Francia o EEUU usan **nomenclaturas distintas**: adapta el lenguaje al cliente y al asesor legal local.
    `,
  },
  fr: {
    title: 'Fonctions clés pour l’usage commercial',
    content: `
# Fonctions clés pour l’usage commercial

Ces signaux aident à **classer** les locaux et à préparer vos questions propriétaire / expert.

## Ce que le produit peut mettre en avant

- **Sortie de fumée / extraction**: pertinent pour la restauration; vérifier normes et installation réelle.
- **Vitrine et linéaire façade**: visibilité et accès piétons.
- **Catégorie d’usage** (selon marché): croiser avec l’urbanisme.

## Bonnes pratiques

1. Ne déduisez pas une **licence d’exploitation** depuis seulement l’annonce.
2. Confirmez sur place ce que l’IA qualifie de « probable ».
3. Documentez dans le **CRM** chaque élément avec source (photo, lien, compte-rendu).

## Marchés différents

Italie, Espagne, France ou US n’utilisent pas les **mêmes codes**: adaptez le vocabulaire au juriste local.
    `,
  },
  de: {
    title: 'Wichtige Merkmale für Gewerbenutzung',
    content: `
# Wichtige Merkmale für Gewerbenutzung

Diese Hinweise helfen, Flächen **einzustufen** und Fragen an Eigentümer oder Gutachter vorzubereiten.

## Was das Produkt hervorheben kann

- **Abgas / Lüftung**: relevant für Gastronomie; Normen und Ist-Installation prüfen.
- **Schaufenster und Fassadenlinie**: Sichtbarkeit und Fußgängerzugang.
- **Nutzungskategorie** (marktabhängig): mit Bebauungsplan abgleichen.

## Best Practices

1. **Gewerbeanmeldung** nicht nur aus dem Inserat ableiten.
2. Vor-Ort prüfen, was die KI als « wahrscheinlich » markiert.
3. Im **CRM** jede Info mit Quelle festhalten (Foto, Link, Notiz).

## Unterschiedliche Märkte

IT, ES, FR, US haben **unterschiedliche Klassifikationen**: Begriffe an lokale Juristen anpassen.
    `,
  },
  pt: {
    title: 'Funcionalidades-chave para uso comercial',
    content: `
# Funcionalidades-chave para uso comercial

Estes sinais ajudam a **classificar** espaços e a preparar perguntas ao proprietário ou perito.

## O que o produto pode destacar

- **Chaminé / extração**: relevante para restauração; confirmar normas e instalação real.
- **Montra e linha de fachada**: visibilidade e acesso pedonal.
- **Categoria de uso** (conforme mercado): cruzar com o ordenamento.

## Boas práticas

1. Não infira **licença de atividade** só pelo anúncio.
2. Valide no local o que a IA marcar como «provável».
3. Documente no **CRM** cada ponto com fonte (foto, link, nota).

## Mercados diferentes

IT, ES, FR, EUA usam **nomenclaturas diferentes**: adapte ao assessor jurídico local.
    `,
  },
  ar: {
    title: 'ميزات رئيسية للاستخدام التجاري',
    content: `
# ميزات رئيسية للاستخدام التجاري

تساعد هذه الإشارات على **تصنيف** المساحات وتحضير أسئلة للمالك أو الخبير.

## ما يمكن للمنتج إبرازه

- **مدخنة / عادم**: مهم للمطاعم؛ تحقق من المعايير والتركيب الفعلي.
- **واجهة وعرض واجهة**: وضوح ووصول المشاة.
- **فئة الاستخدام** (حسب السوق): طابق مع التخطيط الحضري.

## أفضل الممارسات

1. لا تستنتج **رخصة نشاط** من الإعلان وحده.
2. تأكد ميدانياً مما تصفه الذكاء الاصطناعي ب«محتمل».
3. وثّق في **CRM** كل نقطة مع المصدر (صورة، رابط، ملاحظة).

## أسواق مختلفة

إيطاليا وإسبانيا وفرنسا والولايات المتحدة تستخدم **تسميات مختلفة**: كيّف المصطلحات مع مستشارك المحلي.
    `,
  },
};

export const docTerritoryGuideLocales: ExtraLocales = {
  es: {
    title: 'Análisis del territorio',
    content: `
# Análisis del territorio

El módulo **Territory** sintetiza **demanda**, **perfil del barrio** y **velocidad de venta** para priorizar zonas y argumentos con propietarios.

## Qué mirar

- **Presión de demanda**: interés relativo frente a inventario o histórico de la zona.
- **ADN del barrio**: tipo de comprador, mix uso residencial/comercial, estacionalidad si aplica.
- **Velocidad**: días medios de venta o alquiler como referencia (no garantía).

## Cómo aplicarlo

1. Cruza territorio con **listados concretos** que ya sigues en prospección.
2. Usa **2 métricas** como máximo en la primera conversación para no abrumar.
3. Actualiza la narrativa cuando cambien tipos impositivos o nuevas promociones en la zona.

## Precisión

Los datos son **orientativos** y dependen de fuentes y mercado: valida con transacciones recientes y tu red local.
    `,
  },
  fr: {
    title: 'Analyse du territoire',
    content: `
# Analyse du territoire

Le module **Territory** résume **demande**, **profil de quartier** et **vélocité** pour prioriser zones et arguments face aux propriétaires.

## Indicateurs

- **Pression de la demande** vs stock ou historique local.
- **ADN du quartier**: profil acheteur, mix résidentiel/commercial, saisonnalité.
- **Vélocité**: jours moyens de vente ou location (indicateur, pas promesse).

## Mise en pratique

1. Croiser avec des **annonces** déjà suivies en prospection.
2. **Deux métriques max** au premier échange pour rester clair.
3. Actualiser le discours si fiscalité ou offre neuve bougent.

## Fiabilité

Données **indicatives**, sources et marché variables: validez avec transactions récentes et réseau local.
    `,
  },
  de: {
    title: 'Gebietsanalyse',
    content: `
# Gebietsanalyse

Das **Territory**-Modul fasst **Nachfrage**, **Quartiersprofil** und **Verkaufsgeschwindigkeit** zusammen, um Gebiete und Argumente zu priorisieren.

## Kennzahlen

- **Nachfragedruck** vs. Bestand oder Historie.
- **Quartiers-DNA**: Käuferprofil, Wohn-/Gewerbemix, Saisonalität.
- **Geschwindigkeit**: durchschnittliche Tage bis Verkauf/Miete (Richtwert).

## Anwendung

1. Mit **konkreten Objekten** aus der Akquise verknüpfen.
2. Beim ersten Gespräch **höchstens zwei Kennzahlen** nennen.
3. Erzählung anpassen bei Steueränderungen oder Neubau in der Zone.

## Genauigkeit

Daten sind **indikativ**; mit aktuellen Abschlüssen und lokalem Netzwerk abgleichen.
    `,
  },
  pt: {
    title: 'Análise do território',
    content: `
# Análise do território

O módulo **Territory** resume **procura**, **perfil do bairro** e **velocidade de transação** para priorizar zonas e argumentos com proprietários.

## O que observar

- **Pressão de procura** face a stock ou histórico local.
- **ADN do bairro**: perfil de comprador, misto residencial/comercial, sazonalidade.
- **Velocidade**: dias médios até venda ou arrendamento (referência, não garantia).

## Na prática

1. Cruze com **anúncios** que já acompanha na prospeção.
2. No primeiro contacto, **no máximo duas métricas**.
3. Atualize a narrativa com mudanças fiscais ou nova oferta na zona.

## Precisão

Dados **orientativos**; valide com transações recentes e rede local.
    `,
  },
  ar: {
    title: 'تحليل الإقليم',
    content: `
# تحليل الإقليم

يلخص قسم **الإقليم** **الطلب** و**هوية الحي** و**سرعة التداول** لترتيب الأولويات والحجج مع المالكين.

## مؤشرات

- **ضغط الطلب** مقابل المخزون أو التاريخ المحلي.
- **هوية الحي**: ملف المشتري، المزيج سكني/تجاري، موسمية.
- **السرعة**: متوسط الأيام حتى البيع أو الإيجار (مؤشر لا ضمان).

## التطبيق

1. اربط مع **إعلانات** تتابعها في التسويق.
2. في أول حديث **مقياسان كحد أقصى** لعدم الإرباك.
3. حدّث السرد عند تغيّر الضرائب أو عروض جديدة في المنطقة.

## الدقة

البيانات **إرشادية**؛ صحّحها بصفقات حديثة وشبكتك المحلية.
    `,
  },
};

export const docTerritoryMapLocales: ExtraLocales = {
  es: {
    title: 'Uso del mapa táctico',
    content: `
# Uso del mapa táctico

El **mapa táctico** muestra oportunidades y operaciones en el territorio para decidir **dónde** concentrar visitas y llamadas.

## Navegación

- **Zoom y capas**: alterna entre heat, pins o listas según el producto.
- **Selección**: abre el detalle del inmueble o lead desde el pin para no perder contexto.
- **Filtros**: aplica precio, gap, estado del lead o radio para reducir ruido.

## Flujo de trabajo

1. Elige una **zona objetivo** al inicio de la sesión (barrio o radio).
2. Marca en el **CRM** los pins contactados para no duplicar esfuerzos en el equipo.
3. Combina mapa con **pipeline**: arrastra el lead cuando haya visita o oferta real.

## Rendimiento

En móvil, prioriza **listas** si la cobertura es mala; el mapa consume más datos.
    `,
  },
  fr: {
    title: 'Utilisation de la carte tactique',
    content: `
# Utilisation de la carte tactique

La **carte tactique** positionne opportunités et dossiers pour décider **où** concentrer déplacements et appels.

## Navigation

- **Zoom et couches**: heatmap, repères ou listes selon le produit.
- **Sélection**: ouvrez le détail bien/lead depuis le marqueur.
- **Filtres**: prix, gap, statut lead ou rayon pour réduire le bruit.

## Flux de travail

1. Fixez une **zone cible** en début de session (quartier ou rayon).
2. Marquez dans le **CRM** les points déjà contactés pour éviter les doublons d’équipe.
3. Croisez avec la **pipeline** après visite ou offre réelle.

## Performance

Sur mobile, préférez les **listes** si le réseau est faible; la carte est plus gourmande.
    `,
  },
  de: {
    title: 'Nutzung der taktischen Karte',
    content: `
# Nutzung der taktischen Karte

Die **taktische Karte** zeigt Chancen und Vorgänge im Gebiet — wo Sie **Vor-Ort-Termine** und Anrufe bündeln.

## Bedienung

- **Zoom & Ebenen**: Heatmap, Pins oder Listen je nach Produkt.
- **Auswahl**: Objekt- oder Lead-Detail vom Pin öffnen.
- **Filter**: Preis, Gap, Lead-Status oder Radius gegen Rauschen.

## Ablauf

1. **Zielzone** zu Sitzungsbeginn festlegen (Stadtteil oder Radius).
2. Im **CRM** kontaktierte Pins markieren — keine Doppelarbeit im Team.
3. Mit **Pipeline** verknüpfen nach Besichtigung oder Angebot.

## Performance

Auf dem Handy bei schlechtem Netz **Listen** bevorzugen; Karte verbraucht mehr Daten.
    `,
  },
  pt: {
    title: 'Uso do mapa tático',
    content: `
# Uso do mapa tático

O **mapa tático** mostra oportunidades e negócios no terreno para decidir **onde** concentrar visitas e chamadas.

## Navegação

- **Zoom e camadas**: calor, pins ou listas conforme o produto.
- **Seleção**: abra detalhe do imóvel ou lead a partir do pin.
- **Filtros**: preço, gap, estado do lead ou raio para menos ruído.

## Fluxo

1. Defina uma **zona-alvo** no início da sessão (bairro ou raio).
2. Marque no **CRM** os pins já contactados para evitar duplicação na equipa.
3. Cruze com a **pipeline** após visita ou proposta real.

## Desempenho

Em mobile, prefira **listas** com rede fraca; o mapa consome mais dados.
    `,
  },
  ar: {
    title: 'استخدام الخريطة التكتيكية',
    content: `
# استخدام الخريطة التكتيكية

تعرض **الخريطة التكتيكية** الفرص والصفقات لتحديد **أين** تركز الزيارات والمكالمات.

## التنقل

- **تكبير وطبقات**: خريطة حرارية أو دبابيس أو قوائم حسب المنتج.
- **اختيار**: افتح تفاصيل العقار أو العميل من العلامة.
- **مرشحات**: السعر، الفجوة، حالة العميل أو نصف القطر لتقليل الضوضاء.

## سير العمل

1. حدد **منطقة هدف** في بداية الجلسة (حي أو نطاق).
2. سجّل في **CRM** النقاط التي تم الاتصال بها لتفادي التكرار بين الفريق.
3. اربط مع **مسار العمل** بعد زيارة أو عرض حقيقي.

## الأداء

على الجوال مع شبكة ضعيفة فضّل **القوائم**؛ الخريطة تستهلك بيانات أكثر.
    `,
  },
};
