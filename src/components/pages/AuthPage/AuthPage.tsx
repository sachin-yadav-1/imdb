import { Box, Container } from '@mui/material';
import { memo, useCallback, useState } from 'react';
import LoginForm from '../../organisms/LoginForm';
import SignupForm from '../../organisms/SignupForm';

const STYLES = {
  root: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f5f5f5',
    padding: '2rem 0',
  },
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
};

type AuthMode = 'login' | 'signup';

const AuthPage = () => {
  const [mode, setMode] = useState<AuthMode>('login');

  const handleSwitchToSignup = useCallback(() => {
    setMode('signup');
  }, []);

  const handleSwitchToLogin = useCallback(() => {
    setMode('login');
  }, []);

  return (
    <Box sx={STYLES.root}>
      <Container maxWidth="sm" sx={STYLES.container}>
        {mode === 'login' ? (
          <LoginForm onSwitchToSignup={handleSwitchToSignup} />
        ) : (
          <SignupForm onSwitchToLogin={handleSwitchToLogin} />
        )}
      </Container>
    </Box>
  );
};

export default memo(AuthPage);
