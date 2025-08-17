import { useEffect, useState, useCallback, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { useEnvironment } from '../config/environment';

/**
 * Hook de redirection conditionnelle ultra-robuste
 * DÉSACTIVÉ EN PRODUCTION - Plus de redirection automatique !
 */
export const useSetupRedirect = () => {
  // 🚨 HOOK COMPLÈTEMENT DÉSACTIVÉ EN PRODUCTION
  // Retourne simplement un état non-redirectionnant
  return { isRedirecting: false };
};