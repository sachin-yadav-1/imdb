import { Box, FormControl, FormHelperText, FormLabel, TextField, type TextFieldProps } from '@mui/material';
import { memo } from 'react';
import Button from '../../atoms/Button';

interface FormFieldProps extends Omit<TextFieldProps, 'error'> {
  error?: string;
  label?: string;
  required?: boolean;
  createButtonText?: string;
  onCreateButtonClick?: () => void;
}

const STYLES = {
  labelContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  label: {
    fontSize: '1.2rem',
    fontWeight: 600,
    marginBottom: '1rem',
  },
  input: {
    fontSize: '2rem',
    fontWeight: 400,
  },
  helperText: {
    fontSize: '1.2rem',
    fontWeight: 400,
    color: 'red',
    marginLeft: '0',
  },
};

const DEFAULT_INPUT_SLOT_PROPS = {
  input: { sx: { fontSize: '1.4rem' } },
};

const FormField: React.FC<FormFieldProps> = ({
  error,
  required,
  fullWidth,
  label,
  createButtonText,
  onCreateButtonClick,
  ...rest
}) => {
  return (
    <FormControl required={required} fullWidth={fullWidth} error={Boolean(error)}>
      {label && (
        <Box sx={STYLES.labelContainer}>
          <FormLabel sx={STYLES.label}>{label}</FormLabel>
          {createButtonText && (
            <Button variant="text" onClick={onCreateButtonClick}>
              {createButtonText}
            </Button>
          )}
        </Box>
      )}
      <TextField sx={STYLES.input} slotProps={DEFAULT_INPUT_SLOT_PROPS} {...rest} />
      {error && <FormHelperText sx={STYLES.helperText}>{error}</FormHelperText>}
    </FormControl>
  );
};

export default memo(FormField);
