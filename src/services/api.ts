// Configuration de base pour l'API
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';

// Types pour les réponses API
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Classe pour gérer les erreurs API
export class ApiError extends Error {
  constructor(
    public status: number,
    public message: string,
    public data?: any
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

// Fonction utilitaire pour obtenir le token d'authentification
const getAuthToken = (): string | null => {
  return localStorage.getItem('token');
};

// Fonction utilitaire pour construire les headers
const getHeaders = (): HeadersInit => {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };

  const token = getAuthToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  return headers;
};

// Fonction utilitaire pour gérer les réponses
const handleResponse = async <T>(response: Response): Promise<T> => {
  if (!response.ok) {
    let errorMessage = 'Une erreur est survenue';
    let errorData = null;

    try {
      const errorResponse = await response.json();
      errorMessage = errorResponse.message || errorResponse.error || errorMessage;
      errorData = errorResponse;
    } catch {
      // Si la réponse n'est pas du JSON, utiliser le texte
      errorMessage = response.statusText || errorMessage;
    }

    // Si c'est une erreur 401, nettoyer les tokens
    if (response.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      errorMessage = 'Token d\'accès requis';
    }

    throw new ApiError(response.status, errorMessage, errorData);
  }

  // Si la réponse est vide (204 No Content)
  if (response.status === 204) {
    return {} as T;
  }

  try {
    return await response.json();
  } catch {
    throw new ApiError(response.status, 'Erreur lors du parsing de la réponse');
  }
};

// Classe principale pour les appels API
export class ApiService {
  // Méthode GET générique
  static async get<T>(endpoint: string, params?: Record<string, any>): Promise<T> {
    const url = new URL(`${API_BASE_URL}${endpoint}`);
    
    if (params) {
      Object.keys(params).forEach(key => {
        if (params[key] !== undefined && params[key] !== null) {
          url.searchParams.append(key, params[key].toString());
        }
      });
    }

    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: getHeaders(),
    });

    return handleResponse<T>(response);
  }

  // Méthode POST générique
  static async post<T>(endpoint: string, data?: any): Promise<T> {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: getHeaders(),
      body: data ? JSON.stringify(data) : undefined,
    });

    return handleResponse<T>(response);
  }

  // Méthode PUT générique
  static async put<T>(endpoint: string, data?: any): Promise<T> {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: data ? JSON.stringify(data) : undefined,
    });

    return handleResponse<T>(response);
  }

  // Méthode DELETE générique
  static async delete<T>(endpoint: string): Promise<T> {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });

    return handleResponse<T>(response);
  }

  // Méthode PATCH générique
  static async patch<T>(endpoint: string, data?: any): Promise<T> {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'PATCH',
      headers: getHeaders(),
      body: data ? JSON.stringify(data) : undefined,
    });

    return handleResponse<T>(response);
  }

  // Méthode pour upload de fichiers
  static async upload<T>(endpoint: string, file: File, onProgress?: (progress: number) => void): Promise<T> {
    const formData = new FormData();
    formData.append('file', file);

    const xhr = new XMLHttpRequest();
    
    return new Promise((resolve, reject) => {
      xhr.upload.addEventListener('progress', (event) => {
        if (event.lengthComputable && onProgress) {
          const progress = (event.loaded / event.total) * 100;
          onProgress(progress);
        }
      });

      xhr.addEventListener('load', () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          try {
            const response = JSON.parse(xhr.responseText);
            resolve(response);
          } catch {
            resolve({} as T);
          }
        } else {
          reject(new ApiError(xhr.status, xhr.statusText));
        }
      });

      xhr.addEventListener('error', () => {
        reject(new ApiError(0, 'Erreur réseau'));
      });

      xhr.open('POST', `${API_BASE_URL}${endpoint}`);
      
      const token = getAuthToken();
      if (token) {
        xhr.setRequestHeader('Authorization', `Bearer ${token}`);
      }
      
      xhr.send(formData);
    });
  }
}

// Export par défaut
export default ApiService; 