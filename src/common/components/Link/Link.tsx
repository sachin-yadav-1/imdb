import { memo, useCallback } from 'react';
import useNavigation from '../../../common/hooks/useNavigation';

interface LinkProps extends React.HTMLAttributes<HTMLAnchorElement> {
  to: string;
  children: React.ReactNode;
}

const Link: React.FC<LinkProps> = ({ to, children }) => {
  const { navigate } = useNavigation();

  const handleLinkClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>) => {
      if (e.metaKey || e.ctrlKey) return;

      e.preventDefault();
      navigate(to);
    },
    [navigate, to]
  );

  return (
    <a href={to} onClick={handleLinkClick}>
      {children}
    </a>
  );
};

export default memo(Link);
