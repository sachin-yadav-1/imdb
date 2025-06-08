import { FormControl, TextField, type FormLabelProps, type TextFieldProps } from '@mui/material';
import { forwardRef, memo, useMemo } from 'react';
import FormLabel from '../FormLabel';

interface FormInputProps extends Omit<TextFieldProps, 'slotProps'> {
  label?: string;
  slotProps?: {
    label?: FormLabelProps;
    input?: TextFieldProps['slotProps'];
  };
  required?: boolean;
  InputProps?: TextFieldProps['InputProps'];
}

const DEFAULT_INPUT_SLOT_PROPS = {
  formHelperText: {
    sx: {
      fontSize: '1.2rem',
      fontWeight: 400,
      padding: 0,
      margin: '1rem 0 0 0',
    },
  },
  input: {
    sx: {
      fontSize: '1.4rem',
      fontWeight: 400,
    },
  },
};

const FormInput = forwardRef<HTMLInputElement, FormInputProps>(
  ({ label, slotProps, InputProps, required, ...props }, ref) => {
    const inputSlotProps = useMemo(() => {
      return {
        ...DEFAULT_INPUT_SLOT_PROPS,
        ...slotProps?.input,
        ...(InputProps && {
          input: { ...DEFAULT_INPUT_SLOT_PROPS.input, ...InputProps },
        }),
      };
    }, [slotProps, InputProps]);

    return (
      <FormControl fullWidth>
        {label && <FormLabel label={label} required={required || false} {...slotProps?.label} />}

        <TextField fullWidth {...props} inputRef={ref} InputProps={InputProps} slotProps={inputSlotProps} />
      </FormControl>
    );
  }
);

export default memo(FormInput);
