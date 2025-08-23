import { UnifiedError } from '../components/UnifiedErrorAlert';

// Types d'erreurs supportés
export type ErrorType = 
  | 'email_exists'
  | 'invalid_credentials' 
  | 'server_error'
  | 'network_error'
  | 'validation_error'
  | 'server_unavailable'
  | 'generic';

// Interface pour les traductions d'erreurs
export interface ErrorTranslations {
  email_exists: {
    message: string;
    action: string;
  };
  invalid_credentials: {
    message: string;
    action: string;
  };
  server_error: {
    message: string;
    action: string;
  };
  network_error: {
    message: string;
    action: string;
  };
  validation_error: {
    message: string;
    action: string;
  };
  server_unavailable: {
    message: string;
    action: string;
  };
  generic: {
    message: string;
    action: string;
  };
}

// Traductions des erreurs par langue
const errorTranslations: Record<string, ErrorTranslations> = {
  fr: {
    email_exists: {
      message: 'Cet email est déjà enregistré',
      action: 'Se connecter',
    },
    invalid_credentials: {
      message: 'Email ou mot de passe incorrect',
      action: 'Réessayer',
    },
    server_error: {
      message: 'Erreur du serveur, réessayez plus tard',
      action: 'Réessayer',
    },
    network_error: {
      message: 'Vérifiez votre connexion internet',
      action: 'Vérifier ma connexion',
    },
    validation_error: {
      message: 'Vérifiez vos informations',
      action: 'Corriger',
    },
    server_unavailable: {
      message: 'Le serveur est temporairement indisponible',
      action: 'Réessayer plus tard',
    },
    generic: {
      message: 'Une erreur est survenue',
      action: 'Réessayer',
    },
  },
  en: {
    email_exists: {
      message: 'This email is already registered',
      action: 'Sign in',
    },
    invalid_credentials: {
      message: 'Invalid email or password',
      action: 'Try again',
    },
    server_error: {
      message: 'Server error, please try again later',
      action: 'Try again',
    },
    network_error: {
      message: 'Check your internet connection',
      action: 'Check connection',
    },
    validation_error: {
      message: 'Please check your information',
      action: 'Correct',
    },
    server_unavailable: {
      message: 'Server is temporarily unavailable',
      action: 'Try later',
    },
    generic: {
      message: 'An error occurred',
      action: 'Try again',
    },
  },
  de: {
    email_exists: {
      message: 'Diese E-Mail ist bereits registriert',
      action: 'Anmelden',
    },
    invalid_credentials: {
      message: 'Ungültige E-Mail oder Passwort',
      action: 'Erneut versuchen',
    },
    server_error: {
      message: 'Serverfehler, bitte später versuchen',
      action: 'Erneut versuchen',
    },
    network_error: {
      message: 'Überprüfen Sie Ihre Internetverbindung',
      action: 'Verbindung prüfen',
    },
    validation_error: {
      message: 'Bitte überprüfen Sie Ihre Angaben',
      action: 'Korrigieren',
    },
    server_unavailable: {
      message: 'Server ist vorübergehend nicht verfügbar',
      action: 'Später versuchen',
    },
    generic: {
      message: 'Ein Fehler ist aufgetreten',
      action: 'Erneut versuchen',
    },
  },
  it: {
    email_exists: {
      message: 'Questa email è già registrata',
      action: 'Accedi',
    },
    invalid_credentials: {
      message: 'Email o password non validi',
      action: 'Riprova',
    },
    server_error: {
      message: 'Errore del server, riprovare più tardi',
      action: 'Riprova',
    },
    network_error: {
      message: 'Controlla la tua connessione internet',
      action: 'Controlla connessione',
    },
    validation_error: {
      message: 'Controlla le tue informazioni',
      action: 'Correggi',
    },
    server_unavailable: {
      message: 'Il server è temporaneamente non disponibile',
      action: 'Riprova più tardi',
    },
    generic: {
      message: 'Si è verificato un errore',
      action: 'Riprova',
    },
  },
};

/**
 * Service centralisé pour la gestion des erreurs
 * Convertit les erreurs brutes en erreurs unifiées avec traductions
 */
export class ErrorHandlingService {
  /**
   * Détermine le type d'erreur basé sur le statut HTTP et le message
   */
  static determineErrorType(status?: number, message?: string): ErrorType {
    // Erreurs basées sur le statut HTTP
    if (status === 409) return 'email_exists';
    if (status === 401) return 'invalid_credentials';
    if (status === 400) return 'validation_error';
    if (status === 404) return 'server_unavailable';
    if (status === 500) return 'server_error';
    if (status === 0) return 'network_error';

    // Erreurs basées sur le message
    if (message) {
      const lowerMessage = message.toLowerCase();
      if (lowerMessage.includes('email') && lowerMessage.includes('already')) {
        return 'email_exists';
      }
      if (lowerMessage.includes('password') || lowerMessage.includes('credentials')) {
        return 'invalid_credentials';
      }
      if (lowerMessage.includes('network') || lowerMessage.includes('failed to fetch')) {
        return 'network_error';
      }
      if (lowerMessage.includes('server')) {
        return 'server_error';
      }
    }

    return 'generic';
  }

  /**
   * Obtient l'URL de redirection pour une action d'erreur
   */
  static getActionUrl(errorType: ErrorType): string | undefined {
    switch (errorType) {
      case 'email_exists':
        return '/login';
      case 'invalid_credentials':
        return '/login';
      default:
        return undefined;
    }
  }

  /**
   * Crée une erreur unifiée à partir d'une erreur brute
   */
  static createUnifiedError(
    error: any,
    language: string = 'fr'
  ): UnifiedError {
    // Extraire les informations de l'erreur
    const status = error?.status || error?.response?.status || (error instanceof Error && (error as any).status);
    const message = error?.message || error?.response?.data?.message || 'Une erreur est survenue';
    


    // Déterminer le type d'erreur
    const errorType = this.determineErrorType(status, message);

    // Obtenir les traductions pour la langue
    const translations = errorTranslations[language] || errorTranslations.fr;
    const errorTranslation = translations[errorType];

    // Créer l'erreur unifiée
    const unifiedError: UnifiedError = {
      type: errorType,
      message: errorTranslation.message,
      action: {
        label: errorTranslation.action,
        url: this.getActionUrl(errorType),
      },
    };



    return unifiedError;
  }

  /**
   * Crée une erreur unifiée directement à partir d'un type et d'une langue
   */
  static createErrorByType(
    errorType: ErrorType,
    language: string = 'fr'
  ): UnifiedError {
    const translations = errorTranslations[language] || errorTranslations.fr;
    const errorTranslation = translations[errorType];

    return {
      type: errorType,
      message: errorTranslation.message,
      action: {
        label: errorTranslation.action,
        url: this.getActionUrl(errorType),
      },
    };
  }

  /**
   * Vérifie si une langue est supportée pour les traductions d'erreurs
   */
  static isLanguageSupported(language: string): boolean {
    return Object.keys(errorTranslations).includes(language);
  }

  /**
   * Obtient toutes les traductions d'erreurs pour une langue
   */
  static getErrorTranslations(language: string): ErrorTranslations {
    return errorTranslations[language] || errorTranslations.fr;
  }
}

export default ErrorHandlingService;
