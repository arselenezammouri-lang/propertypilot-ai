import type { PrivacyPolicyPageUi } from '@/lib/i18n/privacy-policy-page-ui';
import type { TermsPolicyPageUi } from '@/lib/i18n/terms-policy-page-ui';
import type { RefundPolicyPageUi } from '@/lib/i18n/refund-policy-page-ui';
import { privacyFooterNonIt } from '@/lib/i18n/legal-policy-locales-shared';

export const privacyPolicyPageUiPt: PrivacyPolicyPageUi = {
  title: 'Política de',
  highlight: 'privacidade',
  updated: 'Última atualização: dezembro de 2024',
  terms: 'Termos e condições',
  refund: 'Política de reembolso',
  ...privacyFooterNonIt('Para exercer estes direitos, contacte-nos em '),
  sections: [
    {
      iconKey: 'eye',
      color: 'text-electric-blue',
      title: '1. Informações gerais',
      body: [
        'O PropertyPilot AI («nós», «nosso») respeita a sua privacidade e compromete-se a proteger os seus dados pessoais. Este aviso explica como recolhemos, utilizamos e protegemos as suas informações em conformidade com o RGPD e a legislação aplicável.',
        'Responsável pelo tratamento: PropertyPilot AI',
        'E-mail: privacy@propertypilotai.com',
      ],
    },
    {
      iconKey: 'database',
      color: 'text-sunset-gold',
      title: '2. Dados que recolhemos',
      body: ['Recolhemos as seguintes categorias de dados:'],
      lists: [
        {
          title: 'Dados fornecidos diretamente:',
          items: [
            'Nome completo',
            'Endereço de e-mail',
            'Nome da agência/empresa',
            'Dados de pagamento (processados pela Stripe)',
            'Conteúdos imobiliários enviados para geração por IA',
          ],
        },
        {
          title: 'Dados recolhidos automaticamente:',
          items: [
            'Endereço IP',
            'Tipo de navegador e dispositivo',
            'Páginas visitadas e interações',
            'Cookies técnicos e analíticos',
          ],
        },
      ],
    },
    {
      iconKey: 'lock',
      color: 'text-royal-purple',
      title: '3. Como utilizamos os seus dados',
      body: ['Utilizamos os seus dados para:'],
      items: [
        'Fornecer e melhorar os nossos serviços de IA',
        'Gerir a sua conta e subscrição',
        'Processar pagamentos através da Stripe',
        'Enviar comunicações relacionadas com o serviço',
        'Analisar a utilização para melhorar a plataforma',
        'Cumprir obrigações legais',
      ],
      note: 'Nunca vendemos os seus dados a terceiros.',
    },
    {
      iconKey: 'globe',
      color: 'text-neon-aqua',
      title: '4. Partilha de dados',
      body: ['Partilhamos os seus dados apenas com:'],
      items: [
        'Stripe: processamento seguro de pagamentos',
        'Supabase: alojamento de base de dados e autenticação',
        'OpenAI: geração de conteúdo por IA (dados minimizados ou anonimizados quando possível)',
        'Vercel: alojamento da plataforma',
      ],
      note: 'Todos os nossos fornecedores oferecem garantias de segurança adequadas e salvaguardas alinhadas com o RGPD.',
    },
    {
      iconKey: 'userCheck',
      color: 'text-electric-blue',
      title: '5. Os seus direitos',
      body: ['Ao abrigo do RGPD, tem direito a:'],
      items: [
        'Acesso: solicitar uma cópia dos seus dados',
        'Retificação: corrigir dados inexatos',
        'Apagamento: solicitar a eliminação dos seus dados',
        'Portabilidade: receber os seus dados num formato legível',
        'Oposição: opor-se ao tratamento para fins de marketing',
        'Limitação: limitar o tratamento em determinadas circunstâncias',
      ],
      noteKey: 'exerciseRights',
    },
    {
      title: '6. Cookies',
      body: ['Utilizamos os seguintes tipos de cookies:'],
      items: [
        'Cookies técnicos: necessários ao funcionamento do site',
        'Cookies de sessão: para manter a autenticação',
        'Cookies analíticos: para compreender como utiliza o site (anonimizados quando possível)',
      ],
      note: 'Pode gerir as preferências de cookies no seu navegador.',
    },
    {
      title: '7. Segurança dos dados',
      body: ['Implementamos medidas de segurança avançadas:'],
      items: [
        'Encriptação SSL/TLS em todas as comunicações',
        'Encriptação dos dados armazenados',
        'Autenticação de dois fatores disponível',
        'Cópias de segurança regulares e recuperação ante desastres',
        'Acesso restrito aos dados apenas para pessoal autorizado',
      ],
    },
    {
      title: '8. Conservação dos dados',
      body: ['Conservamos os dados pelo tempo necessário para prestar o serviço:'],
      items: [
        'Dados de conta: até eliminação da conta + 30 dias',
        'Dados de faturação: 10 anos (obrigações fiscais)',
        'Registos de sistema: 90 dias',
        'Conteúdo gerado: até eliminação pelo utilizador',
      ],
    },
    {
      title: '9. Transferências internacionais',
      body: [
        'Alguns fornecedores podem estar fora do EEE. Nesses casos asseguramos garantias adequadas, como cláusulas contratuais-tipo ou medidas equivalentes.',
      ],
    },
    {
      iconKey: 'mail',
      color: 'text-sunset-gold',
      title: '10. Contacto e reclamações',
      body: ['Para questões de privacidade ou para exercer os seus direitos:'],
      contacts: ['E-mail: privacy@propertypilotai.com'],
      note: 'Tem o direito de apresentar reclamação à autoridade de proteção de dados do seu país.',
    },
  ],
};

export const termsPolicyPageUiPt: TermsPolicyPageUi = {
  title: 'Termos e',
  highlight: 'condições',
  updated: 'Última atualização: dezembro de 2024',
  privacy: 'Política de privacidade',
  refund: 'Política de reembolso',
  sections: [
    {
      iconKey: 'fileText',
      color: 'text-electric-blue',
      title: '1. Aceitação dos termos',
      paragraphs: [
        'Ao utilizar o PropertyPilot AI («Serviço»), aceita ficar vinculado a estes Termos e condições. Se não concordar, não utilize o Serviço.',
        'O PropertyPilot AI reserva-se o direito de alterar estes termos a qualquer momento. As alterações produzem efeitos imediatamente após publicação no site.',
      ],
    },
    {
      iconKey: 'shield',
      color: 'text-neon-aqua',
      title: '2. Descrição do serviço',
      paragraphs: ['O PropertyPilot AI é uma plataforma de inteligência artificial que fornece:'],
      items: [
        'Geração automática de descrições imobiliárias profissionais',
        'Otimização SEO para anúncios',
        'Tradução multilingue de conteúdos',
        'Ferramentas CRM para gestão de leads',
        'Análise e auditoria de anúncios existentes',
        'Geração de materiais de marketing (PDF, publicações sociais)',
      ],
    },
    {
      iconKey: 'checkCircle',
      color: 'text-sunset-gold',
      title: '3. Conta de utilizador',
      paragraphs: ['Para utilizar o PropertyPilot AI deve:'],
      items: [
        'Ter pelo menos 18 anos',
        'Fornecer informações de registo corretas e completas',
        'Manter a segurança da conta e da palavra-passe',
        'Notificar-nos de imediato qualquer uso não autorizado',
      ],
      note: 'É responsável por todas as atividades sob a sua conta.',
    },
    {
      title: '4. Planos e pagamentos',
      paragraphs: ['O PropertyPilot AI oferece vários planos de subscrição:'],
      items: [
        'Starter (197 EUR/mês): funções básicas para agentes a solo',
        'Pro (497 EUR/mês): CRM completo e automações avançadas',
        'Agency (897 EUR/mês): para equipas até 10 agentes',
        'Agency Boost (2.497 EUR único): implementação completa e consultoria',
      ],
      note: 'Os pagamentos são processados pela Stripe. Os preços não incluem IVA.',
    },
    {
      title: '5. Propriedade intelectual',
      paragraphs: [
        'Todo o conteúdo gerado por IA através do PropertyPilot AI pertence ao utilizador que o gerou. O PropertyPilot AI mantém direitos sobre a plataforma, software, design e materiais relacionados.',
        'É proibido copiar, modificar ou distribuir partes do Serviço sem autorização escrita.',
      ],
    },
    {
      iconKey: 'alertTriangle',
      color: 'text-orange-500',
      title: '6. Limitação de responsabilidade',
      paragraphs: [
        'O PropertyPilot AI não garante que o conteúdo gerado por IA esteja isento de erros ou adequado a todos os fins. O utilizador é responsável por rever e verificar antes da publicação.',
        'O PropertyPilot AI não será responsável por danos indiretos, incidentais ou consequenciais resultantes da utilização do Serviço.',
      ],
    },
    {
      title: '7. Utilização aceitável',
      paragraphs: ['Não pode utilizar o PropertyPilot AI para:'],
      items: [
        'Atividades ilegais ou fraudulentas',
        'Gerar conteúdo difamatório, ofensivo ou discriminatório',
        'Violar direitos de terceiros',
        'Tentar acesso não autorizado a sistemas ou dados',
        'Distribuir malware',
      ],
    },
    {
      title: '8. Cancelamento e suspensão',
      paragraphs: [
        'Pode eliminar a sua conta a qualquer momento no painel. O PropertyPilot AI reserva-se o direito de suspender ou encerrar contas que violem estes termos.',
      ],
      linkText: 'Política de reembolso',
      linkIntro: 'Para a política de reembolso, consulte a nossa',
    },
    {
      title: '9. Lei aplicável',
      paragraphs: [
        'Estes termos regem-se pela lei italiana. Qualquer litígio será da competência dos tribunais de Milão.',
      ],
    },
    {
      title: '10. Contacto',
      paragraphs: ['Para questões sobre estes termos:'],
      contacts: ['E-mail: legal@propertypilotai.com', 'Suporte: support@propertypilotai.com'],
    },
  ],
};

export const refundPolicyPageUiPt: RefundPolicyPageUi = {
  title: 'Política de',
  highlight: 'reembolso',
  updated: 'Última atualização: dezembro de 2024',
  guaranteeTitle: 'A nossa garantia',
  guaranteeBodyStart: 'Confiamos na qualidade do PropertyPilot AI. Por isso oferecemos uma',
  guaranteeBodyStrong: 'garantia de reembolso de 14 dias',
  guaranteeBodyEnd: 'em todas as novas subscrições. Se não ficar satisfeito, reembolsamos sem complicações.',
  trialTitle: '1. Período experimental e reembolso',
  freeTrialTitle: 'Teste gratuito de 7 dias',
  freeTrialBody:
    'Todos os planos incluem 7 dias de teste gratuito. Não é necessário cartão para começar. Pode cancelar a qualquer momento durante o teste sem custos.',
  guarantee14Title: 'Garantia de 14 dias',
  guarantee14Body:
    'Se ativar uma subscrição após o teste e não ficar satisfeito, pode solicitar reembolso integral no prazo de 14 dias a partir da data do primeiro pagamento.',
  conditionsTitle: '2. Condições de reembolso',
  conditionsIntro: 'Para obter reembolso deve:',
  conditions: [
    'Solicitar o reembolso no prazo de 14 dias após o primeiro pagamento',
    'Estar no primeiro período de subscrição (renovações excluídas)',
    'Não ter violado os Termos de serviço',
    'Contactar-nos por e-mail com o pedido',
  ],
  nonRefundableTitle: '3. Casos sem reembolso',
  nonRefundableIntro: 'Não há reembolso nos seguintes casos:',
  nonRefundable: [
    'Pedido após 14 dias do pagamento',
    'Renovações automáticas (pode cancelar antes da renovação)',
    'Pacote Agency Boost (serviço único já prestado)',
    'Contas suspensas por violação dos termos',
    'Subscrições anteriores já reembolsadas',
  ],
  cancelTitle: '4. Cancelamento da subscrição',
  cancelIntro: 'Pode cancelar a subscrição a qualquer momento:',
  cancelSteps: [
    'Inicie sessão no painel',
    'Vá a Faturação ou Subscrição',
    'Clique em Cancelar subscrição',
    'Confirme o cancelamento',
  ],
  cancelImportant: 'Importante:',
  cancelImportantBody:
    'O cancelamento produz efeitos no fim do período de faturação em curso. Mantém o acesso até essa data.',
  processTitle: '5. Processo de reembolso',
  process: [
    {
      step: '1',
      title: 'Envie o pedido',
      body: 'Contacte-nos por e-mail com o assunto «Pedido de reembolso» e indique a sua conta.',
    },
    {
      step: '2',
      title: 'Verificação',
      body: 'Verificamos se o pedido cumpre as condições (1–2 dias úteis).',
    },
    {
      step: '3',
      title: 'Processamento',
      body: 'O reembolso é processado via Stripe (5–10 dias até aparecer na conta).',
    },
    {
      step: '✓',
      title: 'Concluído',
      body: 'Receberá confirmação por e-mail quando o reembolso for processado.',
    },
  ],
  boostTitle: '6. Agency Boost — política especial',
  boostIntro: 'O pacote',
  boostProductLabel: 'Agency Boost (2.497 EUR)',
  boostBody: 'é um serviço único de implementação personalizada. Dada a natureza do serviço:',
  boostRules: [
    'Não é reembolsável após o início da implementação',
    'Pode cancelar no prazo de 48 horas após a encomenda se o trabalho ainda não começou',
    'Problemas de entrega serão resolvidos com suporte adicional sem custo',
  ],
  contactTitle: '7. Contacto',
  contactIntro: 'Para pedidos de reembolso ou dúvidas:',
  refundEmail: 'E-mail de reembolsos:',
  supportEmail: 'Suporte geral:',
  contactOutro: 'Respondemos a todos os pedidos no prazo de 24–48 horas úteis.',
  terms: 'Termos e condições',
  privacy: 'Política de privacidade',
  pricing: 'Ver preços',
};
