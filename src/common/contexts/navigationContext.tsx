import { createContext, useCallback, useEffect, useMemo, useState } from 'react';

interface NavigationContextType {
  path: string;
  navigate: (to: string) => void;
}

const NavigationContext = createContext<NavigationContextType>({
  path: '',
  navigate: () => {},
});

const NavigationProvider = ({ children }: { children: React.ReactNode }) => {
  const [currentPath, setCurrentPath] = useState(window.location.pathname);

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname);
    };

    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  const navigate = useCallback((to: string) => {
    window.history.pushState({}, '', to);
    setCurrentPath(to);
  }, []);

  const sharedState = useMemo(() => ({ path: currentPath, navigate }), [currentPath, navigate]);

  return <NavigationContext.Provider value={sharedState}>{children}</NavigationContext.Provider>;
};

export { NavigationProvider };
export default NavigationContext;
