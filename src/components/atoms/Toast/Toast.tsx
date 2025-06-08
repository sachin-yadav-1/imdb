import CloseIcon from '@mui/icons-material/Close';
import { Alert, IconButton, Snackbar } from '@mui/material';
import { memo, useCallback, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useDispatch, useSelector } from 'react-redux';
import { resetToast, setToast } from '../../../store/common/slices';
import type { RootState } from '../../../store/types';

const Toast: React.FC = () => {
  const dispatch = useDispatch();
  const toast = useSelector((state: RootState) => state.common.toast) || {};

  useEffect(() => {
    const timer = setTimeout(() => {
      dispatch(resetToast());
    }, toast.duration);

    return () => {
      clearTimeout(timer);
    };
  }, [toast.duration, dispatch]);

  const handleClose = useCallback(
    (_: React.SyntheticEvent | Event, reason?: string) => {
      if (reason === 'clickaway') {
        return;
      }
      dispatch(setToast({ show: false, message: '', duration: 0, type: '' }));
    },
    [dispatch]
  );

  if (!toast.show) return null;

  return createPortal(
    <Snackbar
      open={toast.show}
      autoHideDuration={toast.duration}
      onClose={handleClose}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
    >
      <Alert
        onClose={handleClose}
        severity={toast.type as 'success' | 'info' | 'warning' | 'error'}
        variant="filled"
        sx={{ width: '100%' }}
        action={
          <IconButton aria-label="close" color="inherit" size="small" onClick={handleClose}>
            <CloseIcon fontSize="small" />
          </IconButton>
        }
      >
        {toast.message}
      </Alert>
    </Snackbar>,
    document.getElementById('toast-root') as HTMLElement
  );
};

export default memo(Toast);
