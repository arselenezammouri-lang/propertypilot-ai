/**
 * Home marketing (`/`) — full `landing` block for PT.
 * EN base merged in getTranslation; this replaces EN fallbacks for pt.
 */

export const landingPt = {
  nav: {
    tagline: 'Leve a sua agência ao próximo nível',
    features: 'Funcionalidades',
    pricing: 'Preços',
    compliance: 'Conformidade',
    login: 'Iniciar sessão',
    getStarted: 'Começar',
  },
  hero: {
    poweredBy: 'Com tecnologia GPT-4',
    titlePart1: 'O seu agente',
    titlePart2: 'imobiliário',
    titleAI: 'IA',
    socialProof: 'Escolhido por',
    socialProofAgencies: '+500 agências',
    socialProofLocation: 'na Europa',
    subtitle:
      'O único sistema operativo de IA que encontra, analisa e obtém mandatos de forma totalmente autónoma',
    ctaStart: 'Começar grátis',
    ctaDemo: 'Ver demo',
    trustedBy: 'Compatível com os principais portais',
    trustedPortalLogos: ['Idealista', 'Immobiliare.it', 'Zillow', 'MLS'] as [
      string,
      string,
      string,
      string,
    ],
    stats: {
      automation: 'Automatização',
      listingsPerDay: 'Anúncios/dia',
      conversionRate: 'Taxa de conversão',
    },
    statsValues: {
      automation: '24/7',
      listingsPerDay: '1000+',
      conversionRate: '80%',
    },
    signupAriaLabel: 'Registar-se no PropertyPilot AI',
    demoDashboardAriaLabel: 'Ver a demo do painel',
  },
  features: {
    title: 'Porquê PropertyPilot AI?',
    subtitle: 'A plataforma de IA completa para agentes imobiliários que querem escalar',
    aiListing: {
      title: 'Motor de anúncios IA',
      description:
        'Gere anúncios profissionais em segundos com estilos personalizados (Luxo, Investimento, Standard Pro). Multilingue e otimizado para Zillow, Idealista e Immobiliare.',
      benefit: 'Poupe 5 horas por semana na escrita de anúncios',
      cta: 'Experimentar grátis',
    },
    crmAI: {
      title: 'Inteligência CRM IA',
      description:
        'Pontuação de leads automática, follow-up IA multicanal (WhatsApp, e-mail, SMS). Categoriza leads QUENTES/MORNOS/FRIOS e sugere ações prioritárias.',
      benefit: 'Aumente as conversões em 40% com priorização IA',
      cta: 'Ir para o CRM',
    },
    globalReach: {
      title: 'Alcance global',
      description:
        'Operamos nos EUA (Zillow, MLS), Itália (Idealista, Immobiliare), Espanha (Idealista.es). Terminologia localizada e formatos de mercado.',
      benefit: 'Expanda o seu negócio em 3 continentes',
      cta: 'Descubra a prospeção',
    },
  },
  searchEngine: {
    title: 'O motor de pesquisa que nunca dorme',
    subtitle: 'Disponível',
    exclusive: 'EXCLUSIVAMENTE',
    exclusiveInPlan: 'no plano AGENCY',
    benefit: 'Poupe 20 horas de chamadas telefónicas por semana',
    stepLabel: 'PASSO {n}',
    prospectingCycleCta: 'Inicie o ciclo Scraper → voz IA → CRM',
    step1: {
      title: 'Varredura global',
      description:
        'A IA analisa automaticamente Idealista, Immobiliare, Zillow e MLS 24/7, encontrando milhares de anúncios por dia.',
      status: 'Varredura em curso...',
    },
    step2: {
      title: 'Filtragem IA',
      description:
        'Cada anúncio recebe uma pontuação de lead IA (0-100). Só os «TOP DEAL» (80+) são selecionados para chamadas.',
      status: 'TOP DEAL detetado',
      demoScoreLabel: '{score}/{max}',
    },
    step3: {
      title: 'Chamada automática',
      description:
        'Voz IA (Bland AI) contacta os proprietários, trata objeções e propõe visitas de forma natural e persuasiva.',
      status: 'Chamada em curso...',
    },
    step4: {
      title: 'Marcação na agenda',
      description:
        'A marcação é adicionada automaticamente ao seu Google Calendar e recebe uma notificação por e-mail com todos os detalhes.',
      status: 'Marcação confirmada',
    },
  },
  tuesdayMorning: {
    title: 'A sua nova terça-feira de manhã',
    subtitle: 'Imagine acordar com o trabalho já feito',
    time1: '08:00',
    time1Title: 'A IA já analisou 500 anúncios',
    time1Desc:
      'Enquanto dormia, o sistema analisou Idealista, Immobiliare, Zillow e MLS. Cada anúncio foi classificado com pontuação de lead IA.',
    time2: '08:30',
    time2Title: '3 proprietários confirmaram a visita',
    time2Desc:
      'A voz IA contactou os proprietários dos TOP DEALs (pontuação 80+). Três já confirmaram disponibilidade para uma visita esta semana.',
    time3: '09:00',
    time3Title: 'Acorda e abre a agenda já cheia',
    time3Desc:
      'Abra o PropertyPilot AI e encontre 3 marcações já agendadas, com todos os detalhes do imóvel, contactos do proprietário e notas IA.',
  },
  testimonials: {
    title: 'Escolhido por agentes em todo o mundo',
    subtitle: 'Milhares de agentes imobiliários confiam no PropertyPilot AI',
    testimonial1: {
      name: 'Marco Rossi',
      role: 'Agente imobiliário, Milão',
      content:
        'O PropertyPilot AI triplicou o meu negócio. A pontuação de leads IA diz-me exatamente em que leads me concentrar.',
    },
    testimonial2: {
      name: 'Sarah Johnson',
      role: 'Agente imobiliária, Miami',
      content:
        'A geração de anúncios é incrível. Crio anúncios profissionais em 30 segundos em vez de horas.',
    },
    testimonial3: {
      name: 'Carlos Garcia',
      role: 'Agente, Barcelona',
      content:
        'O CRM IA é uma mudança de jogo. Os follow-ups automáticos poupam-me 10 horas por semana.',
    },
  },
  aria: {
    badge: 'Disponível em todos os planos',
    title: 'Aria — o seu parceiro IA para o sucesso',
    subtitle:
      'O seu coach pessoal, sempre disponível. Integração, estratégia, motivação: tudo num chat.',
    mentoring: {
      title: 'Mentoria 24/7',
      description:
        'Nunca mais sozinho nas negociações. A Aria guia-o passo a passo, mesmo quando o cliente levanta objeções difíceis.',
      benefit: 'Reduza o stress e aumente a confiança',
    },
    onboarding: {
      title: 'Integração instantânea',
      description:
        'Domine o PropertyPilot em 5 minutos falando com a Aria. Sem tutoriais longos, só conversa natural.',
      benefit: 'Seja produtivo de imediato',
    },
    support: {
      title: 'Apoio psicológico',
      description:
        'A aliada que o motiva a fechar esse mandato quando o desafio aperta. A Aria conhece a psicologia das vendas.',
      benefit: 'Mantenha a motivação alta',
    },
    available: 'A Aria está sempre disponível. Clique na bolha no canto inferior direito para começar.',
    availableFree: 'Também disponível no plano GRÁTIS',
  },
  pricing: {
    title: 'Preços',
    subtitle: 'Compare os planos e escolha o ideal para o seu negócio',
    feature: 'Funcionalidade',
    bestValue: 'MELHOR VALOR',
    perMonth: '/mês',
    agencySubtitle: 'Suite omnicanal de domínio',
    agencyExtra: '+ Módulo comercial e arbitragem alargada',
    features: {
      listingsPerMonth: 'Anúncios por mês',
      aiGeneration: 'Geração de anúncios IA',
      aiStyles: 'Estilos IA (Luxo, Investimento, Pro)',
      multilingual: 'Multilingue (IT, EN, ES)',
      pdf: 'PDFs profissionais',
      crm: 'CRM completo',
      kanban: 'Pipeline Kanban',
      leadScoring: 'Pontuação de leads IA base',
      briefing: 'Briefing inteligente multi-categoria',
      staging: 'Virtual staging 3D',
      followup: 'Follow-up IA multicanal',
      automations: 'Automatizações IA',
      forms: 'Formulários inteligentes de captura de leads',
      whiteLabel: 'PDF white-label',
      assistant: 'Assistente de agência IA',
      multiUser: 'Multiutilizador',
      roles: 'Funções e permissões',
      distribution: 'Distribuição automática de leads',
      reports: 'Relatórios de atividade da equipa',
      multiOffice: 'Integração multi-sede',
      auraVR: 'Aura VR: visitas virtuais cinematográficas',
      voiceCalling: 'Chamadas de voz IA (Bland AI)',
      messaging: 'Mensagens inteligentes IA (SMS/WhatsApp)',
      manualOverride: 'Anulação manual: acesso direto aos dados do proprietário',
      humanOverride: 'Liberdade de intervenção humana',
      autoProspecting: 'Autoprospeção 24/7',
      scraping: 'Scraping inteligente',
      dashboard: 'Painel de comando operacional',
      calendar: 'Integração com Google Calendar',
      notifications: 'Notificações por e-mail automáticas',
      support: 'Suporte',
    },
    plans: {
      free: 'GRÁTIS',
      starter: 'STARTER',
      pro: 'PRO',
      agency: 'AGENCY',
      unlimited: 'Ilimitados',
      advanced: 'Avançado',
      exclusive: 'EXCLUSIVO',
      active: 'Ativo',
      viewer: 'Visualizador',
      community: 'Comunidade',
      email: 'E-mail',
      priority: 'Prioritário',
      dedicated: 'Dedicado 24/7',
    },
    cta: {
      startFree: 'Começar grátis',
      chooseStarter: 'Escolher Starter',
      choosePro: 'Escolher Pro',
      chooseAgency: 'Escolher Agency',
    },
    tableCells: {
      multiUserAgency: 'Até 10 agentes',
      voiceCallingPro: '30/mês',
    },
    agencyBoost: {
      productName: 'Impulso Agency',
      badgePremium: 'SERVIÇO PREMIUM',
      tierTitanium: 'Titanium',
      description:
        'Pacote de configuração «done-for-you» com onboarding premium e suporte dedicado',
      bullet1: 'Configuração completa «done-for-you»',
      bullet2: 'Implementação e onboarding guiados',
      bullet3: 'Suporte premium para o lançamento',
      oneTimePayment: 'Pagamento único',
      cta: 'Obter Agency Boost',
    },
  },
  cta: {
    title: 'Pronto para multiplicar o seu negócio?',
    subtitle: 'Junte-se a centenas de agentes que já usam o PropertyPilot AI',
    button: 'Começar grátis',
  },
  footer: {
    tagline: 'O seu agente imobiliário IA que trabalha 24/7',
    product: 'Produto',
    company: 'Empresa',
    support: 'Suporte',
    pricing: 'Preços',
    dashboard: 'Painel',
    features: 'Funcionalidades',
    about: 'Sobre nós',
    contact: 'Contacto',
    blog: 'Blog',
    privacy: 'Política de privacidade',
    terms: 'Termos de serviço',
    refund: 'Política de reembolso',
    copyright: 'Todos os direitos reservados.',
  },
  pricingPage: {
    badge: 'Preços transparentes',
    mainTitle: 'Escolha o plano',
    mainTitle2: 'Perfeito para si',
    subtitle:
      'Planos pensados para cada fase do seu negócio imobiliário. Comece grátis, escale quando estiver pronto.',
    trustCancel: 'Cancele quando quiser',
    trustTrial: 'Teste grátis de 7 dias',
    trustSupport: 'Suporte no seu idioma',
    demo: 'Demo',
    whyChoose: 'Porquê escolher o PropertyPilot AI?',
    whySubtitle: 'Recursos premium para cada profissional imobiliário',
    faqTitle: 'Perguntas frequentes',
    faqSubtitle: 'Tudo o que precisa de saber sobre os nossos planos',
    ctaTitle: 'Pronto para transformar os seus anúncios?',
    ctaSubtitle:
      'Comece grátis hoje e descubra como a IA pode elevar o seu negócio imobiliário.',
    ctaStartFree: 'Começar grátis',
    ctaWatchDemo: 'Ver demo',
    features: [
      { title: 'IA GPT-4 premium', desc: 'Os modelos de IA mais avançados do mercado' },
      { title: '100% localizado', desc: 'Conteúdo otimizado para o seu mercado' },
      { title: 'Geração instantânea', desc: 'Resultados em menos de 30 segundos' },
      { title: 'Fácil de usar', desc: 'Sem competências técnicas necessárias' },
      { title: 'Anúncios profissionais', desc: 'Qualidade ao nível de agência' },
      { title: 'Multi-agência', desc: 'Gira vários escritórios com uma conta' },
    ],
    faqs: [
      {
        question: 'Posso mudar de plano a qualquer momento?',
        answer:
          'Sim, pode fazer upgrade ou downgrade quando quiser. As alterações aplicam-se no próximo ciclo de faturação.',
      },
      {
        question: 'Há período de teste gratuito?',
        answer:
          'Sim, oferecemos 7 dias de teste grátis em todos os planos pagos. Não é necessário cartão para começar.',
      },
      {
        question: 'O que acontece se ultrapassar os limites do plano?',
        answer:
          'Avisamo-lo quando se aproximar dos limites. Pode fazer upgrade facilmente para continuar a crescer.',
      },
      {
        question: 'Como funciona o plano Agency?',
        answer:
          'O plano Agency é para equipas e multi-agências. Inclui anúncios ilimitados, todos os recursos e suporte dedicado.',
      },
      {
        question: 'Posso cancelar a minha subscrição?',
        answer:
          'Sim, pode cancelar a qualquer momento no painel. O acesso mantém-se até ao fim do período já pago.',
      },
      {
        question: 'Oferecem suporte no meu idioma?',
        answer:
          'Com certeza! O nosso suporte está disponível por e-mail e chat no seu idioma.',
      },
    ],
  },
};

