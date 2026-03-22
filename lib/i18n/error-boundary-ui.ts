export type ErrorBoundaryUi = {
  title: string;
  desc: string;
  unknown: string;
  retry: string;
  reload: string;
};

export type ApiErrorHandlerUi = {
  configError: string;
  quotaError: string;
  rateLimitError: string;
  timeoutError: string;
  genericError: string;
};

export type ErrorBoundaryModuleUi = {
  boundary: ErrorBoundaryUi;
  apiHandler: ApiErrorHandlerUi;
};

export const errorBoundaryModuleUiIt: ErrorBoundaryModuleUi = {
  boundary: {
    title: 'Qualcosa è andato storto',
    desc: 'Si è verificato un errore imprevisto. Non ti preoccupare, i tuoi dati sono al sicuro.',
    unknown: 'Errore sconosciuto',
    retry: 'Riprova',
    reload: 'Ricarica pagina',
  },
  apiHandler: {
    configError: 'Errore di configurazione. Contatta il supporto.',
    quotaError: 'Quota AI temporaneamente esaurita. Riprova tra qualche minuto.',
    rateLimitError: 'Troppe richieste. Attendi qualche secondo prima di riprovare.',
    timeoutError: 'Il servizio sta impiegando troppo tempo. Riprova tra qualche secondo.',
    genericError: 'Si è verificato un errore. Riprova più tardi.',
  },
};

export const errorBoundaryModuleUiEn: ErrorBoundaryModuleUi = {
  boundary: {
    title: 'Something went wrong',
    desc: 'An unexpected error occurred. Your data is safe.',
    unknown: 'Unknown error',
    retry: 'Retry',
    reload: 'Reload page',
  },
  apiHandler: {
    configError: 'Configuration error. Please contact support.',
    quotaError: 'AI quota temporarily exhausted. Please try again in a few minutes.',
    rateLimitError: 'Too many requests. Please wait a few seconds before retrying.',
    timeoutError: 'The service is taking too long to respond. Please try again in a moment.',
    genericError: 'An error occurred. Please try again later.',
  },
};
