import { FormControl, FormHelperText, MenuItem, Select, type FormLabelProps, type SelectProps } from '@mui/material';
import { forwardRef, memo, useMemo } from 'react';
import FormLabel from '../../atoms/FormLabel';

interface Option {
  value: string | number;
  label: string;
  disabled?: boolean;
}

interface FormSelectProps extends Omit<SelectProps, 'slotProps'> {
  label?: string;
  options: Option[];
  placeholder?: string;
  slotProps?: {
    label?: FormLabelProps;
    select?: SelectProps['slotProps'];
  };
  required?: boolean;
  error?: boolean;
  helperText?: string;
}

const DEFAULT_SELECT_SLOT_PROPS = {
  formHelperText: {
    sx: {
      fontSize: '1.2rem',
      fontWeight: 400,
      padding: 0,
      margin: '1rem 0 0 0',
    },
  },
};

const FormSelect = forwardRef<HTMLSelectElement, FormSelectProps>(
  ({ label, options, placeholder, slotProps, required, error, helperText, ...props }, ref) => {
    const selectSlotProps = useMemo(() => {
      return {
        ...DEFAULT_SELECT_SLOT_PROPS,
        ...slotProps?.select,
      };
    }, [slotProps]);

    return (
      <FormControl fullWidth error={error}>
        {label && <FormLabel label={label} required={required || false} />}

        <Select
          fullWidth
          displayEmpty
          {...props}
          ref={ref}
          slotProps={selectSlotProps as SelectProps['slotProps']}
          sx={{
            fontSize: '1.4rem',
            fontWeight: 400,
            '& .MuiSelect-select': {
              fontSize: '1.4rem',
              fontWeight: 400,
            },
            ...props.sx,
          }}
        >
          {placeholder && (
            <MenuItem value="" sx={{ fontSize: '1.4rem', fontWeight: 400 }} disabled>
              <em>{placeholder}</em>
            </MenuItem>
          )}
          {options.map((option) => (
            <MenuItem
              key={option.value}
              value={option.value}
              disabled={option.disabled}
              sx={{ fontSize: '1.4rem', fontWeight: 400 }}
            >
              {option.label}
            </MenuItem>
          ))}
        </Select>

        {helperText && (
          <FormHelperText sx={{ fontSize: '1.2rem', fontWeight: 400, margin: '1rem 0 0 0' }}>
            {helperText}
          </FormHelperText>
        )}
      </FormControl>
    );
  }
);

export default memo(FormSelect);
