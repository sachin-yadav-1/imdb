import { Button as MuiButton, type ButtonProps as MuiButtonProps } from '@mui/material';
import { memo, useMemo } from 'react';

const BUTTON_STYLES = {
  borderRadius: '4px',
  fontSize: '1.4rem',
  fontWeight: 500,
};

interface ButtonProps extends MuiButtonProps {
  children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({ children, ...props }) => {
  const styles = useMemo(
    () => ({
      ...BUTTON_STYLES,
      ...props.sx,
    }),
    [props.sx]
  );

  return (
    <MuiButton disableElevation sx={styles} {...props}>
      {children}
    </MuiButton>
  );
};

export default memo(Button);
