/**
 * Forgot password + reset password flows. IT/EN authoritative; merged in dictionary.ts.
 */

export type AuthPasswordRecoveryUi = {
  backToLogin: string;
  forgot: {
    pageTitle: string;
    descSent: string;
    descDefault: string;
    emailLabel: string;
    emailPlaceholder: string;
    sendIdle: string;
    sendLoading: string;
    emailRequired: string;
    sentTitle: string;
    sentDesc: string;
  };
  reset: {
    pageTitle: string;
    pageDesc: string;
    passwordLabel: string;
    passwordPlaceholder: string;
    confirmLabel: string;
    confirmPlaceholder: string;
    updateIdle: string;
    updateLoading: string;
    successTitle: string;
    redirecting: string;
    minLength: string;
    passwordMismatch: string;
    updatedTitle: string;
    updatedDesc: string;
    showPasswordAria: string;
    hidePasswordAria: string;
  };
  genericError: string;
};

export const authPasswordRecoveryUiIt: AuthPasswordRecoveryUi = {
  backToLogin: 'Torna al Login',
  forgot: {
    pageTitle: 'Password dimenticata?',
    descSent: 'Controlla la tua email per il link di reset.',
    descDefault:
      'Inserisci la tua email e ti invieremo un link per reimpostare la password.',
    emailLabel: 'Email',
    emailPlaceholder: 'tua@email.com',
    sendIdle: 'Invia link di reset',
    sendLoading: 'Invio in corso...',
    emailRequired: 'Inserisci la tua email.',
    sentTitle: 'Email inviata',
    sentDesc: 'Controlla la tua casella per il link di reset password.',
  },
  reset: {
    pageTitle: 'Nuova password',
    pageDesc: 'Inserisci la nuova password per il tuo account.',
    passwordLabel: 'Nuova password',
    passwordPlaceholder: 'Minimo 8 caratteri',
    confirmLabel: 'Conferma password',
    confirmPlaceholder: 'Ripeti la password',
    updateIdle: 'Aggiorna password',
    updateLoading: 'Aggiornamento...',
    successTitle: 'Password aggiornata!',
    redirecting: 'Reindirizzamento al login...',
    minLength: 'La password deve avere almeno 8 caratteri.',
    passwordMismatch: 'Le password non coincidono.',
    updatedTitle: 'Password aggiornata',
    updatedDesc: 'Ora puoi accedere con la nuova password.',
    showPasswordAria: 'Mostra password',
    hidePasswordAria: 'Nascondi password',
  },
  genericError: 'Si è verificato un errore.',
};

export const authPasswordRecoveryUiEn: AuthPasswordRecoveryUi = {
  backToLogin: 'Back to Login',
  forgot: {
    pageTitle: 'Forgot password?',
    descSent: 'Check your email for the reset link.',
    descDefault: "Enter your email and we'll send you a link to reset your password.",
    emailLabel: 'Email',
    emailPlaceholder: 'your@email.com',
    sendIdle: 'Send reset link',
    sendLoading: 'Sending...',
    emailRequired: 'Please enter your email.',
    sentTitle: 'Email sent',
    sentDesc: 'Check your inbox for the password reset link.',
  },
  reset: {
    pageTitle: 'New password',
    pageDesc: 'Enter the new password for your account.',
    passwordLabel: 'New password',
    passwordPlaceholder: 'At least 8 characters',
    confirmLabel: 'Confirm password',
    confirmPlaceholder: 'Repeat the password',
    updateIdle: 'Update password',
    updateLoading: 'Updating...',
    successTitle: 'Password updated!',
    redirecting: 'Redirecting to login...',
    minLength: 'Password must be at least 8 characters.',
    passwordMismatch: 'Passwords do not match.',
    updatedTitle: 'Password updated',
    updatedDesc: 'You can now sign in with your new password.',
    showPasswordAria: 'Show password',
    hidePasswordAria: 'Hide password',
  },
  genericError: 'An error occurred.',
};
