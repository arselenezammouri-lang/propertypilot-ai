/**
 * Billing page chrome (Stripe amounts stay numeric; format with formatCurrencyForLocale in UI).
 * IT/EN: dictionary.ts. ES/FR/DE/PT/AR: this file.
 */

export type BillingUi = {
  title: string;
  titleAccent: string;
  subtitle: string;
  noSubscription: string;
  noActiveSubscription: string;
  viewPlans: string;
  subscribeToUnlock: string;
  currentPlanPrefix: string;
  perMonth: string;
  unlimitedListings: string;
  listingsPerMonth: string;
  nextRenewal: string;
  cancelWarning: string;
  managePayments: string;
  unlockPremium: string;
  specialPackage: string;
  oneTime: string;
  whatIncludes: string;
  buyAgencyBoost: string;
  starterForBeginners: string;
  proForProfessionals: string;
  agencyForTeams: string;
  recommended: string;
  freePlanName: string;
  expiring: string;
  reactivateSubscription: string;
  cancelSubscription: string;
  cancelledTitle: string;
  reactivatedTitle: string;
  completedUpgradeTitle: string;
  changedPlanTitle: string;
  upgradeErrorTitle: string;
  startCheckoutError: string;
  cancelError: string;
  reactivateError: string;
  portalError: string;
  upgradeError: string;
  reloadMessage: string;
  switchToStarter: string;
  switchToPro: string;
  switchToAgency: string;
  upgradeToPro: string;
  upgradeToAgency: string;
  stripeTrust: string;
  subscriptionFetchErrorBody: string;
  retry: string;
  planBadgeStarter: string;
  planBadgePro: string;
  planBadgeAgency: string;
};

export const billingUiEs: BillingUi = {
  title: 'Suscripción',
  titleAccent: 'y facturación',
  subtitle: 'Consulta y gestiona tu plan de suscripción',
  noSubscription: 'Sin suscripción',
  noActiveSubscription: 'Sin suscripción activa',
  viewPlans: 'Ver planes disponibles',
  subscribeToUnlock: 'Suscríbete para desbloquear funciones premium',
  currentPlanPrefix: 'Plan',
  perMonth: '/mes',
  unlimitedListings: 'Anuncios ilimitados',
  listingsPerMonth: 'anuncios al mes',
  nextRenewal: 'Próxima renovación:',
  cancelWarning:
    'La suscripción se cancelará al final del periodo de facturación. Volverás al plan gratuito.',
  managePayments: 'Gestionar pagos',
  unlockPremium: 'Desbloquear funciones premium',
  specialPackage: 'Paquete especial',
  oneTime: 'pago único',
  whatIncludes: 'Qué incluye:',
  buyAgencyBoost: 'Comprar Agency Boost',
  starterForBeginners: 'Para empezar',
  proForProfessionals: 'Para profesionales',
  agencyForTeams: 'Para equipos',
  recommended: 'Recomendado',
  freePlanName: 'Gratis',
  expiring: 'Por expirar',
  reactivateSubscription: 'Reactivar suscripción',
  cancelSubscription: 'Cancelar suscripción',
  cancelledTitle: 'Suscripción cancelada',
  reactivatedTitle: 'Suscripción reactivada',
  completedUpgradeTitle: '¡Mejora completada!',
  changedPlanTitle: '¡Plan modificado!',
  upgradeErrorTitle: 'Error al mejorar el plan',
  startCheckoutError: 'No se pudo iniciar el pago.',
  cancelError: 'No se pudo cancelar la suscripción.',
  reactivateError: 'No se pudo reactivar la suscripción.',
  portalError: 'No se pudo abrir el portal de pagos.',
  upgradeError: 'No se pudo completar la mejora.',
  reloadMessage: 'Recargando página...',
  switchToStarter: 'Cambiar a Starter',
  switchToPro: 'Cambiar a Pro',
  switchToAgency: 'Cambiar a Agency',
  upgradeToPro: 'Mejorar a Pro',
  upgradeToAgency: 'Mejorar a Agency',
  stripeTrust:
    'Pagos seguros con Stripe. Tarjetas, métodos de pago y facturas se gestionan en el portal de cliente de Stripe.',
  subscriptionFetchErrorBody: 'No se pudo cargar la suscripción. Mostramos el plan Free.',
  retry: 'Reintentar',
  planBadgeStarter: 'Starter',
  planBadgePro: 'Pro',
  planBadgeAgency: 'Agency',
};

export const billingUiFr: BillingUi = {
  title: 'Abonnement',
  titleAccent: 'et facturation',
  subtitle: 'Consultez et gérez votre abonnement',
  noSubscription: 'Aucun abonnement',
  noActiveSubscription: 'Aucun abonnement actif',
  viewPlans: 'Voir les forfaits disponibles',
  subscribeToUnlock: 'Abonnez-vous pour débloquer les fonctionnalités premium',
  currentPlanPrefix: 'Forfait',
  perMonth: '/mois',
  unlimitedListings: 'Annonces illimitées',
  listingsPerMonth: 'annonces par mois',
  nextRenewal: 'Prochain renouvellement :',
  cancelWarning:
    'L’abonnement sera résilié à la fin de la période de facturation. Vous reviendrez au forfait gratuit.',
  managePayments: 'Gérer les paiements',
  unlockPremium: 'Débloquer le premium',
  specialPackage: 'Offre spéciale',
  oneTime: 'paiement unique',
  whatIncludes: 'Contenu :',
  buyAgencyBoost: 'Acheter Agency Boost',
  starterForBeginners: 'Pour commencer',
  proForProfessionals: 'Pour les professionnels',
  agencyForTeams: 'Pour les équipes',
  recommended: 'Recommandé',
  freePlanName: 'Gratuit',
  expiring: 'Expire bientôt',
  reactivateSubscription: 'Réactiver l’abonnement',
  cancelSubscription: 'Résilier l’abonnement',
  cancelledTitle: 'Abonnement résilié',
  reactivatedTitle: 'Abonnement réactivé',
  completedUpgradeTitle: 'Mise à niveau terminée !',
  changedPlanTitle: 'Forfait modifié !',
  upgradeErrorTitle: 'Erreur de mise à niveau',
  startCheckoutError: 'Impossible de démarrer le paiement.',
  cancelError: 'Impossible de résilier l’abonnement.',
  reactivateError: 'Impossible de réactiver l’abonnement.',
  portalError: 'Impossible d’ouvrir le portail de facturation.',
  upgradeError: 'Impossible de terminer la mise à niveau.',
  reloadMessage: 'Rechargement de la page...',
  switchToStarter: 'Passer à Starter',
  switchToPro: 'Passer à Pro',
  switchToAgency: 'Passer à Agency',
  upgradeToPro: 'Passer à Pro',
  upgradeToAgency: 'Passer à Agency',
  stripeTrust:
    'Paiements sécurisés par Stripe. Cartes, moyens de paiement et factures sont gérés dans le portail client Stripe.',
  subscriptionFetchErrorBody: 'Impossible de charger l’abonnement. Affichage du forfait Free.',
  retry: 'Réessayer',
  planBadgeStarter: 'Starter',
  planBadgePro: 'Pro',
  planBadgeAgency: 'Agency',
};

export const billingUiDe: BillingUi = {
  title: 'Abo',
  titleAccent: '& Abrechnung',
  subtitle: 'Tarif ansehen und verwalten',
  noSubscription: 'Kein Abonnement',
  noActiveSubscription: 'Kein aktives Abonnement',
  viewPlans: 'Verfügbare Tarife anzeigen',
  subscribeToUnlock: 'Abonnieren, um Premium-Funktionen freizuschalten',
  currentPlanPrefix: 'Tarif',
  perMonth: '/Monat',
  unlimitedListings: 'Unbegrenzte Inserate',
  listingsPerMonth: 'Inserate pro Monat',
  nextRenewal: 'Nächste Verlängerung:',
  cancelWarning:
    'Das Abo endet am Ende des Abrechnungszeitraums. Sie wechseln zum kostenlosen Tarif.',
  managePayments: 'Zahlungen verwalten',
  unlockPremium: 'Premium freischalten',
  specialPackage: 'Sonderpaket',
  oneTime: 'einmalig',
  whatIncludes: 'Enthalten:',
  buyAgencyBoost: 'Agency Boost kaufen',
  starterForBeginners: 'Zum Einstieg',
  proForProfessionals: 'Für Profis',
  agencyForTeams: 'Für Teams',
  recommended: 'Empfohlen',
  freePlanName: 'Kostenlos',
  expiring: 'Läuft aus',
  reactivateSubscription: 'Abo reaktivieren',
  cancelSubscription: 'Abo kündigen',
  cancelledTitle: 'Abo gekündigt',
  reactivatedTitle: 'Abo reaktiviert',
  completedUpgradeTitle: 'Upgrade abgeschlossen!',
  changedPlanTitle: 'Tarif geändert!',
  upgradeErrorTitle: 'Upgrade-Fehler',
  startCheckoutError: 'Checkout konnte nicht gestartet werden.',
  cancelError: 'Kündigung fehlgeschlagen.',
  reactivateError: 'Reaktivierung fehlgeschlagen.',
  portalError: 'Zahlungsportal konnte nicht geöffnet werden.',
  upgradeError: 'Upgrade konnte nicht abgeschlossen werden.',
  reloadMessage: 'Seite wird neu geladen...',
  switchToStarter: 'Zu Starter wechseln',
  switchToPro: 'Zu Pro wechseln',
  switchToAgency: 'Zu Agency wechseln',
  upgradeToPro: 'Auf Pro upgraden',
  upgradeToAgency: 'Auf Agency upgraden',
  stripeTrust:
    'Sichere Zahlungen mit Stripe. Karten, Zahlungsmethoden und Rechnungen werden im Stripe-Kundenportal verwaltet.',
  subscriptionFetchErrorBody: 'Abo konnte nicht geladen werden. Es wird der Free-Tarif angezeigt.',
  retry: 'Erneut versuchen',
  planBadgeStarter: 'Starter',
  planBadgePro: 'Pro',
  planBadgeAgency: 'Agency',
};

export const billingUiPt: BillingUi = {
  title: 'Subscrição',
  titleAccent: 'e faturação',
  subtitle: 'Veja e gira o seu plano de subscrição',
  noSubscription: 'Sem subscrição',
  noActiveSubscription: 'Sem subscrição ativa',
  viewPlans: 'Ver planos disponíveis',
  subscribeToUnlock: 'Subscreva para desbloquear funcionalidades premium',
  currentPlanPrefix: 'Plano',
  perMonth: '/mês',
  unlimitedListings: 'Anúncios ilimitados',
  listingsPerMonth: 'anúncios por mês',
  nextRenewal: 'Próxima renovação:',
  cancelWarning:
    'A subscrição será cancelada no fim do período de faturação. Voltará ao plano gratuito.',
  managePayments: 'Gerir pagamentos',
  unlockPremium: 'Desbloquear premium',
  specialPackage: 'Pacote especial',
  oneTime: 'pagamento único',
  whatIncludes: 'O que inclui:',
  buyAgencyBoost: 'Comprar Agency Boost',
  starterForBeginners: 'Para começar',
  proForProfessionals: 'Para profissionais',
  agencyForTeams: 'Para equipas',
  recommended: 'Recomendado',
  freePlanName: 'Grátis',
  expiring: 'A expirar',
  reactivateSubscription: 'Reativar subscrição',
  cancelSubscription: 'Cancelar subscrição',
  cancelledTitle: 'Subscrição cancelada',
  reactivatedTitle: 'Subscrição reativada',
  completedUpgradeTitle: 'Upgrade concluído!',
  changedPlanTitle: 'Plano alterado!',
  upgradeErrorTitle: 'Erro no upgrade',
  startCheckoutError: 'Não foi possível iniciar o pagamento.',
  cancelError: 'Não foi possível cancelar a subscrição.',
  reactivateError: 'Não foi possível reativar a subscrição.',
  portalError: 'Não foi possível abrir o portal de pagamentos.',
  upgradeError: 'Não foi possível concluir o upgrade.',
  reloadMessage: 'A recarregar a página...',
  switchToStarter: 'Mudar para Starter',
  switchToPro: 'Mudar para Pro',
  switchToAgency: 'Mudar para Agency',
  upgradeToPro: 'Upgrade para Pro',
  upgradeToAgency: 'Upgrade para Agency',
  stripeTrust:
    'Pagamentos seguros com Stripe. Cartões, métodos de pagamento e faturas são geridos no portal de cliente Stripe.',
  subscriptionFetchErrorBody: 'Não foi possível carregar a subscrição. A mostrar o plano Free.',
  retry: 'Tentar novamente',
  planBadgeStarter: 'Starter',
  planBadgePro: 'Pro',
  planBadgeAgency: 'Agency',
};

export const billingUiAr: BillingUi = {
  title: 'الاشتراك',
  titleAccent: 'والفوترة',
  subtitle: 'اعرض خطتك وادِر اشتراكك',
  noSubscription: 'لا يوجد اشتراك',
  noActiveSubscription: 'لا يوجد اشتراك نشط',
  viewPlans: 'عرض الخطط المتاحة',
  subscribeToUnlock: 'اشترك لفتح الميزات المميزة',
  currentPlanPrefix: 'الخطة',
  perMonth: '/شهر',
  unlimitedListings: 'إعلانات غير محدودة',
  listingsPerMonth: 'إعلانات شهرياً',
  nextRenewal: 'التجديد التالي:',
  cancelWarning:
    'سيلغى الاشتراك في نهاية فترة الفوترة. ستعود إلى الخطة المجانية.',
  managePayments: 'إدارة المدفوعات',
  unlockPremium: 'فتح الميزات المميزة',
  specialPackage: 'باقة خاصة',
  oneTime: 'دفعة لمرة واحدة',
  whatIncludes: 'ما يشمله:',
  buyAgencyBoost: 'شراء Agency Boost',
  starterForBeginners: 'للبدء',
  proForProfessionals: 'للمحترفين',
  agencyForTeams: 'للفرق',
  recommended: 'موصى به',
  freePlanName: 'مجاني',
  expiring: 'ينتهي قريباً',
  reactivateSubscription: 'إعادة تفعيل الاشتراك',
  cancelSubscription: 'إلغاء الاشتراك',
  cancelledTitle: 'تم إلغاء الاشتراك',
  reactivatedTitle: 'تمت إعادة تفعيل الاشتراك',
  completedUpgradeTitle: 'اكتملت الترقية!',
  changedPlanTitle: 'تم تغيير الخطة!',
  upgradeErrorTitle: 'خطأ في الترقية',
  startCheckoutError: 'تعذر بدء الدفع.',
  cancelError: 'تعذر إلغاء الاشتراك.',
  reactivateError: 'تعذر إعادة تفعيل الاشتراك.',
  portalError: 'تعذر فتح بوابة الفوترة.',
  upgradeError: 'تعذر إكمال الترقية.',
  reloadMessage: 'جاري إعادة تحميل الصفحة...',
  switchToStarter: 'التبديل إلى Starter',
  switchToPro: 'التبديل إلى Pro',
  switchToAgency: 'التبديل إلى Agency',
  upgradeToPro: 'الترقية إلى Pro',
  upgradeToAgency: 'الترقية إلى Agency',
  stripeTrust:
    'مدفوعات آمنة عبر Stripe. تُدار البطاقات وطرق الدفع والفواتير في بوابة عميل Stripe.',
  subscriptionFetchErrorBody: 'تعذر تحميل الاشتراك. نعرض خطة Free.',
  retry: 'إعادة المحاولة',
  planBadgeStarter: 'Starter',
  planBadgePro: 'Pro',
  planBadgeAgency: 'Agency',
};
