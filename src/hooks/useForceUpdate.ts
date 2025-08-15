import { useCallback, useState } from 'react';

/**
 * Hook personnalisé pour forcer le re-rendu d'un composant
 * 
 * @returns Fonction pour forcer le re-rendu
 * 
 * @example
 * ```typescript
 * const forceUpdate = useForceUpdate();
 * 
 * // Utilisation dans un effet ou un gestionnaire d'événement
 * useEffect(() => {
 *   if (someCondition) {
 *     forceUpdate();
 *   }
 * }, [forceUpdate]);
 * ```
 */
export const useForceUpdate = (): (() => void) => {
  const [, setState] = useState<number>(0);
  
  const forceUpdate = useCallback(() => {
    console.log('[useForceUpdate] Forcing component re-render');
    setState(prev => prev + 1);
  }, []);
  
  return forceUpdate;
};
