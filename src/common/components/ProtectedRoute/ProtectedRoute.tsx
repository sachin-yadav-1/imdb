import { Box, CircularProgress } from '@mui/material';
import { memo, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import AuthPage from '../../../components/pages/AuthPage';
import { checkAuthThunk } from '../../../store/auth/thunks/checkAuthThunk';
import { useAppDispatch } from '../../../store/hooks';
import type { RootState } from '../../../store/types';

const STYLES = {
  loadingContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
  },
};

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const dispatch = useAppDispatch();
  const { isAuthenticated, loading } = useSelector((state: RootState) => state.auth);
  const hasCheckedAuth = useRef(false);

  useEffect(() => {
    if (!hasCheckedAuth.current && !isAuthenticated && !loading.checkAuth) {
      hasCheckedAuth.current = true;
      dispatch(checkAuthThunk());
    }
  }, []);

  if (loading.checkAuth) {
    return (
      <Box sx={STYLES.loadingContainer}>
        <CircularProgress size={60} />
      </Box>
    );
  }

  if (!isAuthenticated) {
    return <AuthPage />;
  }

  return <>{children}</>;
};

export default memo(ProtectedRoute);
