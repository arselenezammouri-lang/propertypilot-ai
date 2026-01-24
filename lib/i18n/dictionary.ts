/**
 * PropertyPilot AI - Internationalization Dictionary
 * Support: IT, EN, ES, FR, DE, PT
 */

export type SupportedLocale = 'it' | 'en' | 'es' | 'fr' | 'de' | 'pt';

export interface TranslationDictionary {
  // Dashboard General
  dashboard: {
    title: string;
    subtitle: string;
    loading: string;
    error: string;
    success: string;
  };
  
  // Aura VR Generator
  auraVR: {
    title: string;
    subtitle: string;
    startScan: string;
    processing: {
      analyzing: string;
      mapping: string;
      rendering: string;
      optimizing: string;
      preparing: string;
      finalizing: string;
      complete: string;
    };
    progress: {
      analyzingSub: string;
      mappingSub: string;
      renderingSub: string;
      optimizingSub: string;
      preparingSub: string;
      finalizingSub: string;
      completeSub: string;
    };
    result: {
      title: string;
      subtitle: string;
      linkLabel: string;
      copyLink: string;
      shareWhatsApp: string;
      generateNew: string;
      videoSource: string;
      tourTime: string;
    };
    aria: {
      message: string;
      stats: string;
      action: string;
    };
  };
  
  // Common Actions
  common: {
    copy: string;
    share: string;
    send: string;
    cancel: string;
    confirm: string;
    save: string;
    delete: string;
    edit: string;
    view: string;
  };
}

export const translations: Record<SupportedLocale, TranslationDictionary> = {
  it: {
    dashboard: {
      title: 'Dashboard',
      subtitle: 'Pannello di controllo',
      loading: 'Caricamento...',
      error: 'Errore',
      success: 'Successo',
    },
    auraVR: {
      title: 'Aura VR Generator',
      subtitle: 'Trasforma un video dello smartphone in un tour VR immersivo 3D',
      startScan: 'Inizia Scansione Aura VR',
      processing: {
        analyzing: '📹 Analisi video in corso...',
        mapping: '🏠 Mappatura stanze in corso...',
        rendering: '🎥 Rendering Cinematico 3D...',
        optimizing: '✨ Ottimizzazione VR per mobile...',
        preparing: '🌐 Preparazione link VR...',
        finalizing: '⚡ Finalizzazione tour immersivo...',
        complete: '✅ Tour VR pronto!',
      },
      progress: {
        analyzingSub: 'Rilevamento frame chiave',
        mappingSub: 'Ricostruzione spaziale 3D',
        renderingSub: 'Generazione texture immersive',
        optimizingSub: 'Compressione e streaming',
        preparingSub: 'Configurazione accesso pubblico',
        finalizingSub: 'Aggiunta effetti cinematici',
        completeSub: 'Link generato con successo',
      },
      result: {
        title: 'Tour VR Generato!',
        subtitle: 'Il tuo tour immersivo è pronto per essere condiviso',
        linkLabel: 'Link VR:',
        copyLink: 'Copia Link',
        shareWhatsApp: 'WhatsApp',
        generateNew: 'Genera nuovo tour',
        videoSource: 'Video smartphone',
        tourTime: 'Tour VR in 60s',
      },
      aria: {
        message: 'Aria: Ottimo lavoro!',
        stats: 'Questa scansione attirerà il',
        action: 'di visite in più. Vuoi che la invii io ai tuoi lead caldi?',
      },
    },
    common: {
      copy: 'Copia',
      share: 'Condividi',
      send: 'Invia',
      cancel: 'Annulla',
      confirm: 'Conferma',
      save: 'Salva',
      delete: 'Elimina',
      edit: 'Modifica',
      view: 'Visualizza',
    },
  },
  
  en: {
    dashboard: {
      title: 'Dashboard',
      subtitle: 'Control Panel',
      loading: 'Loading...',
      error: 'Error',
      success: 'Success',
    },
    auraVR: {
      title: 'Aura VR Generator',
      subtitle: 'Transform a smartphone video into an immersive 3D VR tour',
      startScan: 'Start Aura VR Scan',
      processing: {
        analyzing: '📹 Analyzing video...',
        mapping: '🏠 Mapping rooms...',
        rendering: '🎥 Cinematic 3D Rendering...',
        optimizing: '✨ Optimizing VR for mobile...',
        preparing: '🌐 Preparing VR link...',
        finalizing: '⚡ Finalizing immersive tour...',
        complete: '✅ VR Tour Ready!',
      },
      progress: {
        analyzingSub: 'Key frame detection',
        mappingSub: '3D spatial reconstruction',
        renderingSub: 'Generating immersive textures',
        optimizingSub: 'Compression and streaming',
        preparingSub: 'Configuring public access',
        finalizingSub: 'Adding cinematic effects',
        completeSub: 'Link generated successfully',
      },
      result: {
        title: 'VR Tour Generated!',
        subtitle: 'Your immersive tour is ready to share',
        linkLabel: 'VR Link:',
        copyLink: 'Copy Link',
        shareWhatsApp: 'WhatsApp',
        generateNew: 'Generate new tour',
        videoSource: 'Smartphone video',
        tourTime: 'VR Tour in 60s',
      },
      aria: {
        message: 'Aria: Great work!',
        stats: 'This scan will attract',
        action: 'more visits. Would you like me to send it to your hot leads?',
      },
    },
    common: {
      copy: 'Copy',
      share: 'Share',
      send: 'Send',
      cancel: 'Cancel',
      confirm: 'Confirm',
      save: 'Save',
      delete: 'Delete',
      edit: 'Edit',
      view: 'View',
    },
  },
  
  es: {
    dashboard: {
      title: 'Panel de Control',
      subtitle: 'Tablero de mandos',
      loading: 'Cargando...',
      error: 'Error',
      success: 'Éxito',
    },
    auraVR: {
      title: 'Generador Aura VR',
      subtitle: 'Transforma un video del smartphone en un tour VR inmersivo 3D',
      startScan: 'Iniciar Escaneo Aura VR',
      processing: {
        analyzing: '📹 Analizando video...',
        mapping: '🏠 Mapeando habitaciones...',
        rendering: '🎥 Renderizado Cinematográfico 3D...',
        optimizing: '✨ Optimizando VR para móvil...',
        preparing: '🌐 Preparando enlace VR...',
        finalizing: '⚡ Finalizando tour inmersivo...',
        complete: '✅ ¡Tour VR Listo!',
      },
      progress: {
        analyzingSub: 'Detección de frames clave',
        mappingSub: 'Reconstrucción espacial 3D',
        renderingSub: 'Generando texturas inmersivas',
        optimizingSub: 'Compresión y streaming',
        preparingSub: 'Configurando acceso público',
        finalizingSub: 'Añadiendo efectos cinematográficos',
        completeSub: 'Enlace generado con éxito',
      },
      result: {
        title: '¡Tour VR Generado!',
        subtitle: 'Tu tour inmersivo está listo para compartir',
        linkLabel: 'Enlace VR:',
        copyLink: 'Copiar Enlace',
        shareWhatsApp: 'WhatsApp',
        generateNew: 'Generar nuevo tour',
        videoSource: 'Video smartphone',
        tourTime: 'Tour VR en 60s',
      },
      aria: {
        message: 'Aria: ¡Excelente trabajo!',
        stats: 'Este escaneo atraerá un',
        action: 'más de visitas. ¿Quieres que lo envíe a tus leads calientes?',
      },
    },
    common: {
      copy: 'Copiar',
      share: 'Compartir',
      send: 'Enviar',
      cancel: 'Cancelar',
      confirm: 'Confirmar',
      save: 'Guardar',
      delete: 'Eliminar',
      edit: 'Editar',
      view: 'Ver',
    },
  },
  
  fr: {
    dashboard: {
      title: 'Tableau de Bord',
      subtitle: 'Panneau de contrôle',
      loading: 'Chargement...',
      error: 'Erreur',
      success: 'Succès',
    },
    auraVR: {
      title: 'Générateur Aura VR',
      subtitle: 'Transformez une vidéo smartphone en visite VR immersive 3D',
      startScan: 'Démarrer Scan Aura VR',
      processing: {
        analyzing: '📹 Analyse vidéo en cours...',
        mapping: '🏠 Cartographie des pièces...',
        rendering: '🎥 Rendu Cinématique 3D...',
        optimizing: '✨ Optimisation VR pour mobile...',
        preparing: '🌐 Préparation du lien VR...',
        finalizing: '⚡ Finalisation de la visite immersive...',
        complete: '✅ Visite VR Prête!',
      },
      progress: {
        analyzingSub: 'Détection des images clés',
        mappingSub: 'Reconstruction spatiale 3D',
        renderingSub: 'Génération de textures immersives',
        optimizingSub: 'Compression et streaming',
        preparingSub: 'Configuration de l\'accès public',
        finalizingSub: 'Ajout d\'effets cinématographiques',
        completeSub: 'Lien généré avec succès',
      },
      result: {
        title: 'Visite VR Générée!',
        subtitle: 'Votre visite immersive est prête à être partagée',
        linkLabel: 'Lien VR:',
        copyLink: 'Copier le Lien',
        shareWhatsApp: 'WhatsApp',
        generateNew: 'Générer une nouvelle visite',
        videoSource: 'Vidéo smartphone',
        tourTime: 'Visite VR en 60s',
      },
      aria: {
        message: 'Aria: Excellent travail!',
        stats: 'Ce scan attirera',
        action: 'de visites en plus. Voulez-vous que je l\'envoie à vos leads chauds?',
      },
    },
    common: {
      copy: 'Copier',
      share: 'Partager',
      send: 'Envoyer',
      cancel: 'Annuler',
      confirm: 'Confirmer',
      save: 'Enregistrer',
      delete: 'Supprimer',
      edit: 'Modifier',
      view: 'Voir',
    },
  },
  
  de: {
    dashboard: {
      title: 'Dashboard',
      subtitle: 'Kontrollpanel',
      loading: 'Lädt...',
      error: 'Fehler',
      success: 'Erfolg',
    },
    auraVR: {
      title: 'Aura VR Generator',
      subtitle: 'Verwandeln Sie ein Smartphone-Video in eine immersive 3D-VR-Tour',
      startScan: 'Aura VR Scan starten',
      processing: {
        analyzing: '📹 Video wird analysiert...',
        mapping: '🏠 Räume werden kartiert...',
        rendering: '🎥 Kinematisches 3D-Rendering...',
        optimizing: '✨ VR-Optimierung für Mobilgeräte...',
        preparing: '🌐 VR-Link wird vorbereitet...',
        finalizing: '⚡ Immersive Tour wird finalisiert...',
        complete: '✅ VR-Tour bereit!',
      },
      progress: {
        analyzingSub: 'Schlüsselbild-Erkennung',
        mappingSub: '3D-Raumrekonstruktion',
        renderingSub: 'Generierung immersiver Texturen',
        optimizingSub: 'Komprimierung und Streaming',
        preparingSub: 'Konfiguration des öffentlichen Zugangs',
        finalizingSub: 'Hinzufügen kinematischer Effekte',
        completeSub: 'Link erfolgreich generiert',
      },
      result: {
        title: 'VR-Tour generiert!',
        subtitle: 'Ihre immersive Tour ist bereit zum Teilen',
        linkLabel: 'VR-Link:',
        copyLink: 'Link kopieren',
        shareWhatsApp: 'WhatsApp',
        generateNew: 'Neue Tour generieren',
        videoSource: 'Smartphone-Video',
        tourTime: 'VR-Tour in 60s',
      },
      aria: {
        message: 'Aria: Große Arbeit!',
        stats: 'Dieser Scan wird',
        action: 'mehr Besuche anziehen. Soll ich es an Ihre heißen Leads senden?',
      },
    },
    common: {
      copy: 'Kopieren',
      share: 'Teilen',
      send: 'Senden',
      cancel: 'Abbrechen',
      confirm: 'Bestätigen',
      save: 'Speichern',
      delete: 'Löschen',
      edit: 'Bearbeiten',
      view: 'Anzeigen',
    },
  },
  
  pt: {
    dashboard: {
      title: 'Painel',
      subtitle: 'Painel de controle',
      loading: 'Carregando...',
      error: 'Erro',
      success: 'Sucesso',
    },
    auraVR: {
      title: 'Gerador Aura VR',
      subtitle: 'Transforme um vídeo de smartphone em um tour VR imersivo 3D',
      startScan: 'Iniciar Varredura Aura VR',
      processing: {
        analyzing: '📹 Analisando vídeo...',
        mapping: '🏠 Mapeando cômodos...',
        rendering: '🎥 Renderização Cinematográfica 3D...',
        optimizing: '✨ Otimizando VR para mobile...',
        preparing: '🌐 Preparando link VR...',
        finalizing: '⚡ Finalizando tour imersivo...',
        complete: '✅ Tour VR Pronto!',
      },
      progress: {
        analyzingSub: 'Detecção de frames-chave',
        mappingSub: 'Reconstrução espacial 3D',
        renderingSub: 'Gerando texturas imersivas',
        optimizingSub: 'Compressão e streaming',
        preparingSub: 'Configurando acesso público',
        finalizingSub: 'Adicionando efeitos cinematográficos',
        completeSub: 'Link gerado com sucesso',
      },
      result: {
        title: 'Tour VR Gerado!',
        subtitle: 'Seu tour imersivo está pronto para compartilhar',
        linkLabel: 'Link VR:',
        copyLink: 'Copiar Link',
        shareWhatsApp: 'WhatsApp',
        generateNew: 'Gerar novo tour',
        videoSource: 'Vídeo smartphone',
        tourTime: 'Tour VR em 60s',
      },
      aria: {
        message: 'Aria: Ótimo trabalho!',
        stats: 'Este scan atrairá',
        action: 'mais visitas. Quer que eu envie para seus leads quentes?',
      },
    },
    common: {
      copy: 'Copiar',
      share: 'Compartilhar',
      send: 'Enviar',
      cancel: 'Cancelar',
      confirm: 'Confirmar',
      save: 'Salvar',
      delete: 'Excluir',
      edit: 'Editar',
      view: 'Visualizar',
    },
  },
};

/**
 * Get translation for a specific locale
 */
export function getTranslation(locale: SupportedLocale): TranslationDictionary {
  return translations[locale] || translations.en;
}

/**
 * Detect locale from location string (simple heuristic)
 */
export function detectLocaleFromLocation(location: string): SupportedLocale {
  const loc = location.toLowerCase();
  
  // Spanish countries/cities
  if (/\b(madrid|barcelona|valencia|sevilla|málaga|españa|spain|mexico|méxico|buenos aires|argentina|colombia|chile)\b/i.test(loc)) {
    return 'es';
  }
  
  // French countries/cities
  if (/\b(paris|lyon|marseille|france|france|quebec|montreal|belgium|belgique|switzerland|suisse)\b/i.test(loc)) {
    return 'fr';
  }
  
  // German countries/cities
  if (/\b(berlin|münchen|hamburg|frankfurt|germany|deutschland|austria|österreich|zurich|zürich)\b/i.test(loc)) {
    return 'de';
  }
  
  // Portuguese countries/cities
  if (/\b(lisboa|porto|brazil|brasil|portugal|rio de janeiro|são paulo)\b/i.test(loc)) {
    return 'pt';
  }
  
  // Italian cities (fallback to IT if contains Italian city names)
  if (/\b(roma|milano|napoli|torino|firenze|venezia|genova|bologna|italia|italy)\b/i.test(loc)) {
    return 'it';
  }
  
  // Default to English for US/UK/other English-speaking regions
  return 'en';
}
