/**
 * Global `errors` (404 / error boundary pages) + `common` actions.
 * IT/EN: dictionary.ts (it/en blocks). ES–AR: merged in dictionary — replaces partial `common` + adds `errors`.
 */

type Errors = {
  somethingWentWrong: string;
  unexpectedError: string;
  unknownError: string;
  errorId: string;
  tryAgain: string;
  backToHome: string;
  pageNotFound: string;
  pageNotFoundDesc: string;
  dashboard: string;
  dashboardAreaErrorTitle: string;
  dashboardAreaErrorDesc: string;
  backToDashboard: string;
};

type Common = {
  copy: string;
  share: string;
  send: string;
  cancel: string;
  confirm: string;
  save: string;
  delete: string;
  edit: string;
  view: string;
  loading: string;
  error: string;
};

export const errorsUiEs: Errors = {
  somethingWentWrong: 'Algo salió mal',
  unexpectedError: 'Ocurrió un error inesperado. No te preocupes, tus datos están a salvo.',
  unknownError: 'Error desconocido',
  errorId: 'ID de error',
  tryAgain: 'Reintentar',
  backToHome: 'Volver al inicio',
  pageNotFound: 'Página no encontrada',
  pageNotFoundDesc: 'La página que buscas no existe o se ha movido.',
  dashboard: 'Panel',
  dashboardAreaErrorTitle: 'Algo salió mal',
  dashboardAreaErrorDesc:
    'Ocurrió un error en el panel. Puedes reintentar o volver al inicio del panel.',
  backToDashboard: 'Volver al panel',
};

export const commonFullEs: Common = {
  copy: 'Copiar',
  share: 'Compartir',
  send: 'Enviar',
  cancel: 'Cancelar',
  confirm: 'Confirmar',
  save: 'Guardar',
  delete: 'Eliminar',
  edit: 'Editar',
  view: 'Ver',
  loading: 'Cargando...',
  error: 'Error',
};

export const errorsUiFr: Errors = {
  somethingWentWrong: 'Une erreur s’est produite',
  unexpectedError: 'Une erreur inattendue est survenue. Ne vous inquiétez pas, vos données sont en sécurité.',
  unknownError: 'Erreur inconnue',
  errorId: 'ID d’erreur',
  tryAgain: 'Réessayer',
  backToHome: 'Retour à l’accueil',
  pageNotFound: 'Page introuvable',
  pageNotFoundDesc: 'La page que vous recherchez n’existe pas ou a été déplacée.',
  dashboard: 'Tableau de bord',
  dashboardAreaErrorTitle: 'Une erreur s’est produite',
  dashboardAreaErrorDesc:
    'Une erreur s’est produite dans le tableau de bord. Réessayez ou revenez à l’accueil du tableau de bord.',
  backToDashboard: 'Retour au tableau de bord',
};

export const commonFullFr: Common = {
  copy: 'Copier',
  share: 'Partager',
  send: 'Envoyer',
  cancel: 'Annuler',
  confirm: 'Confirmer',
  save: 'Enregistrer',
  delete: 'Supprimer',
  edit: 'Modifier',
  view: 'Voir',
  loading: 'Chargement...',
  error: 'Erreur',
};

export const errorsUiDe: Errors = {
  somethingWentWrong: 'Etwas ist schiefgelaufen',
  unexpectedError: 'Ein unerwarteter Fehler ist aufgetreten. Keine Sorge, Ihre Daten sind sicher.',
  unknownError: 'Unbekannter Fehler',
  errorId: 'Fehler-ID',
  tryAgain: 'Erneut versuchen',
  backToHome: 'Zur Startseite',
  pageNotFound: 'Seite nicht gefunden',
  pageNotFoundDesc: 'Die gesuchte Seite existiert nicht oder wurde verschoben.',
  dashboard: 'Dashboard',
  dashboardAreaErrorTitle: 'Etwas ist schiefgelaufen',
  dashboardAreaErrorDesc:
    'Im Dashboard ist ein Fehler aufgetreten. Versuchen Sie es erneut oder kehren Sie zur Dashboard-Startseite zurück.',
  backToDashboard: 'Zurück zum Dashboard',
};

export const commonFullDe: Common = {
  copy: 'Kopieren',
  share: 'Teilen',
  send: 'Senden',
  cancel: 'Abbrechen',
  confirm: 'Bestätigen',
  save: 'Speichern',
  delete: 'Löschen',
  edit: 'Bearbeiten',
  view: 'Anzeigen',
  loading: 'Wird geladen...',
  error: 'Fehler',
};

export const errorsUiPt: Errors = {
  somethingWentWrong: 'Algo correu mal',
  unexpectedError: 'Ocorreu um erro inesperado. Não se preocupe, os seus dados estão seguros.',
  unknownError: 'Erro desconhecido',
  errorId: 'ID do erro',
  tryAgain: 'Tentar novamente',
  backToHome: 'Voltar ao início',
  pageNotFound: 'Página não encontrada',
  pageNotFoundDesc: 'A página que procura não existe ou foi movida.',
  dashboard: 'Painel',
  dashboardAreaErrorTitle: 'Algo correu mal',
  dashboardAreaErrorDesc:
    'Ocorreu um erro no painel. Pode tentar novamente ou voltar ao início do painel.',
  backToDashboard: 'Voltar ao painel',
};

export const commonFullPt: Common = {
  copy: 'Copiar',
  share: 'Compartilhar',
  send: 'Enviar',
  cancel: 'Cancelar',
  confirm: 'Confirmar',
  save: 'Salvar',
  delete: 'Excluir',
  edit: 'Editar',
  view: 'Visualizar',
  loading: 'A carregar...',
  error: 'Erro',
};

export const errorsUiAr: Errors = {
  somethingWentWrong: 'حدث خطأ ما',
  unexpectedError: 'حدث خطأ غير متوقع. لا تقلق، بياناتك آمنة.',
  unknownError: 'خطأ غير معروف',
  errorId: 'معرّف الخطأ',
  tryAgain: 'إعادة المحاولة',
  backToHome: 'العودة للرئيسية',
  pageNotFound: 'الصفحة غير موجودة',
  pageNotFoundDesc: 'الصفحة التي تبحث عنها غير موجودة أو تم نقلها.',
  dashboard: 'لوحة التحكم',
  dashboardAreaErrorTitle: 'حدث خطأ ما',
  dashboardAreaErrorDesc:
    'حدث خطأ في لوحة التحكم. يمكنك إعادة المحاولة أو العودة إلى الصفحة الرئيسية للوحة.',
  backToDashboard: 'العودة إلى لوحة التحكم',
};

export const commonFullAr: Common = {
  copy: 'نسخ',
  share: 'مشاركة',
  send: 'إرسال',
  cancel: 'إلغاء',
  confirm: 'تأكيد',
  save: 'حفظ',
  delete: 'حذف',
  edit: 'تعديل',
  view: 'عرض',
  loading: 'جاري التحميل...',
  error: 'خطأ',
};
