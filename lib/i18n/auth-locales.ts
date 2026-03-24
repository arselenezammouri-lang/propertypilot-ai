/**
 * Login / signup / auth toasts. IT/EN: dictionary.ts.
 * Toast copy without emoji (enterprise UI).
 */

export type AuthUi = {
  backToHome: string;
  /** Short line under the product name on login/signup cards */
  brandTagline: string;
  login: {
    title: string;
    subtitle: string;
    email: string;
    emailPlaceholder: string;
    password: string;
    showPasswordAria: string;
    hidePasswordAria: string;
    forgotPassword: string;
    signIn: string;
    signingIn: string;
    newTo: string;
    createFreeAccount: string;
    secureNote: string;
  };
  signup: {
    title: string;
    subtitle: string;
    fullName: string;
    fullNamePlaceholder: string;
    email: string;
    emailPlaceholder: string;
    password: string;
    showPasswordAria: string;
    hidePasswordAria: string;
    minChars: string;
    freePlanIncludes: string;
    listingsPerMonth: string;
    allAIFeatures: string;
    noCreditCard: string;
    createFreeAccount: string;
    creatingAccount: string;
    alreadyHaveAccount: string;
    signInInstead: string;
    termsAgreeBefore: string;
    termsAgreeAnd: string;
  };
  toast: {
    error: string;
    fillAllFields: string;
    tooManyAttempts: string;
    rateLimitMsg: string;
    welcomeBack: string;
    completePayment: string;
    loginSuccess: string;
    accountCreated: string;
    redirectPayment: string;
    welcomePropertyPilot: string;
    turnstileRequired: string;
    turnstileFailed: string;
    turnstileLoadFailed: string;
    turnstileMisconfigured: string;
    /** Toast description when sign-in fails and API returns no message */
    loginFailedGeneric: string;
    /** Toast description when sign-up fails and API returns no message */
    signupFailedGeneric: string;
    /** Supabase: email not confirmed */
    emailNotConfirmed: string;
    /** Supabase: user already registered */
    userAlreadyRegistered: string;
    /** Supabase: password too short / weak */
    passwordTooShort: string;
    /** Supabase: malformed or invalid email */
    invalidEmail: string;
    /** Fetch / connectivity failures */
    networkError: string;
    /** Session / JWT expired — re-login */
    sessionExpired: string;
    /** Sign-ups disabled on project */
    signupDisabled: string;
    /** OAuth / social login failed */
    oauthFailed: string;
  };
};

const secureEs =
  'Acceso seguro • Tus datos están protegidos con cifrado estándar del sector';
const secureFr =
  'Connexion sécurisée • Vos données sont protégées par un chiffrement standard';
const secureDe =
  'Sicherer Login • Ihre Daten sind mit branchenüblicher Verschlüsselung geschützt';
const securePt =
  'Login seguro • Os seus dados estão protegidos com encriptação padrão do setor';
const secureAr =
  'تسجيل دخول آمن • بياناتك محمية بتشفير معياري للصناعة';

export const authUiEs: AuthUi = {
  backToHome: 'Volver al inicio',
  brandTagline: 'Lleva tu agencia al siguiente nivel',
  login: {
    title: 'Bienvenido de nuevo',
    subtitle: 'Inicia sesión para continuar',
    email: 'Correo electrónico',
    emailPlaceholder: 'tu@email.com',
    password: 'Contraseña',
    showPasswordAria: 'Mostrar contraseña',
    hidePasswordAria: 'Ocultar contraseña',
    forgotPassword: '¿Olvidaste la contraseña?',
    signIn: 'Iniciar sesión',
    signingIn: 'Iniciando sesión...',
    newTo: '¿Nuevo en PropertyPilot AI?',
    createFreeAccount: 'Crear cuenta gratuita',
    secureNote: secureEs,
  },
  signup: {
    title: 'Crea tu cuenta',
    subtitle: 'Empieza a generar anuncios profesionales con IA',
    fullName: 'Nombre completo',
    fullNamePlaceholder: 'María García',
    email: 'Correo electrónico',
    emailPlaceholder: 'tu@email.com',
    password: 'Contraseña',
    showPasswordAria: 'Mostrar contraseña',
    hidePasswordAria: 'Ocultar contraseña',
    minChars: 'Al menos 6 caracteres',
    freePlanIncludes: 'El plan gratuito incluye:',
    listingsPerMonth: '5 anuncios al mes',
    allAIFeatures: 'Todas las funciones de IA',
    noCreditCard: 'Sin tarjeta de crédito',
    createFreeAccount: 'Crear cuenta gratuita',
    creatingAccount: 'Creando cuenta...',
    alreadyHaveAccount: '¿Ya tienes cuenta?',
    signInInstead: 'Inicia sesión',
    termsAgreeBefore: 'Al registrarte aceptas nuestros ',
    termsAgreeAnd: ' y ',
  },
  toast: {
    error: 'Error',
    fillAllFields: 'Completa todos los campos obligatorios.',
    tooManyAttempts: 'Demasiados intentos',
    rateLimitMsg:
      'Detectamos demasiados intentos. Por tu seguridad, inténtalo de nuevo en unos minutos.',
    welcomeBack: '¡Bienvenido de nuevo!',
    completePayment: 'Completa el pago en el panel.',
    loginSuccess: 'Sesión iniciada correctamente.',
    accountCreated: '¡Cuenta creada!',
    redirectPayment: 'Serás redirigido para completar el pago.',
    welcomePropertyPilot: '¡Bienvenido a PropertyPilot AI!',
    turnstileRequired: 'Completa la verificación de seguridad antes de continuar.',
    turnstileFailed: 'La verificación de seguridad falló. Inténtalo de nuevo.',
    turnstileLoadFailed:
      'No se pudo cargar la verificación de seguridad. Actualiza la página o inténtalo más tarde.',
    turnstileMisconfigured:
      'La verificación de seguridad no está bien configurada en el servidor. Contacta con soporte.',
    loginFailedGeneric: 'Correo o contraseña no válidos.',
    signupFailedGeneric: 'No se pudo crear la cuenta. Inténtalo de nuevo.',
    emailNotConfirmed: 'Confirma tu correo antes de iniciar sesión.',
    userAlreadyRegistered: 'Ya existe una cuenta con este correo. Inicia sesión o recupera la contraseña.',
    passwordTooShort: 'La contraseña no cumple los requisitos de longitud. Usa al menos 8 caracteres.',
    invalidEmail: 'Introduce una dirección de correo válida.',
    networkError: 'Error de conexión. Comprueba tu red e inténtalo de nuevo.',
    sessionExpired: 'Tu sesión ha caducado. Vuelve a iniciar sesión.',
    signupDisabled: 'El registro de nuevas cuentas no está disponible en este momento.',
    oauthFailed: 'No se pudo completar el inicio de sesión social. Inténtalo de nuevo o usa email y contraseña.',
  },
};

export const authUiFr: AuthUi = {
  backToHome: 'Retour à l’accueil',
  brandTagline: 'Faites passer votre agence au niveau supérieur',
  login: {
    title: 'Bon retour',
    subtitle: 'Connectez-vous pour continuer',
    email: 'E-mail',
    emailPlaceholder: 'vous@email.com',
    password: 'Mot de passe',
    showPasswordAria: 'Afficher le mot de passe',
    hidePasswordAria: 'Masquer le mot de passe',
    forgotPassword: 'Mot de passe oublié ?',
    signIn: 'Se connecter',
    signingIn: 'Connexion en cours...',
    newTo: 'Nouveau sur PropertyPilot AI ?',
    createFreeAccount: 'Créer un compte gratuit',
    secureNote: secureFr,
  },
  signup: {
    title: 'Créez votre compte',
    subtitle: 'Générez des annonces professionnelles avec l’IA',
    fullName: 'Nom complet',
    fullNamePlaceholder: 'Marie Dupont',
    email: 'E-mail',
    emailPlaceholder: 'vous@email.com',
    password: 'Mot de passe',
    showPasswordAria: 'Afficher le mot de passe',
    hidePasswordAria: 'Masquer le mot de passe',
    minChars: 'Au moins 6 caractères',
    freePlanIncludes: 'Le forfait gratuit inclut :',
    listingsPerMonth: '5 annonces par mois',
    allAIFeatures: 'Toutes les fonctions IA',
    noCreditCard: 'Aucune carte bancaire requise',
    createFreeAccount: 'Créer un compte gratuit',
    creatingAccount: 'Création du compte...',
    alreadyHaveAccount: 'Vous avez déjà un compte ?',
    signInInstead: 'Se connecter',
    termsAgreeBefore: 'En vous inscrivant, vous acceptez nos ',
    termsAgreeAnd: ' et ',
  },
  toast: {
    error: 'Erreur',
    fillAllFields: 'Veuillez remplir tous les champs obligatoires.',
    tooManyAttempts: 'Trop de tentatives',
    rateLimitMsg:
      'Trop de tentatives détectées. Pour votre sécurité, réessayez dans quelques minutes.',
    welcomeBack: 'Bon retour !',
    completePayment: 'Finalisez le paiement dans le tableau de bord.',
    loginSuccess: 'Connexion réussie.',
    accountCreated: 'Compte créé !',
    redirectPayment: 'Vous allez être redirigé pour finaliser le paiement.',
    welcomePropertyPilot: 'Bienvenue sur PropertyPilot AI !',
    turnstileRequired: 'Complétez la vérification de sécurité avant de continuer.',
    turnstileFailed: 'La vérification de sécurité a échoué. Réessayez.',
    turnstileLoadFailed:
      'Impossible de charger la vérification de sécurité. Actualisez la page ou réessayez plus tard.',
    turnstileMisconfigured:
      'La vérification de sécurité est mal configurée sur le serveur. Contactez le support.',
    loginFailedGeneric: 'E-mail ou mot de passe incorrect.',
    signupFailedGeneric: 'Impossible de créer le compte. Réessayez.',
    emailNotConfirmed: 'Confirmez votre e-mail avant de vous connecter.',
    userAlreadyRegistered: 'Un compte existe déjà avec cet e-mail. Connectez-vous ou réinitialisez le mot de passe.',
    passwordTooShort: 'Le mot de passe est trop court. Utilisez au moins 8 caractères.',
    invalidEmail: 'Saisissez une adresse e-mail valide.',
    networkError: 'Erreur de connexion. Vérifiez votre réseau et réessayez.',
    sessionExpired: 'Votre session a expiré. Reconnectez-vous.',
    signupDisabled: 'La création de compte n’est pas disponible pour le moment.',
    oauthFailed: 'La connexion sociale a échoué. Réessayez ou utilisez e-mail et mot de passe.',
  },
};

export const authUiDe: AuthUi = {
  backToHome: 'Zur Startseite',
  brandTagline: 'Bringen Sie Ihre Agentur auf das nächste Level',
  login: {
    title: 'Willkommen zurück',
    subtitle: 'Melden Sie sich an, um fortzufahren',
    email: 'E-Mail',
    emailPlaceholder: 'sie@email.com',
    password: 'Passwort',
    showPasswordAria: 'Passwort anzeigen',
    hidePasswordAria: 'Passwort ausblenden',
    forgotPassword: 'Passwort vergessen?',
    signIn: 'Anmelden',
    signingIn: 'Anmeldung läuft...',
    newTo: 'Neu bei PropertyPilot AI?',
    createFreeAccount: 'Kostenloses Konto erstellen',
    secureNote: secureDe,
  },
  signup: {
    title: 'Konto erstellen',
    subtitle: 'Erstellen Sie professionelle Inserate mit KI',
    fullName: 'Vollständiger Name',
    fullNamePlaceholder: 'Max Mustermann',
    email: 'E-Mail',
    emailPlaceholder: 'sie@email.com',
    password: 'Passwort',
    showPasswordAria: 'Passwort anzeigen',
    hidePasswordAria: 'Passwort ausblenden',
    minChars: 'Mindestens 6 Zeichen',
    freePlanIncludes: 'Der kostenlose Tarif umfasst:',
    listingsPerMonth: '5 Inserate pro Monat',
    allAIFeatures: 'Alle KI-Funktionen',
    noCreditCard: 'Keine Kreditkarte erforderlich',
    createFreeAccount: 'Kostenloses Konto erstellen',
    creatingAccount: 'Konto wird erstellt...',
    alreadyHaveAccount: 'Bereits ein Konto?',
    signInInstead: 'Stattdessen anmelden',
    termsAgreeBefore: 'Mit der Registrierung akzeptieren Sie unsere ',
    termsAgreeAnd: ' und ',
  },
  toast: {
    error: 'Fehler',
    fillAllFields: 'Bitte füllen Sie alle Pflichtfelder aus.',
    tooManyAttempts: 'Zu viele Versuche',
    rateLimitMsg:
      'Zu viele Versuche erkannt. Zu Ihrer Sicherheit: bitte in einigen Minuten erneut versuchen.',
    welcomeBack: 'Willkommen zurück!',
    completePayment: 'Bitte schließen Sie die Zahlung im Dashboard ab.',
    loginSuccess: 'Erfolgreich angemeldet.',
    accountCreated: 'Konto erstellt!',
    redirectPayment: 'Sie werden zur Zahlung weitergeleitet.',
    welcomePropertyPilot: 'Willkommen bei PropertyPilot AI!',
    turnstileRequired: 'Bitte schließen Sie die Sicherheitsprüfung ab, bevor Sie fortfahren.',
    turnstileFailed: 'Sicherheitsprüfung fehlgeschlagen. Bitte erneut versuchen.',
    turnstileLoadFailed:
      'Sicherheitsprüfung konnte nicht geladen werden. Seite aktualisieren oder später erneut versuchen.',
    turnstileMisconfigured:
      'Sicherheitsprüfung auf dem Server falsch konfiguriert. Bitte Support kontaktieren.',
    loginFailedGeneric: 'E-Mail oder Passwort ungültig.',
    signupFailedGeneric: 'Konto konnte nicht erstellt werden. Bitte erneut versuchen.',
    emailNotConfirmed: 'Bitte bestätigen Sie Ihre E-Mail, bevor Sie sich anmelden.',
    userAlreadyRegistered: 'Mit dieser E-Mail ist bereits ein Konto registriert. Melden Sie sich an oder setzen Sie das Passwort zurück.',
    passwordTooShort: 'Das Passwort ist zu kurz. Verwenden Sie mindestens 8 Zeichen.',
    invalidEmail: 'Bitte geben Sie eine gültige E-Mail-Adresse ein.',
    networkError: 'Verbindungsfehler. Prüfen Sie Ihr Netzwerk und versuchen Sie es erneut.',
    sessionExpired: 'Ihre Sitzung ist abgelaufen. Bitte melden Sie sich erneut an.',
    signupDisabled: 'Neue Registrierungen sind derzeit nicht möglich.',
    oauthFailed: 'Social-Login fehlgeschlagen. Bitte erneut versuchen oder E-Mail und Passwort nutzen.',
  },
};

export const authUiPt: AuthUi = {
  backToHome: 'Voltar ao início',
  brandTagline: 'Leve a sua agência ao próximo nível',
  login: {
    title: 'Bem-vindo de volta',
    subtitle: 'Inicie sessão para continuar',
    email: 'E-mail',
    emailPlaceholder: 'seu@email.com',
    password: 'Palavra-passe',
    showPasswordAria: 'Mostrar palavra-passe',
    hidePasswordAria: 'Ocultar palavra-passe',
    forgotPassword: 'Esqueceu a palavra-passe?',
    signIn: 'Iniciar sessão',
    signingIn: 'A iniciar sessão...',
    newTo: 'Novo no PropertyPilot AI?',
    createFreeAccount: 'Criar conta gratuita',
    secureNote: securePt,
  },
  signup: {
    title: 'Crie a sua conta',
    subtitle: 'Comece a gerar anúncios profissionais com IA',
    fullName: 'Nome completo',
    fullNamePlaceholder: 'Maria Silva',
    email: 'E-mail',
    emailPlaceholder: 'seu@email.com',
    password: 'Palavra-passe',
    showPasswordAria: 'Mostrar palavra-passe',
    hidePasswordAria: 'Ocultar palavra-passe',
    minChars: 'Pelo menos 6 caracteres',
    freePlanIncludes: 'O plano gratuito inclui:',
    listingsPerMonth: '5 anúncios por mês',
    allAIFeatures: 'Todas as funcionalidades de IA',
    noCreditCard: 'Sem cartão de crédito',
    createFreeAccount: 'Criar conta gratuita',
    creatingAccount: 'A criar conta...',
    alreadyHaveAccount: 'Já tem conta?',
    signInInstead: 'Iniciar sessão',
    termsAgreeBefore: 'Ao registar-se aceita os nossos ',
    termsAgreeAnd: ' e ',
  },
  toast: {
    error: 'Erro',
    fillAllFields: 'Preencha todos os campos obrigatórios.',
    tooManyAttempts: 'Demasiadas tentativas',
    rateLimitMsg:
      'Detetámos demasiadas tentativas. Por segurança, tente novamente dentro de alguns minutos.',
    welcomeBack: 'Bem-vindo de volta!',
    completePayment: 'Conclua o pagamento no painel.',
    loginSuccess: 'Sessão iniciada com sucesso.',
    accountCreated: 'Conta criada!',
    redirectPayment: 'Será redirecionado para concluir o pagamento.',
    welcomePropertyPilot: 'Bem-vindo ao PropertyPilot AI!',
    turnstileRequired: 'Conclua a verificação de segurança antes de continuar.',
    turnstileFailed: 'A verificação de segurança falhou. Tente novamente.',
    turnstileLoadFailed:
      'Não foi possível carregar a verificação de segurança. Atualize a página ou tente mais tarde.',
    turnstileMisconfigured:
      'A verificação de segurança está mal configurada no servidor. Contacte o suporte.',
    loginFailedGeneric: 'E-mail ou palavra-passe inválidos.',
    signupFailedGeneric: 'Não foi possível criar a conta. Tente novamente.',
    emailNotConfirmed: 'Confirme o seu e-mail antes de iniciar sessão.',
    userAlreadyRegistered: 'Já existe uma conta com este e-mail. Inicie sessão ou redefina a palavra-passe.',
    passwordTooShort: 'A palavra-passe é demasiado curta. Use pelo menos 8 caracteres.',
    invalidEmail: 'Introduza um endereço de e-mail válido.',
    networkError: 'Erro de ligação. Verifique a rede e tente novamente.',
    sessionExpired: 'A sua sessão expirou. Inicie sessão novamente.',
    signupDisabled: 'O registo de novas contas não está disponível de momento.',
    oauthFailed: 'Não foi possível concluir o login social. Tente novamente ou use e-mail e palavra-passe.',
  },
};

export const authUiAr: AuthUi = {
  backToHome: 'العودة للرئيسية',
  brandTagline: 'ارتقِ بوكالتك إلى المستوى التالي',
  login: {
    title: 'مرحباً بعودتك',
    subtitle: 'سجّل الدخول للمتابعة',
    email: 'البريد الإلكتروني',
    emailPlaceholder: 'you@example.com',
    password: 'كلمة المرور',
    showPasswordAria: 'إظهار كلمة المرور',
    hidePasswordAria: 'إخفاء كلمة المرور',
    forgotPassword: 'نسيت كلمة المرور؟',
    signIn: 'تسجيل الدخول',
    signingIn: 'جاري تسجيل الدخول...',
    newTo: 'جديد على PropertyPilot AI؟',
    createFreeAccount: 'إنشاء حساب مجاني',
    secureNote: secureAr,
  },
  signup: {
    title: 'أنشئ حسابك',
    subtitle: 'ابدأ بإنشاء إعلانات احترافية بالذكاء الاصطناعي',
    fullName: 'الاسم الكامل',
    fullNamePlaceholder: 'أحمد محمد',
    email: 'البريد الإلكتروني',
    emailPlaceholder: 'you@example.com',
    password: 'كلمة المرور',
    showPasswordAria: 'إظهار كلمة المرور',
    hidePasswordAria: 'إخفاء كلمة المرور',
    minChars: '6 أحرف على الأقل',
    freePlanIncludes: 'تشمل الخطة المجانية:',
    listingsPerMonth: '5 إعلانات شهرياً',
    allAIFeatures: 'كل ميزات الذكاء الاصطناعي',
    noCreditCard: 'لا حاجة لبطاقة ائتمان',
    createFreeAccount: 'إنشاء حساب مجاني',
    creatingAccount: 'جاري إنشاء الحساب...',
    alreadyHaveAccount: 'لديك حساب بالفعل؟',
    signInInstead: 'سجّل الدخول',
    termsAgreeBefore: 'بالتسجيل فإنك توافق على ',
    termsAgreeAnd: ' و ',
  },
  toast: {
    error: 'خطأ',
    fillAllFields: 'يرجى تعبئة جميع الحقول المطلوبة.',
    tooManyAttempts: 'محاولات كثيرة جداً',
    rateLimitMsg:
      'رصدنا محاولات كثيرة. لأمانك، أعد المحاولة بعد دقائق.',
    welcomeBack: 'مرحباً بعودتك!',
    completePayment: 'أكمل الدفع من لوحة التحكم.',
    loginSuccess: 'تم تسجيل الدخول بنجاح.',
    accountCreated: 'تم إنشاء الحساب!',
    redirectPayment: 'سيتم توجيهك لإكمال الدفع.',
    welcomePropertyPilot: 'مرحباً بك في PropertyPilot AI!',
    turnstileRequired: 'أكمل التحقق الأمني قبل المتابعة.',
    turnstileFailed: 'فشل التحقق الأمني. حاول مرة أخرى.',
    turnstileLoadFailed:
      'تعذر تحميل التحقق الأمني. حدّث الصفحة أو حاول لاحقاً.',
    turnstileMisconfigured:
      'التحقق الأمني غير مُعد بشكل صحيح على الخادم. تواصل مع الدعم.',
    loginFailedGeneric: 'البريد الإلكتروني أو كلمة المرور غير صحيحة.',
    signupFailedGeneric: 'تعذر إنشاء الحساب. حاول مرة أخرى.',
    emailNotConfirmed: 'يرجى تأكيد بريدك الإلكتروني قبل تسجيل الدخول.',
    userAlreadyRegistered: 'يوجد حساب بهذا البريد. سجّل الدخول أو أعد تعيين كلمة المرور.',
    passwordTooShort: 'كلمة المرور قصيرة جداً. استخدم 8 أحرف على الأقل.',
    invalidEmail: 'أدخل عنوان بريد إلكتروني صالحاً.',
    networkError: 'خطأ في الاتصال. تحقق من الشبكة وحاول مرة أخرى.',
    sessionExpired: 'انتهت جلستك. سجّل الدخول مرة أخرى.',
    signupDisabled: 'تسجيل حسابات جديدة غير متاح حالياً.',
    oauthFailed: 'تعذر إكمال تسجيل الدخول الاجتماعي. حاول مرة أخرى أو استخدم البريد وكلمة المرور.',
  },
};
