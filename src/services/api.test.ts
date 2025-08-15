import { ApiService, ApiError } from './api';

// Mock de fetch
global.fetch = jest.fn();

// Mock de localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

describe('ApiService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorageMock.getItem.mockReturnValue('mock-token');
  });

  describe('get', () => {
    it('devrait faire un appel GET avec les bons headers', async () => {
      const mockResponse = { data: 'test' };
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await ApiService.get('/test');

      expect(global.fetch).toHaveBeenCalledWith(
        'http://localhost:3000/api/test',
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer mock-token',
          },
        }
      );
      expect(result).toEqual(mockResponse);
    });

    it('devrait ajouter les paramètres de requête', async () => {
      const mockResponse = { data: 'test' };
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      await ApiService.get('/test', { page: 1, limit: 10 });

      expect(global.fetch).toHaveBeenCalledWith(
        'http://localhost:3000/api/test?page=1&limit=10',
        expect.any(Object)
      );
    });

    it('devrait gérer les erreurs HTTP', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 404,
        statusText: 'Not Found',
      });

      await expect(ApiService.get('/test')).rejects.toThrow(ApiError);
    });
  });

  describe('post', () => {
    it('devrait faire un appel POST avec les données', async () => {
      const mockResponse = { success: true };
      const testData = { name: 'test' };
      
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await ApiService.post('/test', testData);

      expect(global.fetch).toHaveBeenCalledWith(
        'http://localhost:3000/api/test',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer mock-token',
          },
          body: JSON.stringify(testData),
        }
      );
      expect(result).toEqual(mockResponse);
    });
  });

  describe('put', () => {
    it('devrait faire un appel PUT avec les données', async () => {
      const mockResponse = { success: true };
      const testData = { name: 'updated' };
      
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await ApiService.put('/test/1', testData);

      expect(global.fetch).toHaveBeenCalledWith(
        'http://localhost:3000/api/test/1',
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer mock-token',
          },
          body: JSON.stringify(testData),
        }
      );
      expect(result).toEqual(mockResponse);
    });
  });

  describe('delete', () => {
    it('devrait faire un appel DELETE', async () => {
      const mockResponse = { success: true };
      
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await ApiService.delete('/test/1');

      expect(global.fetch).toHaveBeenCalledWith(
        'http://localhost:3000/api/test/1',
        {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer mock-token',
          },
        }
      );
      expect(result).toEqual(mockResponse);
    });
  });

  describe('patch', () => {
    it('devrait faire un appel PATCH avec les données', async () => {
      const mockResponse = { success: true };
      const testData = { name: 'patched' };
      
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await ApiService.patch('/test/1', testData);

      expect(global.fetch).toHaveBeenCalledWith(
        'http://localhost:3000/api/test/1',
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer mock-token',
          },
          body: JSON.stringify(testData),
        }
      );
      expect(result).toEqual(mockResponse);
    });
  });

  describe('upload', () => {
    it('devrait faire un appel POST pour l\'upload de fichier', async () => {
      const mockResponse = { success: true };
      const testFile = new File(['test'], 'test.txt', { type: 'text/plain' });
      
      // Mock de XMLHttpRequest
      const mockXHR = {
        open: jest.fn(),
        setRequestHeader: jest.fn(),
        send: jest.fn(),
        status: 200,
        statusText: 'OK',
        responseText: JSON.stringify(mockResponse),
        upload: {
          addEventListener: jest.fn(),
        },
        addEventListener: jest.fn((event, callback) => {
          if (event === 'load') {
            setTimeout(() => {
              callback({
                target: {
                  status: 200,
                  statusText: 'OK',
                  responseText: JSON.stringify(mockResponse)
                }
              });
            }, 0);
          }
        }),
      };
      
      global.XMLHttpRequest = jest.fn(() => mockXHR) as any;

      const result = await ApiService.upload('/upload', testFile);

      expect(mockXHR.open).toHaveBeenCalledWith('POST', 'http://localhost:3000/api/upload');
      expect(mockXHR.setRequestHeader).toHaveBeenCalledWith('Authorization', 'Bearer mock-token');
      expect(result).toEqual(mockResponse);
    });
  });

  describe('gestion des erreurs', () => {
    it('devrait gérer les erreurs de réseau', async () => {
      (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

      await expect(ApiService.get('/test')).rejects.toThrow('Network error');
    });

    it('devrait gérer les réponses JSON invalides', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => {
          throw new Error('Invalid JSON');
        },
      });

      await expect(ApiService.get('/test')).rejects.toThrow(ApiError);
    });

    it('devrait gérer les réponses vides (204)', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        status: 204,
      });

      const result = await ApiService.get('/test');
      expect(result).toEqual({});
    });
  });

  describe('gestion des tokens', () => {
    it('devrait ne pas ajouter le token si absent', async () => {
      localStorageMock.getItem.mockReturnValue(null);
      
      const mockResponse = { data: 'test' };
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      await ApiService.get('/test');

      expect(global.fetch).toHaveBeenCalledWith(
        'http://localhost:3000/api/test',
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
    });
  });
});
