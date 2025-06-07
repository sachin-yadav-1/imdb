import { memo } from 'react';
import useNavigation from '../../hooks/useNavigation';

interface RouteProps {
  path: string;
  element: React.ReactNode;
}

const Route: React.FC<RouteProps> = ({ path, element }) => {
  const { path: currentPath } = useNavigation();

  if (path === currentPath) {
    return <>{element}</>;
  }

  // Handle dynamic routes (e.g., /movie/:id)
  if (path.includes(':')) {
    const pathParts = path.split('/');
    const currentParts = currentPath.split('/');

    if (pathParts.length !== currentParts.length) {
      return null;
    }

    const matches = pathParts.every((part, index) => {
      if (part.startsWith(':')) {
        return true;
      }

      return part === currentParts[index];
    });

    if (matches) {
      return <>{element}</>;
    }
  }

  return null;
};

export default memo(Route);
