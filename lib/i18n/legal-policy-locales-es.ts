import type { PrivacyPolicyPageUi } from '@/lib/i18n/privacy-policy-page-ui';
import type { TermsPolicyPageUi } from '@/lib/i18n/terms-policy-page-ui';
import type { RefundPolicyPageUi } from '@/lib/i18n/refund-policy-page-ui';
import { privacyFooterNonIt } from '@/lib/i18n/legal-policy-locales-shared';

export const privacyPolicyPageUiEs: PrivacyPolicyPageUi = {
  title: 'Política de',
  highlight: 'privacidad',
  updated: 'Última actualización: diciembre de 2024',
  terms: 'Términos y condiciones',
  refund: 'Política de reembolsos',
  ...privacyFooterNonIt('Para ejercer estos derechos, contáctanos en '),
  sections: [
    {
      iconKey: 'eye',
      color: 'text-electric-blue',
      title: '1. Información general',
      body: [
        'PropertyPilot AI («nosotros», «nuestro») respeta tu privacidad y se compromete a proteger tus datos personales. Este aviso explica cómo recopilamos, usamos y protegemos tu información de conformidad con el RGPD y la legislación aplicable.',
        'Responsable del tratamiento: PropertyPilot AI',
        'Correo: privacy@propertypilotai.com',
      ],
    },
    {
      iconKey: 'database',
      color: 'text-sunset-gold',
      title: '2. Datos que recopilamos',
      body: ['Recopilamos las siguientes categorías de datos:'],
      lists: [
        {
          title: 'Datos proporcionados directamente:',
          items: [
            'Nombre completo',
            'Correo electrónico',
            'Nombre de agencia/empresa',
            'Datos de pago (procesados por Stripe)',
            'Contenido inmobiliario enviado para generación con IA',
          ],
        },
        {
          title: 'Datos recopilados automáticamente:',
          items: [
            'Dirección IP',
            'Tipo de navegador y dispositivo',
            'Páginas visitadas e interacciones',
            'Cookies técnicas y analíticas',
          ],
        },
      ],
    },
    {
      iconKey: 'lock',
      color: 'text-royal-purple',
      title: '3. Cómo usamos tus datos',
      body: ['Usamos tus datos para:'],
      items: [
        'Prestar y mejorar nuestros servicios de IA',
        'Gestionar tu cuenta y suscripción',
        'Procesar pagos a través de Stripe',
        'Enviarte comunicaciones relacionadas con el servicio',
        'Analizar el uso para mejorar la plataforma',
        'Cumplir obligaciones legales',
      ],
      note: 'Nunca vendemos tus datos a terceros.',
    },
    {
      iconKey: 'globe',
      color: 'text-neon-aqua',
      title: '4. Compartición de datos',
      body: ['Compartimos tus datos solo con:'],
      items: [
        'Stripe: procesamiento seguro de pagos',
        'Supabase: alojamiento de base de datos y autenticación',
        'OpenAI: generación de contenido con IA (datos minimizados o anonimizados cuando es posible)',
        'Vercel: alojamiento de la plataforma',
      ],
      note: 'Todos nuestros proveedores ofrecen garantías de seguridad adecuadas y medidas alineadas con el RGPD.',
    },
    {
      iconKey: 'userCheck',
      color: 'text-electric-blue',
      title: '5. Tus derechos',
      body: ['Según el RGPD, tienes derecho a:'],
      items: [
        'Acceso: solicitar una copia de tus datos',
        'Rectificación: corregir datos inexactos',
        'Supresión: solicitar la eliminación de tus datos',
        'Portabilidad: recibir tus datos en formato legible',
        'Oposición: oponerte al tratamiento con fines de marketing',
        'Limitación: limitar el tratamiento en determinadas circunstancias',
      ],
      noteKey: 'exerciseRights',
    },
    {
      title: '6. Cookies',
      body: ['Usamos los siguientes tipos de cookies:'],
      items: [
        'Cookies técnicas: necesarias para el funcionamiento del sitio',
        'Cookies de sesión: para mantener la autenticación',
        'Cookies analíticas: para entender cómo usas el sitio (anonimizadas cuando es posible)',
      ],
      note: 'Puedes gestionar las preferencias de cookies desde tu navegador.',
    },
    {
      title: '7. Seguridad de los datos',
      body: ['Aplicamos medidas de seguridad avanzadas:'],
      items: [
        'Cifrado SSL/TLS en todas las comunicaciones',
        'Cifrado de los datos almacenados',
        'Autenticación en dos pasos disponible',
        'Copias de seguridad periódicas y recuperación ante desastres',
        'Acceso restringido a datos solo para personal autorizado',
      ],
    },
    {
      title: '8. Conservación de datos',
      body: ['Conservamos tus datos el tiempo necesario para prestar el servicio:'],
      items: [
        'Datos de cuenta: hasta la eliminación de la cuenta + 30 días',
        'Datos de facturación: 10 años (obligaciones fiscales)',
        'Registros del sistema: 90 días',
        'Contenido generado: hasta que el usuario lo elimine',
      ],
    },
    {
      title: '9. Transferencias internacionales',
      body: [
        'Algunos proveedores pueden estar fuera del EEE. En esos casos aseguramos garantías adecuadas, como cláusulas contractuales tipo u otras medidas equivalentes.',
      ],
    },
    {
      iconKey: 'mail',
      color: 'text-sunset-gold',
      title: '10. Contacto y reclamaciones',
      body: ['Para consultas de privacidad o para ejercer tus derechos:'],
      contacts: ['Correo: privacy@propertypilotai.com'],
      note: 'Tienes derecho a presentar una reclamación ante la autoridad de protección de datos de tu país.',
    },
  ],
};

export const termsPolicyPageUiEs: TermsPolicyPageUi = {
  title: 'Términos y',
  highlight: 'condiciones',
  updated: 'Última actualización: diciembre de 2024',
  privacy: 'Política de privacidad',
  refund: 'Política de reembolsos',
  sections: [
    {
      iconKey: 'fileText',
      color: 'text-electric-blue',
      title: '1. Aceptación de los términos',
      paragraphs: [
        'Al usar PropertyPilot AI («Servicio»), aceptas quedar vinculado por estos Términos y condiciones. Si no estás de acuerdo, no uses el Servicio.',
        'PropertyPilot AI se reserva el derecho de modificar estos términos en cualquier momento. Los cambios surten efecto inmediatamente tras su publicación en el sitio.',
      ],
    },
    {
      iconKey: 'shield',
      color: 'text-neon-aqua',
      title: '2. Descripción del servicio',
      paragraphs: ['PropertyPilot AI es una plataforma de inteligencia artificial que ofrece:'],
      items: [
        'Generación automática de descripciones inmobiliarias profesionales',
        'Optimización SEO para anuncios',
        'Traducción multilingüe de contenidos',
        'Herramientas CRM para la gestión de leads',
        'Análisis y auditoría de anuncios existentes',
        'Generación de material de marketing (PDF, publicaciones en redes)',
      ],
    },
    {
      iconKey: 'checkCircle',
      color: 'text-sunset-gold',
      title: '3. Cuenta de usuario',
      paragraphs: ['Para usar PropertyPilot AI debes:'],
      items: [
        'Tener al menos 18 años',
        'Proporcionar información de registro exacta y completa',
        'Mantener la seguridad de tu cuenta y contraseña',
        'Notificarnos de inmediato cualquier uso no autorizado',
      ],
      note: 'Eres responsable de todas las actividades que ocurran bajo tu cuenta.',
    },
    {
      title: '4. Planes y pagos',
      paragraphs: ['PropertyPilot AI ofrece distintos planes de suscripción:'],
      items: [
        'Starter (197 EUR/mes): funciones básicas para agentes individuales',
        'Pro (497 EUR/mes): CRM completo y automatizaciones avanzadas',
        'Agency (897 EUR/mes): para equipos de hasta 10 agentes',
        'Agency Boost (2.497 EUR pago único): implementación completa y asesoramiento',
      ],
      note: 'Los pagos se procesan mediante Stripe. Los precios no incluyen IVA.',
    },
    {
      title: '5. Propiedad intelectual',
      paragraphs: [
        'Todo el contenido generado por la IA a través de PropertyPilot AI pertenece al usuario que lo generó. PropertyPilot AI conserva los derechos sobre la plataforma, el software, el diseño y los materiales relacionados.',
        'Está prohibido copiar, modificar o distribuir partes del Servicio sin autorización por escrito.',
      ],
    },
    {
      iconKey: 'alertTriangle',
      color: 'text-orange-500',
      title: '6. Limitación de responsabilidad',
      paragraphs: [
        'PropertyPilot AI no garantiza que el contenido generado por la IA esté libre de errores o sea adecuado para todos los fines. El usuario es responsable de revisar y verificar el contenido antes de publicarlo.',
        'PropertyPilot AI no será responsable de daños indirectos, incidentales o consecuentes derivados del uso del Servicio.',
      ],
    },
    {
      title: '7. Uso aceptable',
      paragraphs: ['No puedes usar PropertyPilot AI para:'],
      items: [
        'Actividades ilegales o fraudulentas',
        'Generar contenido difamatorio, ofensivo o discriminatorio',
        'Violar derechos de terceros',
        'Intentar acceder sin autorización a sistemas o datos',
        'Distribuir malware o código dañino',
      ],
    },
    {
      title: '8. Cancelación y suspensión',
      paragraphs: [
        'Puedes cancelar tu cuenta en cualquier momento desde el panel. PropertyPilot AI se reserva el derecho de suspender o cerrar cuentas que infrinjan estos términos.',
      ],
      linkText: 'Política de reembolsos',
      linkIntro: 'Para la política de reembolsos, consulta nuestra',
    },
    {
      title: '9. Ley aplicable',
      paragraphs: [
        'Estos términos se rigen por la ley italiana. Cualquier controversia será competencia de los tribunales de Milán.',
      ],
    },
    {
      title: '10. Contacto',
      paragraphs: ['Para preguntas sobre estos términos:'],
      contacts: ['Correo: legal@propertypilotai.com', 'Soporte: support@propertypilotai.com'],
    },
  ],
};

export const refundPolicyPageUiEs: RefundPolicyPageUi = {
  title: 'Política de',
  highlight: 'reembolso',
  updated: 'Última actualización: diciembre de 2024',
  guaranteeTitle: 'Nuestra garantía',
  guaranteeBodyStart: 'Confiamos en la calidad de PropertyPilot AI. Por eso ofrecemos una',
  guaranteeBodyStrong: 'garantía de reembolso de 14 días',
  guaranteeBodyEnd: 'en todas las suscripciones nuevas. Si no estás satisfecho, te reembolsamos sin complicaciones.',
  trialTitle: '1. Periodo de prueba y reembolso',
  freeTrialTitle: 'Prueba gratuita de 7 días',
  freeTrialBody:
    'Todos los planes incluyen 7 días de prueba gratuita. No se requiere tarjeta para empezar. Puedes cancelar en cualquier momento durante la prueba sin cargo.',
  guarantee14Title: 'Garantía de 14 días',
  guarantee14Body:
    'Si activas una suscripción tras la prueba y no estás satisfecho, puedes solicitar el reembolso íntegro en un plazo de 14 días desde la fecha del primer pago.',
  conditionsTitle: '2. Condiciones del reembolso',
  conditionsIntro: 'Para obtener un reembolso debes:',
  conditions: [
    'Solicitar el reembolso en un plazo de 14 días desde el primer pago',
    'Estar en tu primer periodo de suscripción (no aplica a renovaciones)',
    'No haber infringido los Términos del servicio',
    'Contactarnos por correo con la solicitud',
  ],
  nonRefundableTitle: '3. Casos no reembolsables',
  nonRefundableIntro: 'No se aplicará reembolso en los siguientes casos:',
  nonRefundable: [
    'Solicitud presentada después de 14 días desde el pago',
    'Renovaciones automáticas (puedes cancelar antes de la renovación)',
    'Paquete Agency Boost (servicio único ya prestado)',
    'Cuentas suspendidas por incumplimiento de los términos',
    'Suscripciones anteriores ya reembolsadas',
  ],
  cancelTitle: '4. Cancelación de la suscripción',
  cancelIntro: 'Puedes cancelar tu suscripción en cualquier momento:',
  cancelSteps: [
    'Inicia sesión en tu panel',
    'Ve a Facturación o Suscripción',
    'Haz clic en Cancelar suscripción',
    'Confirma la cancelación',
  ],
  cancelImportant: 'Importante:',
  cancelImportantBody:
    'La cancelación surte efecto al final del periodo de facturación en curso. Conservarás el acceso hasta esa fecha.',
  processTitle: '5. Proceso de reembolso',
  process: [
    {
      step: '1',
      title: 'Envía la solicitud',
      body: 'Contáctanos por correo con el asunto «Solicitud de reembolso» e indica tu cuenta.',
    },
    {
      step: '2',
      title: 'Verificación',
      body: 'Comprobaremos que la solicitud cumple las condiciones (1–2 días laborables).',
    },
    {
      step: '3',
      title: 'Procesamiento',
      body: 'El reembolso se procesa a través de Stripe (5–10 días para que aparezca en tu cuenta).',
    },
    {
      step: '✓',
      title: 'Completado',
      body: 'Recibirás un correo de confirmación cuando se haya procesado el reembolso.',
    },
  ],
  boostTitle: '6. Agency Boost — política especial',
  boostIntro: 'El paquete',
  boostProductLabel: 'Agency Boost (2.497 EUR)',
  boostBody: 'es un servicio único de implementación personalizada. Por la naturaleza del servicio:',
  boostRules: [
    'No es reembolsable una vez iniciada la implementación',
    'Se puede cancelar en un plazo de 48 horas desde el pedido si el trabajo no ha comenzado',
    'Cualquier incidencia de entrega se resolverá con soporte adicional sin coste',
  ],
  contactTitle: '7. Contacto',
  contactIntro: 'Para solicitudes de reembolso o consultas:',
  refundEmail: 'Correo de reembolsos:',
  supportEmail: 'Soporte general:',
  contactOutro: 'Respondemos a todas las solicitudes en un plazo de 24–48 horas laborables.',
  terms: 'Términos y condiciones',
  privacy: 'Política de privacidad',
  pricing: 'Ver precios',
};
