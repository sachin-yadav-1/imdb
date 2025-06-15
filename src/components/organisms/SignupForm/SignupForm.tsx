import { Box, CircularProgress, Typography } from '@mui/material';
import { memo, useCallback } from 'react';
import { useSelector } from 'react-redux';
import useNavigation from '../../../common/hooks/useNavigation';
import { resetSignupForm, updateSignupFormField, validateSignupField } from '../../../store/auth/slices';
import { signupThunk } from '../../../store/auth/thunks/signupThunk';
import type { SignupFormState } from '../../../store/auth/types';
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
  nameFields: {
    display: 'flex',
    gap: '1rem',
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

interface SignupFormProps {
  onSwitchToLogin?: () => void;
}

const SignupForm: React.FC<SignupFormProps> = ({ onSwitchToLogin }) => {
  const dispatch = useAppDispatch();
  const { navigate } = useNavigation();

  const { signupForm, loading, error } = useSelector((state: RootState) => state.auth);

  const handleFieldChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      dispatch(
        updateSignupFormField({
          field: name as keyof SignupFormState,
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
        validateSignupField({
          field: name as keyof SignupFormState,
        })
      );
    },
    [dispatch]
  );

  const handleSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      Object.keys(signupForm).forEach((field) => {
        dispatch(
          validateSignupField({
            field: field as keyof SignupFormState,
          })
        );
      });

      const hasErrors = Object.values(signupForm).some((field) => field.error);
      const hasEmptyFields = Object.values(signupForm).some((field) => !field.value.trim());

      if (hasErrors || hasEmptyFields) {
        return;
      }

      const result = await dispatch(
        signupThunk({
          email: signupForm.email.value,
          password: signupForm.password.value,
          firstName: signupForm.firstName.value,
          lastName: signupForm.lastName.value,
        })
      );

      if (signupThunk.fulfilled.match(result)) {
        dispatch(resetSignupForm());
        if (!result.payload.emailConfirmationRequired) {
          navigate('/');
        }
      }
    },
    [dispatch, signupForm, navigate]
  );

  return (
    <Box component="form" sx={STYLES.root} onSubmit={handleSubmit}>
      <Typography variant="h1" sx={STYLES.title}>
        Sign Up
      </Typography>

      <Box sx={STYLES.nameFields}>
        <FormField
          name="firstName"
          label="First Name"
          required
          fullWidth
          value={signupForm.firstName.value}
          error={signupForm.firstName.error}
          onChange={handleFieldChange}
          onBlur={handleFieldBlur}
          disabled={loading.signup}
        />

        <FormField
          name="lastName"
          label="Last Name"
          required
          fullWidth
          value={signupForm.lastName.value}
          error={signupForm.lastName.error}
          onChange={handleFieldChange}
          onBlur={handleFieldBlur}
          disabled={loading.signup}
        />
      </Box>

      <FormField
        name="email"
        label="Email"
        type="email"
        required
        fullWidth
        value={signupForm.email.value}
        error={signupForm.email.error}
        onChange={handleFieldChange}
        onBlur={handleFieldBlur}
        disabled={loading.signup}
      />

      <FormField
        name="password"
        label="Password"
        type="password"
        required
        fullWidth
        value={signupForm.password.value}
        error={signupForm.password.error}
        onChange={handleFieldChange}
        onBlur={handleFieldBlur}
        disabled={loading.signup}
      />

      <FormField
        name="confirmPassword"
        label="Confirm Password"
        type="password"
        required
        fullWidth
        value={signupForm.confirmPassword.value}
        error={signupForm.confirmPassword.error}
        onChange={handleFieldChange}
        onBlur={handleFieldBlur}
        disabled={loading.signup}
      />

      <Box sx={STYLES.formActions}>
        <Button
          type="submit"
          variant="contained"
          fullWidth
          disabled={loading.signup}
          startIcon={loading.signup ? <CircularProgress size={20} /> : null}
        >
          {loading.signup ? 'Creating Account...' : 'Sign Up'}
        </Button>
      </Box>

      {onSwitchToLogin && (
        <Typography sx={STYLES.switchText}>
          Already have an account?{' '}
          <Button variant="text" sx={STYLES.linkButton} onClick={onSwitchToLogin} disabled={loading.signup}>
            Login here
          </Button>
        </Typography>
      )}
    </Box>
  );
};

export default memo(SignupForm);
