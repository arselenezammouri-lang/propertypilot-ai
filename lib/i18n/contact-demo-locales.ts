/**
 * /demo and /contatti (contact). IT/EN: dictionary.ts.
 */

export type DemoPageUi = {
  nav: { pricing: string; login: string; startFree: string };
  hero: { badge: string; title: string; subtitle: string };
  calendly: {
    chooseDate: string;
    demoFree: string;
    preferContact: string;
    whatsapp: string;
    sendEmail: string;
  };
  whatsappPrefill: string;
  calendlyIframeTitle: string;
  valuePoints: { sectionTitle: string; sectionSubtitle: string; bookNow: string };
  valuePointsList: Array<{ title: string; description: string }>;
  testimonials: { title: string; subtitle: string };
  testimonialsList: Array<{ name: string; role: string; quote: string }>;
  trustStats: Array<{
    iconKey: 'clock' | 'shield' | 'users' | 'trendingUp';
    value: string;
    label: string;
  }>;
  finalCta: {
    titleLead: string;
    titleAccent: string;
    titleTail: string;
    subtitle: string;
    bookDemo: string;
  };
  footer: { home: string; pricing: string; contact: string; login: string };
  footerCopyrightLine: string;
};

export type ContactPageUi = {
  title: string;
  subtitle: string;
  support: { title: string; desc: string };
  sales: { title: string; desc: string };
  demo: { title: string; desc: string; cta: string };
  form: {
    title: string;
    name: string;
    email: string;
    subject: string;
    message: string;
    namePlaceholder: string;
    emailPlaceholder: string;
    subjectPlaceholder: string;
    messagePlaceholder: string;
    submit: string;
  };
  validation: {
    nameMin: string;
    emailInvalid: string;
    messageMin: string;
    checkFields: string;
  };
  toast: {
    successTitle: string;
    successDesc: string;
    errorTitle: string;
    errorDesc: string;
    validationTitle: string;
  };
  home: string;
  headerTagline: string;
  demoMailSubject: string;
  minCharsCounter: string;
  submitting: string;
};

const footerCopyright = '© {year} PropertyPilot AI. {rights}';

const taglineEs = 'Lleva tu agencia al siguiente nivel';
const taglineFr = 'Faites passer votre agence au niveau supérieur';
const taglineDe = 'Bringen Sie Ihre Agentur auf das nächste Level';
const taglinePt = 'Leve a sua agência ao próximo nível';
const taglineAr = 'ارتقِ بوكالتك إلى المستوى التالي';

export const demoUiEs: DemoPageUi = {
  nav: { pricing: 'Precios', login: 'Iniciar sesión', startFree: 'Empezar gratis' },
  hero: {
    badge: 'Reserva en 30 segundos',
    title: 'Reserva una demo gratuita',
    subtitle:
      'Descubre cómo PropertyPilot AI puede transformar tu agencia inmobiliaria. 30 minutos con un experto para ver la plataforma en acción.',
  },
  calendly: {
    chooseDate: 'Elige fecha y hora',
    demoFree: 'Demo gratuita de 30 minutos',
    preferContact: '¿Prefieres contactarnos directamente?',
    whatsapp: 'WhatsApp',
    sendEmail: 'Enviar email',
  },
  whatsappPrefill: '¡Hola! Me gustaría reservar una demo de PropertyPilot AI.',
  calendlyIframeTitle: 'Reservar demo PropertyPilot AI',
  valuePoints: {
    sectionTitle: 'Qué verás en la demo',
    sectionSubtitle:
      'Una visión completa de las funciones que harán tu agencia más eficiente.',
    bookNow: 'Reserva tu demo ahora',
  },
  valuePointsList: [
    {
      title: 'IA generativa avanzada',
      description:
        'Crea anuncios profesionales, títulos A/B, descripciones SEO y contenido de marketing en segundos.',
    },
    {
      title: 'CRM 4.0 dinámico',
      description:
        'Gestiona leads con pipeline Kanban, lead scoring IA y enriquecimiento automático.',
    },
    {
      title: 'Automatizaciones inteligentes',
      description:
        'Más de 20 automatizaciones IA para seguimiento, email, WhatsApp y gestión de leads sin fricción.',
    },
    {
      title: 'Lead scoring IA',
      description:
        'Identifica los leads más calientes con puntuaciones 0-100 y prioriza tu actividad.',
    },
    {
      title: 'Communication Hub',
      description:
        'Email, SMS y WhatsApp integrados en un solo panel con plantillas IA.',
    },
    {
      title: 'Branding personalizado',
      description:
        'PDF white-label, fichas inmobiliarias profesionales y materiales con tu marca.',
    },
  ],
  testimonials: {
    title: 'Lo que dicen nuestros clientes',
    subtitle: 'Agentes y agencias que ya transformaron su negocio con PropertyPilot AI',
  },
  testimonialsList: [
    {
      name: 'Marco R.',
      role: 'Agente inmobiliario, Milán',
      quote:
        'PropertyPilot AI cambió por completo mi forma de trabajar. Creo anuncios en 30 segundos en lugar de 30 minutos.',
    },
    {
      name: 'Laura B.',
      role: 'Directora de agencia, Roma',
      quote:
        'El CRM y las automatizaciones me ahorran horas cada semana. Lo recomiendo a cualquier agencia seria.',
    },
    {
      name: 'Giuseppe T.',
      role: 'Property manager, Nápoles',
      quote:
        'Por fin una plataforma que entiende lo que las agencias necesitan de verdad. Soporte excepcional.',
    },
  ],
  trustStats: [
    { iconKey: 'clock', value: '30 min', label: 'Demo gratuita' },
    { iconKey: 'shield', value: '100%', label: 'Sin compromiso' },
    { iconKey: 'users', value: '500+', label: 'Clientes satisfechos' },
    { iconKey: 'trendingUp', value: '+40%', label: 'Productividad media' },
  ],
  finalCta: {
    titleLead: '¿Listo para ',
    titleAccent: 'transformar',
    titleTail: ' tu agencia?',
    subtitle:
      'Reserva ahora tu demo gratuita y descubre cómo PropertyPilot AI puede multiplicar tus ventas.',
    bookDemo: 'Reservar demo gratuita',
  },
  footer: { home: 'Inicio', pricing: 'Precios', contact: 'Contacto', login: 'Iniciar sesión' },
  footerCopyrightLine: footerCopyright,
};

export const contactUiEs: ContactPageUi = {
  title: 'Contáctanos',
  subtitle: 'Estamos aquí para ayudarte. Escríbenos para cualquier consulta.',
  support: {
    title: 'Soporte al cliente',
    desc: '¿Necesitas ayuda técnica o tienes dudas sobre tu cuenta? Nuestro equipo está listo para ayudarte.',
  },
  sales: {
    title: 'Consultas comerciales',
    desc: '¿Interesado en planes Business o Enterprise? Hablemos de las necesidades de tu empresa.',
  },
  demo: {
    title: '¿Quieres una demo?',
    desc: 'Descubre cómo PropertyPilot AI puede transformar tu negocio inmobiliario. Reserva una demo gratuita con nuestro equipo.',
    cta: 'Reservar demo gratuita',
  },
  form: {
    title: 'Envíanos un mensaje',
    name: 'Nombre',
    email: 'Email',
    subject: 'Asunto',
    message: 'Mensaje',
    namePlaceholder: 'Tu nombre',
    emailPlaceholder: 'tu@email.com',
    subjectPlaceholder: 'Asunto del mensaje',
    messagePlaceholder: 'Escribe tu mensaje aquí...',
    submit: 'Enviar mensaje',
  },
  validation: {
    nameMin: 'El nombre debe tener al menos 2 caracteres',
    emailInvalid: 'Introduce un email válido',
    messageMin: 'El mensaje debe tener al menos 10 caracteres',
    checkFields: 'Revisa los campos marcados.',
  },
  toast: {
    successTitle: '¡Mensaje enviado!',
    successDesc: 'Te responderemos en un plazo de 24 horas.',
    errorTitle: 'Error',
    errorDesc: 'No se pudo enviar el mensaje. Inténtalo de nuevo más tarde.',
    validationTitle: 'Error de validación',
  },
  home: 'Inicio',
  headerTagline: taglineEs,
  demoMailSubject: 'Solicitud de demo PropertyPilot AI',
  minCharsCounter: '{current}/{min} caracteres mínimos',
  submitting: 'Enviando…',
};

export const demoUiFr: DemoPageUi = {
  nav: { pricing: 'Tarifs', login: 'Connexion', startFree: 'Commencer gratuitement' },
  hero: {
    badge: 'Réservez en 30 secondes',
    title: 'Réservez une démo gratuite',
    subtitle:
      'Découvrez comment PropertyPilot AI peut transformer votre agence immobilière. 30 minutes avec un expert pour voir la plateforme en action.',
  },
  calendly: {
    chooseDate: 'Choisir la date et l’heure',
    demoFree: 'Démo gratuite de 30 minutes',
    preferContact: 'Vous préférez nous contacter directement ?',
    whatsapp: 'WhatsApp',
    sendEmail: 'Envoyer un e-mail',
  },
  whatsappPrefill: 'Bonjour ! Je souhaite réserver une démo PropertyPilot AI.',
  calendlyIframeTitle: 'Réserver une démo PropertyPilot AI',
  valuePoints: {
    sectionTitle: 'Ce que vous découvrirez lors de la démo',
    sectionSubtitle:
      'Un aperçu complet des fonctionnalités qui rendront votre agence plus efficace.',
    bookNow: 'Réserver ma démo maintenant',
  },
  valuePointsList: [
    {
      title: 'IA générative avancée',
      description:
        'Créez des annonces professionnelles, titres A/B, descriptions SEO et contenus marketing en quelques secondes.',
    },
    {
      title: 'CRM 4.0 dynamique',
      description:
        'Gérez vos leads avec un pipeline Kanban, un scoring IA et un enrichissement automatique.',
    },
    {
      title: 'Automatisations intelligentes',
      description:
        'Plus de 20 automatisations IA pour le suivi, l’e-mail, WhatsApp et la gestion des leads sans effort.',
    },
    {
      title: 'Scoring de leads IA',
      description:
        'Identifiez les leads les plus chauds avec des scores 0-100 et priorisez vos actions.',
    },
    {
      title: 'Communication Hub',
      description:
        'E-mail, SMS et WhatsApp intégrés dans un seul tableau de bord avec modèles IA.',
    },
    {
      title: 'Branding personnalisé',
      description:
        'PDF white-label, fiches professionnelles et supports à votre marque.',
    },
  ],
  testimonials: {
    title: 'Ce que disent nos clients',
    subtitle: 'Des agents et agences qui ont déjà transformé leur activité avec PropertyPilot AI',
  },
  testimonialsList: [
    {
      name: 'Marco R.',
      role: 'Agent immobilier, Milan',
      quote:
        'PropertyPilot AI a totalement changé ma façon de travailler. Je crée des annonces en 30 secondes au lieu de 30 minutes.',
    },
    {
      name: 'Laura B.',
      role: 'Dirigeante d’agence, Rome',
      quote:
        'Le CRM et les automatisations me font gagner des heures chaque semaine. Je le recommande à toute agence sérieuse.',
    },
    {
      name: 'Giuseppe T.',
      role: 'Property manager, Naples',
      quote:
        'Enfin une plateforme qui comprend les besoins réels des agences. Un support exceptionnel.',
    },
  ],
  trustStats: [
    { iconKey: 'clock', value: '30 min', label: 'Démo gratuite' },
    { iconKey: 'shield', value: '100%', label: 'Sans engagement' },
    { iconKey: 'users', value: '500+', label: 'Clients satisfaits' },
    { iconKey: 'trendingUp', value: '+40%', label: 'Productivité moyenne' },
  ],
  finalCta: {
    titleLead: 'Prêt à ',
    titleAccent: 'transformer',
    titleTail: ' votre agence ?',
    subtitle:
      'Réservez dès maintenant votre démo gratuite et découvrez comment PropertyPilot AI peut multiplier vos ventes.',
    bookDemo: 'Réserver une démo gratuite',
  },
  footer: { home: 'Accueil', pricing: 'Tarifs', contact: 'Contact', login: 'Connexion' },
  footerCopyrightLine: footerCopyright,
};

export const contactUiFr: ContactPageUi = {
  title: 'Contactez-nous',
  subtitle: 'Nous sommes là pour vous aider. Écrivez-nous pour toute question.',
  support: {
    title: 'Support client',
    desc: 'Besoin d’aide technique ou d’informations sur votre compte ? Notre équipe est prête à vous répondre.',
  },
  sales: {
    title: 'Demandes commerciales',
    desc: 'Intéressé par les offres Business ou Enterprise ? Parlons de vos besoins.',
  },
  demo: {
    title: 'Une démo ?',
    desc: 'Découvrez comment PropertyPilot AI peut transformer votre activité immobilière. Réservez une démo gratuite avec notre équipe.',
    cta: 'Réserver une démo gratuite',
  },
  form: {
    title: 'Envoyez-nous un message',
    name: 'Nom',
    email: 'E-mail',
    subject: 'Objet',
    message: 'Message',
    namePlaceholder: 'Votre nom',
    emailPlaceholder: 'vous@email.com',
    subjectPlaceholder: 'Objet du message',
    messagePlaceholder: 'Écrivez votre message ici...',
    submit: 'Envoyer le message',
  },
  validation: {
    nameMin: 'Le nom doit contenir au moins 2 caractères',
    emailInvalid: 'Saisissez une adresse e-mail valide',
    messageMin: 'Le message doit contenir au moins 10 caractères',
    checkFields: 'Vérifiez les champs surlignés.',
  },
  toast: {
    successTitle: 'Message envoyé !',
    successDesc: 'Nous vous répondrons sous 24 heures.',
    errorTitle: 'Erreur',
    errorDesc: 'Impossible d’envoyer le message. Réessayez plus tard.',
    validationTitle: 'Erreur de validation',
  },
  home: 'Accueil',
  headerTagline: taglineFr,
  demoMailSubject: 'Demande de démo PropertyPilot AI',
  minCharsCounter: '{current}/{min} caractères minimum',
  submitting: 'Envoi en cours…',
};

export const demoUiDe: DemoPageUi = {
  nav: { pricing: 'Preise', login: 'Anmelden', startFree: 'Kostenlos starten' },
  hero: {
    badge: 'In 30 Sekunden buchen',
    title: 'Kostenlose Demo buchen',
    subtitle:
      'Erfahren Sie, wie PropertyPilot AI Ihre Immobilienagentur transformiert. 30 Minuten mit unserem Experten – live auf der Plattform.',
  },
  calendly: {
    chooseDate: 'Datum und Uhrzeit wählen',
    demoFree: 'Kostenlose 30-Minuten-Demo',
    preferContact: 'Möchten Sie uns direkt kontaktieren?',
    whatsapp: 'WhatsApp',
    sendEmail: 'E-Mail senden',
  },
  whatsappPrefill: 'Hallo! Ich möchte eine PropertyPilot AI Demo buchen.',
  calendlyIframeTitle: 'PropertyPilot AI Demo buchen',
  valuePoints: {
    sectionTitle: 'Das sehen Sie in der Demo',
    sectionSubtitle:
      'Ein vollständiger Überblick über Funktionen, die Ihre Agentur effizienter machen.',
    bookNow: 'Jetzt Demo buchen',
  },
  valuePointsList: [
    {
      title: 'Fortschrittliche generative KI',
      description:
        'Erstellen Sie professionelle Exposés, A/B-Titel, SEO-Texte und Marketing-Inhalte in Sekunden.',
    },
    {
      title: 'Dynamisches CRM 4.0',
      description:
        'Verwalten Sie Leads mit Kanban-Pipeline, KI-Scoring und automatischer Anreicherung.',
    },
    {
      title: 'Intelligente Automatisierungen',
      description:
        'Über 20 KI-Automatisierungen für Follow-up, E-Mail, WhatsApp und mühelose Lead-Verwaltung.',
    },
    {
      title: 'KI Lead Scoring',
      description:
        'Erkennen Sie die heißesten Leads mit Scores 0-100 und priorisieren Sie Ihre Aktivitäten.',
    },
    {
      title: 'Communication Hub',
      description:
        'E-Mail, SMS und WhatsApp in einem Dashboard mit KI-Vorlagen.',
    },
    {
      title: 'Eigenes Branding',
      description:
        'White-Label-PDFs, professionelle Objektblätter und Materialien mit Ihrer Marke.',
    },
  ],
  testimonials: {
    title: 'Das sagen unsere Kunden',
    subtitle: 'Makler und Agenturen, die ihr Geschäft mit PropertyPilot AI bereits transformiert haben',
  },
  testimonialsList: [
    {
      name: 'Marco R.',
      role: 'Immobilienmakler, Mailand',
      quote:
        'PropertyPilot AI hat meine Arbeitsweise komplett verändert. Ich erstelle Inserate in 30 Sekunden statt 30 Minuten.',
    },
    {
      name: 'Laura B.',
      role: 'Inhaberin einer Agentur, Rom',
      quote:
        'CRM und Automatisierungen sparen mir jede Woche Stunden. Absolute Empfehlung für ernsthafte Agenturen.',
    },
    {
      name: 'Giuseppe T.',
      role: 'Property Manager, Neapel',
      quote:
        'Endlich eine Plattform, die versteht, was Agenturen wirklich brauchen. Hervorragender Support.',
    },
  ],
  trustStats: [
    { iconKey: 'clock', value: '30 Min', label: 'Kostenlose Demo' },
    { iconKey: 'shield', value: '100%', label: 'Unverbindlich' },
    { iconKey: 'users', value: '500+', label: 'Zufriedene Kunden' },
    { iconKey: 'trendingUp', value: '+40%', label: 'Ø Produktivität' },
  ],
  finalCta: {
    titleLead: 'Bereit, ',
    titleAccent: 'Ihre Agentur',
    titleTail: ' zu transformieren?',
    subtitle:
      'Buchen Sie jetzt Ihre kostenlose Demo und erfahren Sie, wie PropertyPilot AI Ihren Umsatz steigern kann.',
    bookDemo: 'Kostenlose Demo buchen',
  },
  footer: { home: 'Start', pricing: 'Preise', contact: 'Kontakt', login: 'Anmelden' },
  footerCopyrightLine: footerCopyright,
};

export const contactUiDe: ContactPageUi = {
  title: 'Kontakt',
  subtitle: 'Wir helfen Ihnen gerne. Schreiben Sie uns bei Fragen.',
  support: {
    title: 'Kundensupport',
    desc: 'Technische Hilfe oder Fragen zu Ihrem Konto? Unser Team ist für Sie da.',
  },
  sales: {
    title: 'Vertrieb',
    desc: 'Interesse an Business- oder Enterprise-Plänen? Lassen Sie uns über Ihre Anforderungen sprechen.',
  },
  demo: {
    title: 'Demo gewünscht?',
    desc: 'Erfahren Sie, wie PropertyPilot AI Ihr Immobiliengeschäft verändert. Buchen Sie eine kostenlose Demo mit unserem Team.',
    cta: 'Kostenlose Demo buchen',
  },
  form: {
    title: 'Nachricht senden',
    name: 'Name',
    email: 'E-Mail',
    subject: 'Betreff',
    message: 'Nachricht',
    namePlaceholder: 'Ihr Name',
    emailPlaceholder: 'ihre@email.de',
    subjectPlaceholder: 'Betreff der Nachricht',
    messagePlaceholder: 'Schreiben Sie hier Ihre Nachricht...',
    submit: 'Nachricht senden',
  },
  validation: {
    nameMin: 'Der Name muss mindestens 2 Zeichen haben',
    emailInvalid: 'Bitte eine gültige E-Mail eingeben',
    messageMin: 'Die Nachricht muss mindestens 10 Zeichen haben',
    checkFields: 'Bitte die markierten Felder prüfen.',
  },
  toast: {
    successTitle: 'Nachricht gesendet!',
    successDesc: 'Wir melden uns innerhalb von 24 Stunden.',
    errorTitle: 'Fehler',
    errorDesc: 'Nachricht konnte nicht gesendet werden. Bitte später erneut versuchen.',
    validationTitle: 'Validierungsfehler',
  },
  home: 'Start',
  headerTagline: taglineDe,
  demoMailSubject: 'PropertyPilot AI Demo-Anfrage',
  minCharsCounter: '{current}/{min} Zeichen mindestens',
  submitting: 'Wird gesendet…',
};

export const demoUiPt: DemoPageUi = {
  nav: { pricing: 'Preços', login: 'Iniciar sessão', startFree: 'Começar grátis' },
  hero: {
    badge: 'Reserve em 30 segundos',
    title: 'Reserve uma demo gratuita',
    subtitle:
      'Descubra como o PropertyPilot AI pode transformar a sua agência imobiliária. 30 minutos com um especialista para ver a plataforma em ação.',
  },
  calendly: {
    chooseDate: 'Escolha data e hora',
    demoFree: 'Demo gratuita de 30 minutos',
    preferContact: 'Prefere contactar-nos diretamente?',
    whatsapp: 'WhatsApp',
    sendEmail: 'Enviar email',
  },
  whatsappPrefill: 'Olá! Gostaria de reservar uma demo do PropertyPilot AI.',
  calendlyIframeTitle: 'Reservar demo PropertyPilot AI',
  valuePoints: {
    sectionTitle: 'O que vai descobrir na demo',
    sectionSubtitle:
      'Uma visão completa das funcionalidades que tornam a sua agência mais eficiente.',
    bookNow: 'Reserve já a sua demo',
  },
  valuePointsList: [
    {
      title: 'IA generativa avançada',
      description:
        'Crie anúncios profissionais, títulos A/B, descrições SEO e conteúdo de marketing em segundos.',
    },
    {
      title: 'CRM 4.0 dinâmico',
      description:
        'Faça a gestão dos leads com pipeline Kanban, lead scoring IA e enriquecimento automático.',
    },
    {
      title: 'Automatizações inteligentes',
      description:
        'Mais de 20 automatizações IA para follow-up, email, WhatsApp e gestão de leads sem esforço.',
    },
    {
      title: 'Lead scoring IA',
      description:
        'Identifique os leads mais quentes com pontuações 0-100 e priorize a sua atividade.',
    },
    {
      title: 'Communication Hub',
      description:
        'Email, SMS e WhatsApp integrados num único painel com modelos IA.',
    },
    {
      title: 'Branding personalizado',
      description:
        'PDFs white-label, fichas profissionais e materiais com a sua marca.',
    },
  ],
  testimonials: {
    title: 'O que dizem os nossos clientes',
    subtitle: 'Agentes e agências que já transformaram o negócio com PropertyPilot AI',
  },
  testimonialsList: [
    {
      name: 'Marco R.',
      role: 'Agente imobiliário, Milão',
      quote:
        'O PropertyPilot AI mudou totalmente a minha forma de trabalhar. Crio anúncios em 30 segundos em vez de 30 minutos.',
    },
    {
      name: 'Laura B.',
      role: 'Diretora de agência, Roma',
      quote:
        'O CRM e as automatizações poupam-me horas todas as semanas. Recomendo a qualquer agência séria.',
    },
    {
      name: 'Giuseppe T.',
      role: 'Property manager, Nápoles',
      quote:
        'Finalmente uma plataforma que percebe o que as agências precisam. Suporte excecional.',
    },
  ],
  trustStats: [
    { iconKey: 'clock', value: '30 min', label: 'Demo gratuita' },
    { iconKey: 'shield', value: '100%', label: 'Sem compromisso' },
    { iconKey: 'users', value: '500+', label: 'Clientes satisfeitos' },
    { iconKey: 'trendingUp', value: '+40%', label: 'Produtividade média' },
  ],
  finalCta: {
    titleLead: 'Pronto para ',
    titleAccent: 'transformar',
    titleTail: ' a sua agência?',
    subtitle:
      'Reserve já a sua demo gratuita e descubra como o PropertyPilot AI pode multiplicar as suas vendas.',
    bookDemo: 'Reservar demo gratuita',
  },
  footer: { home: 'Início', pricing: 'Preços', contact: 'Contacto', login: 'Iniciar sessão' },
  footerCopyrightLine: footerCopyright,
};

export const contactUiPt: ContactPageUi = {
  title: 'Contacte-nos',
  subtitle: 'Estamos aqui para ajudar. Escreva-nos para qualquer questão.',
  support: {
    title: 'Apoio ao cliente',
    desc: 'Precisa de assistência técnica ou tem dúvidas sobre a conta? A nossa equipa está pronta a ajudar.',
  },
  sales: {
    title: 'Pedidos comerciais',
    desc: 'Interessado em planos Business ou Enterprise? Fale connosco sobre as necessidades da sua empresa.',
  },
  demo: {
    title: 'Quer uma demo?',
    desc: 'Descubra como o PropertyPilot AI pode transformar o seu negócio imobiliário. Reserve uma demo gratuita com a nossa equipa.',
    cta: 'Reservar demo gratuita',
  },
  form: {
    title: 'Envie-nos uma mensagem',
    name: 'Nome',
    email: 'Email',
    subject: 'Assunto',
    message: 'Mensagem',
    namePlaceholder: 'O seu nome',
    emailPlaceholder: 'seu@email.com',
    subjectPlaceholder: 'Assunto da mensagem',
    messagePlaceholder: 'Escreva a sua mensagem aqui...',
    submit: 'Enviar mensagem',
  },
  validation: {
    nameMin: 'O nome deve ter pelo menos 2 caracteres',
    emailInvalid: 'Introduza um email válido',
    messageMin: 'A mensagem deve ter pelo menos 10 caracteres',
    checkFields: 'Verifique os campos assinalados.',
  },
  toast: {
    successTitle: 'Mensagem enviada!',
    successDesc: 'Responderemos no prazo de 24 horas.',
    errorTitle: 'Erro',
    errorDesc: 'Não foi possível enviar a mensagem. Tente novamente mais tarde.',
    validationTitle: 'Erro de validação',
  },
  home: 'Início',
  headerTagline: taglinePt,
  demoMailSubject: 'Pedido de demo PropertyPilot AI',
  minCharsCounter: '{current}/{min} caracteres mínimos',
  submitting: 'A enviar…',
};

export const demoUiAr: DemoPageUi = {
  nav: { pricing: 'الأسعار', login: 'تسجيل الدخول', startFree: 'ابدأ مجاناً' },
  hero: {
    badge: 'احجز خلال 30 ثانية',
    title: 'احجز عرضاً توضيحياً مجانياً',
    subtitle:
      'اكتشف كيف يمكن لـ PropertyPilot AI تحويل وكالتك العقارية. 30 دقيقة مع خبير لرؤية المنصة عملياً.',
  },
  calendly: {
    chooseDate: 'اختر التاريخ والوقت',
    demoFree: 'عرض توضيحي مجاني لمدة 30 دقيقة',
    preferContact: 'تفضل التواصل مباشرة؟',
    whatsapp: 'واتساب',
    sendEmail: 'إرسال بريد',
  },
  whatsappPrefill: 'مرحباً! أود حجز عرض توضيحي لـ PropertyPilot AI.',
  calendlyIframeTitle: 'حجز عرض PropertyPilot AI',
  valuePoints: {
    sectionTitle: 'ما ستكتشفه في العرض',
    sectionSubtitle: 'نظرة شاملة على الميزات التي تجعل وكالتك أكثر كفاءة.',
    bookNow: 'احجز عرضك الآن',
  },
  valuePointsList: [
    {
      title: 'ذكاء اصطناعي توليدي متقدم',
      description:
        'أنشئ إعلانات احترافية وعناوين A/B ووصفاً لتحسين محركات البحث ومحتوى تسويقي في ثوانٍ.',
    },
    {
      title: 'CRM ديناميكي 4.0',
      description: 'أدر العملاء المحتملين بمسار Kanban وتقييم بالذكاء الاصطناعي وإثراء تلقائي.',
    },
    {
      title: 'أتمتة ذكية',
      description:
        'أكثر من 20 أتمتة للمتابعة والبريد وواتساب وإدارة العملاء المحتملين بسهولة.',
    },
    {
      title: 'تقييم العملاء المحتملين بالذكاء الاصطناعي',
      description: 'حدد الأكثر جدية بدرجات 0-100 ورتّب أولوياتك.',
    },
    {
      title: 'مركز التواصل',
      description: 'البريد والرسائل القصيرة وواتساب في لوحة واحدة مع قوالب ذكاء اصطناعي.',
    },
    {
      title: 'هوية مخصصة',
      description: 'ملفات PDF بعلامتك التجارية وبطاقات عقارية احترافية.',
    },
  ],
  testimonials: {
    title: 'ماذا يقول عملاؤنا',
    subtitle: 'وسطاء ووكالات غيّرت أعمالها مع PropertyPilot AI',
  },
  testimonialsList: [
    {
      name: 'ماركو ر.',
      role: 'وسيط عقاري، ميلانو',
      quote:
        'غيّر PropertyPilot AI طريقة عملي بالكامل. أُنشئ الإعلانات في 30 ثانية بدلاً من 30 دقيقة.',
    },
    {
      name: 'لورا ب.',
      role: 'مالكة وكالة، روما',
      quote: 'الـ CRM والأتمتة توفران ساعات أسبوعياً. أنصح بها لكل وكالة جادة.',
    },
    {
      name: 'جوزيبي ت.',
      role: 'مدير عقارات، نابولي',
      quote: 'أخيراً منصة تفهم احتياجات الوكالات. دعم ممتاز.',
    },
  ],
  trustStats: [
    { iconKey: 'clock', value: '30 د', label: 'عرض مجاني' },
    { iconKey: 'shield', value: '100%', label: 'بدون التزام' },
    { iconKey: 'users', value: '500+', label: 'عملاء راضون' },
    { iconKey: 'trendingUp', value: '+40%', label: 'متوسط الإنتاجية' },
  ],
  finalCta: {
    titleLead: 'مستعد لـ',
    titleAccent: 'تحويل',
    titleTail: ' وكالتك؟',
    subtitle:
      'احجز عرضك المجاني الآن واكتشف كيف يمكن لـ PropertyPilot AI مضاعفة مبيعاتك.',
    bookDemo: 'احجز عرضاً مجانياً',
  },
  footer: {
    home: 'الرئيسية',
    pricing: 'الأسعار',
    contact: 'اتصل بنا',
    login: 'تسجيل الدخول',
  },
  footerCopyrightLine: footerCopyright,
};

export const contactUiAr: ContactPageUi = {
  title: 'اتصل بنا',
  subtitle: 'نحن هنا للمساعدة. راسلنا لأي استفسار.',
  support: {
    title: 'دعم العملاء',
    desc: 'تحتاج مساعدة تقنية أو لديك أسئلة عن حسابك؟ فريقنا جاهز.',
  },
  sales: {
    title: 'استفسارات مبيعات',
    desc: 'مهتم بخطط Business أو Enterprise؟ لنناقش احتياجاتك.',
  },
  demo: {
    title: 'تريد عرضاً توضيحياً؟',
    desc: 'اكتشف كيف يمكن لـ PropertyPilot AI تحويل أعمالك العقارية. احجز عرضاً مجانياً مع فريقنا.',
    cta: 'احجز عرضاً مجانياً',
  },
  form: {
    title: 'أرسل لنا رسالة',
    name: 'الاسم',
    email: 'البريد الإلكتروني',
    subject: 'الموضوع',
    message: 'الرسالة',
    namePlaceholder: 'اسمك',
    emailPlaceholder: 'بريدك@email.com',
    subjectPlaceholder: 'موضوع الرسالة',
    messagePlaceholder: 'اكتب رسالتك هنا...',
    submit: 'إرسال الرسالة',
  },
  validation: {
    nameMin: 'يجب أن يكون الاسم حرفين على الأقل',
    emailInvalid: 'أدخل بريداً إلكترونياً صالحاً',
    messageMin: 'يجب أن تكون الرسالة 10 أحرف على الأقل',
    checkFields: 'راجع الحقول المميزة.',
  },
  toast: {
    successTitle: 'تم إرسال الرسالة!',
    successDesc: 'سنرد خلال 24 ساعة.',
    errorTitle: 'خطأ',
    errorDesc: 'تعذر إرسال الرسالة. حاول لاحقاً.',
    validationTitle: 'خطأ في التحقق',
  },
  home: 'الرئيسية',
  headerTagline: taglineAr,
  demoMailSubject: 'طلب عرض PropertyPilot AI',
  minCharsCounter: '{current}/{min} حرفاً كحد أدنى',
  submitting: 'جاري الإرسال…',
};
