/**
 * Pending checkout banner + Aria limit modal — ES / FR / DE / PT / AR.
 * IT/EN: pending-checkout-ui.ts, aria-limit-modal-ui.ts.
 */
import type { AriaLimitModalUi } from '@/lib/i18n/aria-limit-modal-ui';
import type { PendingCheckoutUi } from '@/lib/i18n/pending-checkout-ui';

export const pendingCheckoutUiEs: PendingCheckoutUi = {
  planNames: { starter: 'Starter', pro: 'Pro', agency: 'Agency', boost: 'Agency Boost' },
  syncError: 'Error al sincronizar',
  syncDone: '¡Sincronización completada!',
  syncPlan: 'Plan actual: {plan}',
  errorTitle: 'Error',
  invalidPlan: 'Plan no válido',
  checkoutError: 'Error al crear el checkout',
  checkoutUrlMissing: 'No se recibió la URL de checkout',
  paymentError: 'No se pudo iniciar el pago',
  closeLabel: 'Cerrar',
  activatePlan: 'Completa la activación del plan {name}',
  activateDesc:
    'Seleccionaste el plan {name} ({price}). Pulsa el botón para completar el pago y activar todas las funciones.',
  loading: 'Cargando…',
  goToPayment: 'Ir al pago',
  syncing: 'Sincronizando…',
  alreadyPaid: '¿Ya pagaste? Sincronizar',
};

export const ariaLimitModalUiEs: AriaLimitModalUi = {
  title: '¡Has alcanzado el límite!',
  desc: 'Has usado {used} de tus {lim} anuncios mensuales con el plan {plan}.',
  recommended: 'RECOMENDADO',
  ariaQuote: '"Pasa a {name} para seguir dominando el mercado." — Aria',
  later: 'Más tarde',
  upgradeTo: 'Pasar a {name}',
  upgrades: {
    free: {
      next: 'starter',
      nextPlan: 'Starter',
      features: ['50 anuncios/mes', 'Todas las herramientas IA', 'PDF profesionales'],
    },
    starter: {
      next: 'pro',
      nextPlan: 'Pro',
      features: ['200 anuncios/mes', 'CRM completo', 'Lead scoring IA', '20 automatizaciones'],
    },
    pro: {
      next: 'agency',
      nextPlan: 'Agency',
      features: [
        'Anuncios ilimitados',
        '10 usuarios incluidos',
        'Voice IA 24/7',
        'Soporte prioritario',
      ],
    },
  },
};

export const pendingCheckoutUiFr: PendingCheckoutUi = {
  planNames: { starter: 'Starter', pro: 'Pro', agency: 'Agency', boost: 'Agency Boost' },
  syncError: 'Erreur lors de la synchronisation',
  syncDone: 'Synchronisation terminée !',
  syncPlan: 'Forfait actuel : {plan}',
  errorTitle: 'Erreur',
  invalidPlan: 'Forfait non valide',
  checkoutError: 'Erreur lors de la création du paiement',
  checkoutUrlMissing: 'URL de paiement non reçue',
  paymentError: 'Impossible de démarrer le paiement',
  closeLabel: 'Fermer',
  activatePlan: 'Finaliser l’activation du forfait {name}',
  activateDesc:
    'Vous avez choisi le forfait {name} ({price}). Cliquez sur le bouton pour payer et activer toutes les fonctionnalités.',
  loading: 'Chargement…',
  goToPayment: 'Aller au paiement',
  syncing: 'Synchronisation…',
  alreadyPaid: 'Déjà payé ? Synchroniser',
};

export const ariaLimitModalUiFr: AriaLimitModalUi = {
  title: 'Vous avez atteint la limite !',
  desc: 'Vous avez utilisé {used} sur {lim} annonces mensuelles avec le forfait {plan}.',
  recommended: 'RECOMMANDÉ',
  ariaQuote: '"Passez à {name} pour continuer à dominer le marché !" — Aria',
  later: 'Plus tard',
  upgradeTo: 'Passer à {name}',
  upgrades: {
    free: {
      next: 'starter',
      nextPlan: 'Starter',
      features: ['50 annonces/mois', 'Tous les outils IA', 'PDF professionnels'],
    },
    starter: {
      next: 'pro',
      nextPlan: 'Pro',
      features: ['200 annonces/mois', 'CRM complet', 'Lead scoring IA', '20 automatisations'],
    },
    pro: {
      next: 'agency',
      nextPlan: 'Agency',
      features: [
        'Annonces illimitées',
        '10 utilisateurs inclus',
        'Voice IA 24/7',
        'Support prioritaire',
      ],
    },
  },
};

export const pendingCheckoutUiDe: PendingCheckoutUi = {
  planNames: { starter: 'Starter', pro: 'Pro', agency: 'Agency', boost: 'Agency Boost' },
  syncError: 'Fehler bei der Synchronisierung',
  syncDone: 'Synchronisierung abgeschlossen!',
  syncPlan: 'Aktueller Tarif: {plan}',
  errorTitle: 'Fehler',
  invalidPlan: 'Ungültiger Tarif',
  checkoutError: 'Fehler beim Erstellen des Checkouts',
  checkoutUrlMissing: 'Checkout-URL nicht erhalten',
  paymentError: 'Zahlung konnte nicht gestartet werden',
  closeLabel: 'Schließen',
  activatePlan: '{name}-Tarif aktivieren abschließen',
  activateDesc:
    'Sie haben den Tarif {name} ({price}) gewählt. Klicken Sie auf die Schaltfläche, um zu zahlen und alle Funktionen zu aktivieren.',
  loading: 'Wird geladen…',
  goToPayment: 'Zur Zahlung',
  syncing: 'Synchronisiert…',
  alreadyPaid: 'Bereits bezahlt? Synchronisieren',
};

export const ariaLimitModalUiDe: AriaLimitModalUi = {
  title: 'Limit erreicht!',
  desc: 'Sie haben {used} von {lim} monatlichen Inseraten im Tarif {plan} genutzt.',
  recommended: 'EMPFOHLEN',
  ariaQuote: '"Wechseln Sie zu {name} und dominieren Sie weiter den Markt!" — Aria',
  later: 'Später',
  upgradeTo: 'Wechseln zu {name}',
  upgrades: {
    free: {
      next: 'starter',
      nextPlan: 'Starter',
      features: ['50 Inserate/Monat', 'Alle KI-Tools', 'Professionelle PDFs'],
    },
    starter: {
      next: 'pro',
      nextPlan: 'Pro',
      features: ['200 Inserate/Monat', 'Voll-CRM', 'KI-Lead-Scoring', '20 Automatisierungen'],
    },
    pro: {
      next: 'agency',
      nextPlan: 'Agency',
      features: [
        'Unbegrenzte Inserate',
        '10 Nutzer inklusive',
        'Voice-KI 24/7',
        'Prioritäts-Support',
      ],
    },
  },
};

export const pendingCheckoutUiPt: PendingCheckoutUi = {
  planNames: { starter: 'Starter', pro: 'Pro', agency: 'Agency', boost: 'Agency Boost' },
  syncError: 'Erro ao sincronizar',
  syncDone: 'Sincronização concluída!',
  syncPlan: 'Plano atual: {plan}',
  errorTitle: 'Erro',
  invalidPlan: 'Plano inválido',
  checkoutError: 'Erro ao criar o checkout',
  checkoutUrlMissing: 'URL de checkout não recebida',
  paymentError: 'Não foi possível iniciar o pagamento',
  closeLabel: 'Fechar',
  activatePlan: 'Concluir a ativação do plano {name}',
  activateDesc:
    'Selecionou o plano {name} ({price}). Clique no botão para concluir o pagamento e ativar todas as funcionalidades.',
  loading: 'A carregar…',
  goToPayment: 'Ir para o pagamento',
  syncing: 'A sincronizar…',
  alreadyPaid: 'Já pagou? Sincronizar',
};

export const ariaLimitModalUiPt: AriaLimitModalUi = {
  title: 'Atingiu o limite!',
  desc: 'Utilizou {used} dos seus {lim} anúncios mensais no plano {plan}.',
  recommended: 'RECOMENDADO',
  ariaQuote: '"Mude para {name} para continuar a dominar o mercado!" — Aria',
  later: 'Mais tarde',
  upgradeTo: 'Mudar para {name}',
  upgrades: {
    free: {
      next: 'starter',
      nextPlan: 'Starter',
      features: ['50 anúncios/mês', 'Todas as ferramentas IA', 'PDFs profissionais'],
    },
    starter: {
      next: 'pro',
      nextPlan: 'Pro',
      features: ['200 anúncios/mês', 'CRM completo', 'Lead scoring IA', '20 automações'],
    },
    pro: {
      next: 'agency',
      nextPlan: 'Agency',
      features: [
        'Anúncios ilimitados',
        '10 utilizadores incluídos',
        'Voice IA 24/7',
        'Suporte prioritário',
      ],
    },
  },
};

export const pendingCheckoutUiAr: PendingCheckoutUi = {
  planNames: { starter: 'Starter', pro: 'Pro', agency: 'Agency', boost: 'Agency Boost' },
  syncError: 'خطأ أثناء المزامنة',
  syncDone: 'اكتملت المزامنة!',
  syncPlan: 'الخطة الحالية: {plan}',
  errorTitle: 'خطأ',
  invalidPlan: 'خطة غير صالحة',
  checkoutError: 'خطأ في إنشاء الدفع',
  checkoutUrlMissing: 'لم يتم استلام رابط الدفع',
  paymentError: 'تعذر بدء الدفع',
  closeLabel: 'إغلاق',
  activatePlan: 'أكمل تفعيل خطة {name}',
  activateDesc:
    'اخترت خطة {name} ({price}). اضغط الزر لإكمال الدفع وتفعيل كل الميزات.',
  loading: 'جاري التحميل…',
  goToPayment: 'الانتقال إلى الدفع',
  syncing: 'جاري المزامنة…',
  alreadyPaid: 'دفعت بالفعل؟ مزامنة',
};

export const ariaLimitModalUiAr: AriaLimitModalUi = {
  title: 'وصلتَ إلى الحد!',
  desc: 'استخدمت {used} من أصل {lim} إعلان شهري ضمن خطة {plan}.',
  recommended: 'موصى به',
  ariaQuote: '"ترقَ إلى {name} وواصل السيطرة على السوق!" — آريا',
  later: 'لاحقاً',
  upgradeTo: 'الترقية إلى {name}',
  upgrades: {
    free: {
      next: 'starter',
      nextPlan: 'Starter',
      features: ['50 إعلان/شهر', 'كل أدوات الذكاء الاصطناعي', 'ملفات PDF احترافية'],
    },
    starter: {
      next: 'pro',
      nextPlan: 'Pro',
      features: ['200 إعلان/شهر', 'CRM كامل', 'تسجيل نقاط العملاء بالذكاء الاصطناعي', '20 أتمتة'],
    },
    pro: {
      next: 'agency',
      nextPlan: 'Agency',
      features: [
        'إعلانات غير محدودة',
        '10 مستخدمين مشمولين',
        'صوت بالذكاء الاصطناعي 24/7',
        'دعم ذو أولوية',
      ],
    },
  },
};
