import type { PrivacyPolicyPageUi } from '@/lib/i18n/privacy-policy-page-ui';
import type { TermsPolicyPageUi } from '@/lib/i18n/terms-policy-page-ui';
import type { RefundPolicyPageUi } from '@/lib/i18n/refund-policy-page-ui';
import { privacyFooterNonIt } from '@/lib/i18n/legal-policy-locales-shared';

export const privacyPolicyPageUiFr: PrivacyPolicyPageUi = {
  title: 'Politique de',
  highlight: 'confidentialité',
  updated: 'Dernière mise à jour : décembre 2024',
  terms: 'Conditions générales',
  refund: 'Politique de remboursement',
  ...privacyFooterNonIt('Pour exercer ces droits, contactez-nous à '),
  sections: [
    {
      iconKey: 'eye',
      color: 'text-electric-blue',
      title: '1. Informations générales',
      body: [
        'PropertyPilot AI (« nous », « notre ») respecte votre vie privée et s’engage à protéger vos données personnelles. Cette notice explique comment nous collectons, utilisons et protégeons vos informations conformément au RGPD et aux lois applicables.',
        'Responsable du traitement : PropertyPilot AI',
        'E-mail : privacy@propertypilotai.com',
      ],
    },
    {
      iconKey: 'database',
      color: 'text-sunset-gold',
      title: '2. Données collectées',
      body: ['Nous collectons les catégories de données suivantes :'],
      lists: [
        {
          title: 'Données fournies directement :',
          items: [
            'Nom complet',
            'Adresse e-mail',
            'Nom de l’agence / société',
            'Informations de paiement (traitées par Stripe)',
            'Contenus immobiliers soumis pour génération IA',
          ],
        },
        {
          title: 'Données collectées automatiquement :',
          items: [
            'Adresse IP',
            'Type de navigateur et d’appareil',
            'Pages visitées et interactions',
            'Cookies techniques et analytiques',
          ],
        },
      ],
    },
    {
      iconKey: 'lock',
      color: 'text-royal-purple',
      title: '3. Utilisation de vos données',
      body: ['Nous utilisons vos données pour :'],
      items: [
        'Fournir et améliorer nos services IA',
        'Gérer votre compte et votre abonnement',
        'Traiter les paiements via Stripe',
        'Vous envoyer des communications liées au service',
        'Analyser l’usage pour améliorer la plateforme',
        'Respecter nos obligations légales',
      ],
      note: 'Nous ne vendons jamais vos données à des tiers.',
    },
    {
      iconKey: 'globe',
      color: 'text-neon-aqua',
      title: '4. Partage des données',
      body: ['Nous partageons vos données uniquement avec :'],
      items: [
        'Stripe : traitement sécurisé des paiements',
        'Supabase : hébergement de base de données et authentification',
        'OpenAI : génération de contenu IA (données minimisées ou anonymisées lorsque possible)',
        'Vercel : hébergement de la plateforme',
      ],
      note: 'Tous nos prestataires offrent des garanties de sécurité appropriées et des mesures alignées sur le RGPD.',
    },
    {
      iconKey: 'userCheck',
      color: 'text-electric-blue',
      title: '5. Vos droits',
      body: ['Sous le RGPD, vous avez le droit de :'],
      items: [
        'Accès : demander une copie de vos données',
        'Rectification : corriger des données inexactes',
        'Effacement : demander la suppression de vos données',
        'Portabilité : recevoir vos données dans un format lisible',
        'Opposition : vous opposer au traitement à des fins marketing',
        'Limitation : limiter le traitement dans certaines circonstances',
      ],
      noteKey: 'exerciseRights',
    },
    {
      title: '6. Cookies',
      body: ['Nous utilisons les types de cookies suivants :'],
      items: [
        'Cookies techniques : nécessaires au fonctionnement du site',
        'Cookies de session : pour maintenir l’authentification',
        'Cookies analytiques : pour comprendre comment vous utilisez le site (anonymisés lorsque possible)',
      ],
      note: 'Vous pouvez gérer les préférences de cookies depuis votre navigateur.',
    },
    {
      title: '7. Sécurité des données',
      body: ['Nous mettons en œuvre des mesures de sécurité avancées :'],
      items: [
        'Chiffrement SSL/TLS pour toutes les communications',
        'Chiffrement des données stockées',
        'Authentification à deux facteurs disponible',
        'Sauvegardes régulières et reprise après sinistre',
        'Accès aux données limité au personnel autorisé',
      ],
    },
    {
      title: '8. Conservation des données',
      body: ['Nous conservons vos données le temps nécessaire à la fourniture du service :'],
      items: [
        'Données de compte : jusqu’à suppression du compte + 30 jours',
        'Données de facturation : 10 ans (obligations fiscales)',
        'Journaux système : 90 jours',
        'Contenu généré : jusqu’à suppression par l’utilisateur',
      ],
    },
    {
      title: '9. Transferts internationaux',
      body: [
        'Certains prestataires peuvent être situés hors EEE. Dans ce cas, nous assurons des garanties appropriées, telles que des clauses contractuelles types ou des mesures équivalentes.',
      ],
    },
    {
      iconKey: 'mail',
      color: 'text-sunset-gold',
      title: '10. Contact et réclamations',
      body: ['Pour toute question relative à la confidentialité ou pour exercer vos droits :'],
      contacts: ['E-mail : privacy@propertypilotai.com'],
      note: 'Vous avez le droit d’introduire une réclamation auprès de l’autorité de protection des données de votre pays.',
    },
  ],
};

export const termsPolicyPageUiFr: TermsPolicyPageUi = {
  title: 'Conditions',
  highlight: 'générales',
  updated: 'Dernière mise à jour : décembre 2024',
  privacy: 'Politique de confidentialité',
  refund: 'Politique de remboursement',
  sections: [
    {
      iconKey: 'fileText',
      color: 'text-electric-blue',
      title: '1. Acceptation des conditions',
      paragraphs: [
        'En utilisant PropertyPilot AI (« Service »), vous acceptez d’être lié par les présentes Conditions générales. Si vous n’acceptez pas ces conditions, veuillez ne pas utiliser le Service.',
        'PropertyPilot AI se réserve le droit de modifier ces conditions à tout moment. Les modifications prennent effet immédiatement après publication sur le site.',
      ],
    },
    {
      iconKey: 'shield',
      color: 'text-neon-aqua',
      title: '2. Description du service',
      paragraphs: ['PropertyPilot AI est une plateforme d’intelligence artificielle qui fournit :'],
      items: [
        'Génération automatique de descriptions immobilières professionnelles',
        'Optimisation SEO des annonces',
        'Traduction multilingue de contenus',
        'Outils CRM pour la gestion des leads',
        'Analyse et audit d’annonces existantes',
        'Génération de supports marketing (PDF, publications sociales)',
      ],
    },
    {
      iconKey: 'checkCircle',
      color: 'text-sunset-gold',
      title: '3. Compte utilisateur',
      paragraphs: ['Pour utiliser PropertyPilot AI, vous devez :'],
      items: [
        'Avoir au moins 18 ans',
        'Fournir des informations d’inscription exactes et complètes',
        'Maintenir la sécurité de votre compte et de votre mot de passe',
        'Nous informer immédiatement de toute utilisation non autorisée',
      ],
      note: 'Vous êtes responsable de toutes les activités effectuées sous votre compte.',
    },
    {
      title: '4. Offres et paiements',
      paragraphs: ['PropertyPilot AI propose différents abonnements :'],
      items: [
        'Starter (197 EUR/mois) : fonctions de base pour agents indépendants',
        'Pro (497 EUR/mois) : CRM complet et automatisations avancées',
        'Agency (897 EUR/mois) : pour des équipes jusqu’à 10 agents',
        'Agency Boost (2 497 EUR ponctuel) : mise en œuvre complète et conseil',
      ],
      note: 'Les paiements sont traités par Stripe. Les prix n’incluent pas la TVA.',
    },
    {
      title: '5. Propriété intellectuelle',
      paragraphs: [
        'Tout contenu généré par l’IA via PropertyPilot AI appartient à l’utilisateur qui l’a généré. PropertyPilot AI conserve les droits sur la plateforme, le logiciel, le design et les éléments associés.',
        'Il est interdit de copier, modifier ou distribuer des parties du Service sans autorisation écrite.',
      ],
    },
    {
      iconKey: 'alertTriangle',
      color: 'text-orange-500',
      title: '6. Limitation de responsabilité',
      paragraphs: [
        'PropertyPilot AI ne garantit pas que le contenu généré par l’IA soit exempt d’erreurs ou adapté à tous les usages. L’utilisateur est responsable de la relecture et de la vérification avant publication.',
        'PropertyPilot AI ne pourra être tenu responsable des dommages indirects, accessoires ou consécutifs liés à l’utilisation du Service.',
      ],
    },
    {
      title: '7. Usage acceptable',
      paragraphs: ['Vous ne pouvez pas utiliser PropertyPilot AI pour :'],
      items: [
        'Des activités illégales ou frauduleuses',
        'Générer du contenu diffamatoire, offensant ou discriminatoire',
        'Violer les droits de tiers',
        'Tenter d’accéder sans autorisation à des systèmes ou données',
        'Distribuer des logiciels malveillants',
      ],
    },
    {
      title: '8. Résiliation et suspension',
      paragraphs: [
        'Vous pouvez supprimer votre compte à tout moment depuis le tableau de bord. PropertyPilot AI se réserve le droit de suspendre ou résilier les comptes qui violent ces conditions.',
      ],
      linkText: 'Politique de remboursement',
      linkIntro: 'Pour la politique de remboursement, consultez notre',
    },
    {
      title: '9. Droit applicable',
      paragraphs: [
        'Les présentes conditions sont régies par le droit italien. Tout litige relève de la compétence des tribunaux de Milan.',
      ],
    },
    {
      title: '10. Contact',
      paragraphs: ['Pour toute question sur ces conditions :'],
      contacts: ['E-mail : legal@propertypilotai.com', 'Support : support@propertypilotai.com'],
    },
  ],
};

export const refundPolicyPageUiFr: RefundPolicyPageUi = {
  title: 'Politique de',
  highlight: 'remboursement',
  updated: 'Dernière mise à jour : décembre 2024',
  guaranteeTitle: 'Notre garantie',
  guaranteeBodyStart: 'Nous avons confiance dans la qualité de PropertyPilot AI. C’est pourquoi nous offrons une',
  guaranteeBodyStrong: 'garantie satisfait ou remboursé de 14 jours',
  guaranteeBodyEnd: 'sur tous les nouveaux abonnements. Si vous n’êtes pas satisfait, nous vous remboursons sans complication.',
  trialTitle: '1. Essai et remboursement',
  freeTrialTitle: 'Essai gratuit de 7 jours',
  freeTrialBody:
    'Tous les plans incluent 7 jours d’essai gratuit. Aucune carte bancaire requise pour commencer. Vous pouvez annuler à tout moment pendant l’essai sans frais.',
  guarantee14Title: 'Garantie 14 jours',
  guarantee14Body:
    'Si vous activez un abonnement après l’essai et n’êtes pas satisfait, vous pouvez demander un remboursement intégral dans les 14 jours suivant la date du premier paiement.',
  conditionsTitle: '2. Conditions de remboursement',
  conditionsIntro: 'Pour obtenir un remboursement, vous devez :',
  conditions: [
    'Demander le remboursement dans les 14 jours suivant le premier paiement',
    'Être sur votre première période d’abonnement (renouvellements exclus)',
    'Ne pas avoir violé les Conditions d’utilisation',
    'Nous contacter par e-mail avec votre demande',
  ],
  nonRefundableTitle: '3. Cas non remboursables',
  nonRefundableIntro: 'Aucun remboursement dans les cas suivants :',
  nonRefundable: [
    'Demande après 14 jours suivant le paiement',
    'Renouvellements automatiques (vous pouvez annuler avant le renouvellement)',
    'Forfait Agency Boost (service ponctuel déjà fourni)',
    'Comptes suspendus pour violation des conditions',
    'Abonnements déjà remboursés par le passé',
  ],
  cancelTitle: '4. Résiliation de l’abonnement',
  cancelIntro: 'Vous pouvez résilier votre abonnement à tout moment :',
  cancelSteps: [
    'Connectez-vous au tableau de bord',
    'Allez dans Facturation ou Abonnement',
    'Cliquez sur Résilier l’abonnement',
    'Confirmez la résiliation',
  ],
  cancelImportant: 'Important :',
  cancelImportantBody:
    'La résiliation prend effet à la fin de la période de facturation en cours. Vous conservez l’accès au service jusqu’à cette date.',
  processTitle: '5. Processus de remboursement',
  process: [
    {
      step: '1',
      title: 'Envoyer la demande',
      body: 'Contactez-nous par e-mail avec l’objet « Demande de remboursement » en précisant votre compte.',
    },
    {
      step: '2',
      title: 'Vérification',
      body: 'Nous vérifions que la demande respecte les conditions (1 à 2 jours ouvrés).',
    },
    {
      step: '3',
      title: 'Traitement',
      body: 'Le remboursement est traité via Stripe (5 à 10 jours pour apparaître sur votre compte).',
    },
    {
      step: '✓',
      title: 'Terminé',
      body: 'Vous recevrez un e-mail de confirmation lorsque le remboursement sera traité.',
    },
  ],
  boostTitle: '6. Agency Boost — politique spécifique',
  boostIntro: 'Le forfait',
  boostProductLabel: 'Agency Boost (2 497 EUR)',
  boostBody: 'est un service ponctuel de mise en œuvre personnalisée. En raison de sa nature :',
  boostRules: [
    'Il n’est pas remboursable une fois la mise en œuvre commencée',
    'Il peut être annulé dans les 48 heures suivant la commande si le travail n’a pas commencé',
    'Tout problème de livraison sera résolu avec un support supplémentaire sans frais',
  ],
  contactTitle: '7. Nous contacter',
  contactIntro: 'Pour les demandes de remboursement ou questions :',
  refundEmail: 'E-mail remboursements :',
  supportEmail: 'Support général :',
  contactOutro: 'Nous répondons à toutes les demandes sous 24 à 48 heures ouvrées.',
  terms: 'Conditions générales',
  privacy: 'Politique de confidentialité',
  pricing: 'Voir les tarifs',
};
