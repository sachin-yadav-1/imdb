import { Button } from '@mui/material';
import { memo, useMemo } from 'react';
import Link from '../../../common/components/Link';
import useNavigation from '../../../common/hooks/useNavigation';

const STYLES = {
  root: {
    padding: '0.5rem 1rem',
    borderRadius: '3rem',
    fontSize: '1.2rem',
    fontWeight: 500,
    textTransform: 'capitalize',
    transition: 'all 0.3s ease',
    '&:hover': {
      backgroundColor: 'primary.light',
    },
  },
  active: {
    backgroundColor: 'primary.dark',
  },
};

interface NavItemProps {
  label: string;
  path: string;
}
const NavItem: React.FC<NavItemProps> = ({ label, path }) => {
  const { path: currentPath } = useNavigation();

  const styles = useMemo(
    () => ({
      ...STYLES.root,
      ...(currentPath === path && STYLES.active),
    }),
    [currentPath, path]
  );

  return (
    <Link to={path}>
      <Button variant="text" color="inherit" sx={styles}>
        {label}
      </Button>
    </Link>
  );
};

export default memo(NavItem);
