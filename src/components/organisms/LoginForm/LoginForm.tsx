import { Box, CircularProgress, Typography } from '@mui/material';
import { memo, useCallback } from 'react';
import { useSelector } from 'react-redux';
import useNavigation from '../../../common/hooks/useNavigation';
import { resetLoginForm, updateLoginFormField, validateLoginField } from '../../../store/auth/slices';
import { loginThunk } from '../../../store/auth/thunks/loginThunk';
import type { LoginFormState } from '../../../store/auth/types';
import { useAppDispatch } from '../../../store/hooks';
import type { RootState } from '../../../store/types';
import Button from '../../atoms/Button';
import FormField from '../../molecules/FormField';

const STYLES = {
  root: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2rem',
    width: '100%',
    maxWidth: '400px',
    margin: '0 auto',
    padding: '2rem',
    border: '1px solid #ddd',
    borderRadius: '8px',
    backgroundColor: '#fff',
  },
  title: {
    textAlign: 'center',
    fontSize: '2.4rem',
    fontWeight: 600,
    marginBottom: '1rem',
  },
  formActions: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  linkButton: {
    padding: 0,
    margin: 0,
    fontSize: '1.4rem',
    fontWeight: 400,
    textTransform: 'none',
    color: 'primary.main',
    '&:hover': {
      textDecoration: 'underline',
      backgroundColor: 'transparent',
    },
  },
  switchText: {
    textAlign: 'center',
    fontSize: '1.4rem',
    marginTop: '1rem',
  },
};

interface LoginFormProps {
  onSwitchToSignup?: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onSwitchToSignup }) => {
  const dispatch = useAppDispatch();
  const { navigate } = useNavigation();

  const { loginForm, loading } = useSelector((state: RootState) => state.auth);

  const handleFieldChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      dispatch(
        updateLoginFormField({
          field: name as keyof LoginFormState,
          value,
        })
      );
    },
    [dispatch]
  );

  const handleFieldBlur = useCallback(
    (e: React.FocusEvent<HTMLInputElement>) => {
      const { name } = e.target;
      dispatch(
        validateLoginField({
          field: name as keyof LoginFormState,
        })
      );
    },
    [dispatch]
  );

  const handleSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      dispatch(validateLoginField({ field: 'email' }));
      dispatch(validateLoginField({ field: 'password' }));

      const hasErrors = Object.values(loginForm).some((field) => field.error);
      const hasEmptyFields = Object.values(loginForm).some((field) => !field.value.trim());

      if (hasErrors || hasEmptyFields) {
        return;
      }

      const result = await dispatch(
        loginThunk({
          email: loginForm.email.value,
          password: loginForm.password.value,
        })
      );

      if (loginThunk.fulfilled.match(result)) {
        dispatch(resetLoginForm());
        navigate('/');
      }
    },
    [dispatch, loginForm, navigate]
  );

  return (
    <Box component="form" sx={STYLES.root} onSubmit={handleSubmit}>
      <Typography variant="h1" sx={STYLES.title}>
        Login
      </Typography>

      <FormField
        name="email"
        label="Email"
        type="email"
        required
        fullWidth
        value={loginForm.email.value}
        error={loginForm.email.error}
        onChange={handleFieldChange}
        onBlur={handleFieldBlur}
        disabled={loading.login}
      />

      <FormField
        name="password"
        label="Password"
        type="password"
        required
        fullWidth
        value={loginForm.password.value}
        error={loginForm.password.error}
        onChange={handleFieldChange}
        onBlur={handleFieldBlur}
        disabled={loading.login}
      />

      <Box sx={STYLES.formActions}>
        <Button
          type="submit"
          variant="contained"
          fullWidth
          disabled={loading.login}
          startIcon={loading.login ? <CircularProgress size={20} /> : null}
        >
          {loading.login ? 'Logging in...' : 'Login'}
        </Button>
      </Box>

      {onSwitchToSignup && (
        <Typography sx={STYLES.switchText}>
          Don't have an account?{' '}
          <Button variant="text" sx={STYLES.linkButton} onClick={onSwitchToSignup} disabled={loading.login}>
            Sign up here
          </Button>
        </Typography>
      )}
    </Box>
  );
};

export default memo(LoginForm);
