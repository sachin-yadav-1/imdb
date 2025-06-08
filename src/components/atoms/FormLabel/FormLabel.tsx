import { FormLabel, type FormLabelProps as MuiFormLabelProps } from '@mui/material';
import { memo } from 'react';

interface FormLabelProps extends MuiFormLabelProps {
  label: string;
  required?: boolean;
}

const STYLES = {
  label: {
    fontSize: '1.4rem',
    fontWeight: 500,
    marginBottom: '1rem',
  },
  required: {
    color: 'red',
  },
};

const Label: React.FC<FormLabelProps> = ({ label, required, ...props }) => {
  return (
    <FormLabel component="legend" sx={STYLES.label} {...props}>
      {label} {required && <span style={STYLES.required}>*</span>}
    </FormLabel>
  );
};

export default memo(Label);
