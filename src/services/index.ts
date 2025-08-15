// Export des services API
export { default as ApiService, ApiError, type ApiResponse, type PaginatedResponse } from './api';
export { default as AuthService, type LoginCredentials, type RegisterData, type AuthResponse } from './authService';
export { default as UserService, type User, type UpdateUserData, type ChangePasswordData } from './userService';
export { default as ChildService, type Child, type CreateChildData, type UpdateChildData, type ChildStats } from './childService';
export { 
  default as EvaluationService, 
  type Evaluation, 
  type CreateEvaluationData, 
  type UpdateEvaluationData,
  type EvaluationStats,
  type EvaluationFilters,
  type QuestionAnswer,
  type DomainScore
} from './evaluationService';

// Import des services pour l'export par défaut
import ApiService from './api';
import AuthService from './authService';
import UserService from './userService';
import ChildService from './childService';
import EvaluationService from './evaluationService';

// Export par défaut de tous les services
export default {
  ApiService,
  AuthService,
  UserService,
  ChildService,
  EvaluationService,
}; 