import { Autocomplete, Box, Typography, type TextFieldProps } from '@mui/material';
import React, { memo } from 'react';
import Button from '../../atoms/Button';
import FormInput from '../../atoms/FormInput';

interface FormSearchProps<T> {
  multiple?: boolean;
  options: T[];
  selected?: T[];
  onChange: (event: React.SyntheticEvent, value: T | T[] | null) => void;
  onInputChange: (event: React.SyntheticEvent, value: string) => void;
  onBlur: () => void;
  loading: boolean;
  disabled: boolean;
  touched: boolean;
  error?: string;
  label: string;
  placeholder?: string;
  getOptionLabel: (option: T) => string;
  isOptionEqualToValue: (option: T, value: T) => boolean;
  onButtonClick?: () => void;
  size?: TextFieldProps['size'];
  buttonLabel?: string;
  required?: boolean;
}

const AUTOCOMPLETE_SLOT_PROPS = {
  paper: {
    sx: {
      '& .MuiAutocomplete-option': {
        fontSize: '1.4rem',
        fontWeight: 400,
      },
      '& .MuiAutocomplete-noOptions': {
        fontSize: '1.4rem',
        fontWeight: 400,
      },
    },
  },
};

const LABEL_STYLES = {
  root: {
    display: 'flex',
    alignItems: 'center',
    gap: 2,
    mb: 1,
    justifyContent: 'space-between',
  },

  button: {
    fontSize: '1.2rem',
    fontWeight: 500,
    textTransform: 'none',
    minWidth: 'auto',
    padding: 0,
    margin: 0,
    '&:hover': {
      backgroundColor: 'transparent',
      textDecoration: 'underline',
    },
  },
  text: {
    fontSize: '1.4rem',
    fontWeight: 500,
    color: 'text.secondary',
  },
  required: {
    color: 'red',
    marginLeft: '0.5rem',
  },
};

const FormSearch = <T,>({
  multiple = false,
  options,
  selected,
  loading,
  disabled,
  touched,
  error,
  label,
  placeholder,
  size,
  buttonLabel,
  required = false,
  onBlur,
  onChange,
  onInputChange,
  getOptionLabel,
  onButtonClick,
  isOptionEqualToValue,
}: FormSearchProps<T>) => {
  return (
    <Box>
      <Box sx={LABEL_STYLES.root}>
        <Typography component="legend" sx={LABEL_STYLES.text}>
          {label}
          {required && <span style={LABEL_STYLES.required}>*</span>}
        </Typography>

        <Button variant="text" size="small" sx={LABEL_STYLES.button} onClick={onButtonClick}>
          {buttonLabel}
        </Button>
      </Box>

      <Autocomplete
        multiple={multiple}
        options={options}
        getOptionLabel={getOptionLabel}
        value={selected}
        onChange={onChange}
        onInputChange={onInputChange}
        onBlur={onBlur}
        loading={loading}
        disabled={disabled}
        isOptionEqualToValue={isOptionEqualToValue}
        slotProps={AUTOCOMPLETE_SLOT_PROPS}
        renderInput={(params) => (
          <FormInput
            {...params}
            size={size}
            placeholder={placeholder}
            error={touched && Boolean(error)}
            helperText={touched ? error : ''}
          />
        )}
      />
    </Box>
  );
};

export default memo(FormSearch);
