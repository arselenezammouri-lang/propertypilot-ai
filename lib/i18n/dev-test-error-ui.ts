/**
 * Dev-only /dashboard/test-error — IT/EN in dictionary merge.
 */

export type DevTestErrorUi = {
  title: string;
  body1BeforeTrigger: string;
  body1BetweenTriggerAndWithout: string;
  body1AfterWithout: string;
  body2BeforeFolder: string;
  body2AfterFolder: string;
};

export const devTestErrorUiIt: DevTestErrorUi = {
  title: 'Prova error boundary',
  body1BeforeTrigger: 'Apri ',
  body1BetweenTriggerAndWithout:
    " per forzare un errore e vedere l'error boundary. Senza ",
  body1AfterWithout: ' questa pagina è normale.',
  body2BeforeFolder: 'Route solo per test; puoi eliminare la cartella ',
  body2AfterFolder: ' quando non serve più.',
};

export const devTestErrorUiEn: DevTestErrorUi = {
  title: 'Test error boundary',
  body1BeforeTrigger: 'Open ',
  body1BetweenTriggerAndWithout:
    ' to force an error and see the error boundary. Without ',
  body1AfterWithout: ' this page is normal.',
  body2BeforeFolder: 'Dev-only route; you can remove the ',
  body2AfterFolder: ' folder when you no longer need it.',
};

/** Stable paths shown as <code> in UI */
export const DEV_TEST_ERROR_TRIGGER_PATH = '/dashboard/test-error?trigger=1';
export const DEV_TEST_ERROR_WITHOUT_QUERY = '?trigger=1';
export const DEV_TEST_ERROR_FOLDER_PATH = 'app/dashboard/test-error';
