/**
 * Error boundary / API handler + welcome tour modal.
 * IT/EN: error-boundary-ui.ts, welcome-tour-ui.ts.
 */
import type { ErrorBoundaryModuleUi } from '@/lib/i18n/error-boundary-ui';
import type { WelcomeTourUi } from '@/lib/i18n/welcome-tour-ui';

export const errorBoundaryModuleUiEs: ErrorBoundaryModuleUi = {
  boundary: {
    title: 'Algo salió mal',
    desc: 'Ocurrió un error inesperado. Tus datos están a salvo.',
    unknown: 'Error desconocido',
    retry: 'Reintentar',
    reload: 'Recargar página',
  },
  apiHandler: {
    configError: 'Error de configuración. Contacta con soporte.',
    quotaError: 'Cuota de IA agotada temporalmente. Inténtalo de nuevo en unos minutos.',
    rateLimitError: 'Demasiadas solicitudes. Espera unos segundos antes de reintentar.',
    timeoutError: 'El servicio tarda demasiado. Inténtalo de nuevo en un momento.',
    genericError: 'Se produjo un error. Inténtalo más tarde.',
  },
};

export const welcomeTourUiEs: WelcomeTourUi = {
  scanSync: 'Sincronizando con portales globales…',
  scanArbitrage: 'Analizando arbitraje…',
  scanRadar: 'Radar de competencia activado…',
  welcomeTitle: 'Bienvenido al futuro del sector inmobiliario',
  preparingDesc: 'Estamos preparando tu centro de mando',
  dealsFoundLead: 'Encontrados ',
  dealsFoundHighlight: '3 deals oro',
  dealsFoundTail: ' en tu zona',
  dealsDesc:
    'El sistema ya ha escaneado los portales y ha encontrado oportunidades con un market gap significativo.',
  dealLabel: 'Deal n.º {n}',
  unlockBtn: 'Pulsa para desbloquear tu primera comisión',
  closeAria: 'Cerrar',
};

export const errorBoundaryModuleUiFr: ErrorBoundaryModuleUi = {
  boundary: {
    title: 'Une erreur s’est produite',
    desc: 'Une erreur inattendue est survenue. Vos données sont en sécurité.',
    unknown: 'Erreur inconnue',
    retry: 'Réessayer',
    reload: 'Recharger la page',
  },
  apiHandler: {
    configError: 'Erreur de configuration. Contactez le support.',
    quotaError: 'Quota IA temporairement épuisée. Réessayez dans quelques minutes.',
    rateLimitError: 'Trop de requêtes. Attendez quelques secondes avant de réessayer.',
    timeoutError: 'Le service met trop longtemps à répondre. Réessayez dans un instant.',
    genericError: 'Une erreur s’est produite. Réessayez plus tard.',
  },
};

export const welcomeTourUiFr: WelcomeTourUi = {
  scanSync: 'Synchronisation avec les portails mondiaux…',
  scanArbitrage: 'Analyse d’arbitrage en cours…',
  scanRadar: 'Radar concurrentiel activé…',
  welcomeTitle: 'Bienvenue dans l’avenir de l’immobilier',
  preparingDesc: 'Nous préparons votre centre de commande',
  dealsFoundLead: 'Trouvé ',
  dealsFoundHighlight: '3 deals en or',
  dealsFoundTail: ' dans votre secteur',
  dealsDesc:
    'Le système a déjà scanné les portails et trouvé des opportunités avec un écart de marché significatif.',
  dealLabel: 'Deal n°{n}',
  unlockBtn: 'Cliquez pour débloquer votre première commission',
  closeAria: 'Fermer',
};

export const errorBoundaryModuleUiDe: ErrorBoundaryModuleUi = {
  boundary: {
    title: 'Etwas ist schiefgelaufen',
    desc: 'Ein unerwarteter Fehler ist aufgetreten. Ihre Daten sind sicher.',
    unknown: 'Unbekannter Fehler',
    retry: 'Erneut versuchen',
    reload: 'Seite neu laden',
  },
  apiHandler: {
    configError: 'Konfigurationsfehler. Bitte Support kontaktieren.',
    quotaError: 'KI-Kontingent vorübergehend erschöpft. Bitte in einigen Minuten erneut versuchen.',
    rateLimitError: 'Zu viele Anfragen. Bitte einige Sekunden warten.',
    timeoutError: 'Der Dienst antwortet zu langsam. Bitte gleich erneut versuchen.',
    genericError: 'Ein Fehler ist aufgetreten. Bitte später erneut versuchen.',
  },
};

export const welcomeTourUiDe: WelcomeTourUi = {
  scanSync: 'Synchronisation mit globalen Portalen…',
  scanArbitrage: 'Arbitrage-Analyse läuft…',
  scanRadar: 'Wettbewerbs-Radar aktiviert…',
  welcomeTitle: 'Willkommen in der Zukunft der Immobilienbranche',
  preparingDesc: 'Wir bereiten Ihre Kommandozentrale vor',
  dealsFoundLead: 'Gefunden: ',
  dealsFoundHighlight: '3 Gold-Deals',
  dealsFoundTail: ' in Ihrer Region',
  dealsDesc:
    'Das System hat die Portale bereits gescannt und Chancen mit signifikantem Marktgefälle gefunden.',
  dealLabel: 'Deal Nr. {n}',
  unlockBtn: 'Klicken Sie, um Ihre erste Provision freizuschalten',
  closeAria: 'Schließen',
};

export const errorBoundaryModuleUiPt: ErrorBoundaryModuleUi = {
  boundary: {
    title: 'Algo correu mal',
    desc: 'Ocorreu um erro inesperado. Os seus dados estão seguros.',
    unknown: 'Erro desconhecido',
    retry: 'Tentar novamente',
    reload: 'Recarregar página',
  },
  apiHandler: {
    configError: 'Erro de configuração. Contacte o suporte.',
    quotaError: 'Quota de IA esgotada temporariamente. Tente novamente dentro de alguns minutos.',
    rateLimitError: 'Demasiados pedidos. Aguarde alguns segundos antes de tentar de novo.',
    timeoutError: 'O serviço está a demorar demasiado. Tente novamente dentro de momentos.',
    genericError: 'Ocorreu um erro. Tente novamente mais tarde.',
  },
};

export const welcomeTourUiPt: WelcomeTourUi = {
  scanSync: 'A sincronizar com portais globais…',
  scanArbitrage: 'A analisar arbitragem…',
  scanRadar: 'Radar de concorrentes ativado…',
  welcomeTitle: 'Bem-vindo ao futuro do imobiliário',
  preparingDesc: 'Estamos a preparar o seu centro de comando',
  dealsFoundLead: 'Encontrados ',
  dealsFoundHighlight: '3 negócios ouro',
  dealsFoundTail: ' na sua zona',
  dealsDesc:
    'O sistema já analisou os portais e encontrou oportunidades com market gap significativo.',
  dealLabel: 'Negócio n.º {n}',
  unlockBtn: 'Clique para desbloquear a sua primeira comissão',
  closeAria: 'Fechar',
};

export const errorBoundaryModuleUiAr: ErrorBoundaryModuleUi = {
  boundary: {
    title: 'حدث خطأ ما',
    desc: 'حدث خطأ غير متوقع. بياناتك آمنة.',
    unknown: 'خطأ غير معروف',
    retry: 'إعادة المحاولة',
    reload: 'إعادة تحميل الصفحة',
  },
  apiHandler: {
    configError: 'خطأ في الإعداد. تواصل مع الدعم.',
    quotaError: 'نفاد حصة الذكاء الاصطناعي مؤقتاً. أعد المحاولة بعد دقائق.',
    rateLimitError: 'طلبات كثيرة جداً. انتظر ثوانٍ قبل إعادة المحاولة.',
    timeoutError: 'الخدمة تستغرق وقتاً طويلاً. أعد المحاولة بعد لحظات.',
    genericError: 'حدث خطأ. أعد المحاولة لاحقاً.',
  },
};

export const welcomeTourUiAr: WelcomeTourUi = {
  scanSync: 'مزامنة مع البوابات العالمية…',
  scanArbitrage: 'جاري تحليل المراجحة…',
  scanRadar: 'تم تفعيل رادار المنافسين…',
  welcomeTitle: 'مرحباً بك في مستقبل العقارات',
  preparingDesc: 'نجهّز مركز قيادتك',
  dealsFoundLead: 'تم العثور على ',
  dealsFoundHighlight: '3 صفقات ذهبية',
  dealsFoundTail: ' في منطقتك',
  dealsDesc:
    'قام النظام بفحص البوابات ووجد فرصاً بفجوة سوقية كبيرة.',
  dealLabel: 'صفقة رقم {n}',
  unlockBtn: 'انقر لفتح أول عمولة لك',
  closeAria: 'إغلاق',
};
