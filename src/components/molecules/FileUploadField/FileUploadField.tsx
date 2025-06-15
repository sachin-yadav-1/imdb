import { Avatar, Box, FormControl, FormHelperText, FormLabel, IconButton } from '@mui/material';
import { Close, CloudUpload } from '@mui/icons-material';
import { memo, useCallback, useRef } from 'react';
import Button from '../../atoms/Button';

interface FileUploadFieldProps {
  name: string;
  label: string;
  value?: File | string | null;
  error?: string;
  accept?: string;
  required?: boolean;
  fullWidth?: boolean;
  disabled?: boolean;
  onChange?: (file: File | null) => void;
  onBlur?: () => void;
}

const STYLES = {
  root: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  label: {
    fontSize: '1.2rem',
    fontWeight: 600,
    marginBottom: '0.5rem',
  },
  uploadContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    justifyContent: 'space-between',
    border: '1px dashed #ddd',
    padding: '1rem',
    borderRadius: '4px',
  },
  previewContainer: {
    position: 'relative',
    display: 'inline-block',
  },
  avatar: {
    width: 100,
    height: 150,
    borderRadius: '4px',
  },
  clearButton: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: 'error.main',
    color: 'white',
    width: 24,
    height: 24,
    '&:hover': {
      backgroundColor: 'error.dark',
    },
  },
  uploadButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
  },
  hiddenInput: {
    display: 'none',
  },
  helperText: {
    fontSize: '1.2rem',
    fontWeight: 400,
    color: 'red',
    marginLeft: '0',
  },
};

const FileUploadField: React.FC<FileUploadFieldProps> = ({
  name,
  label,
  value,
  error,
  disabled = false,
  accept = 'image/*',
  required = false,
  fullWidth = true,
  onChange,
  onBlur,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0] || null;
      onChange?.(file);

      if (onBlur) {
        onBlur();
      }

      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    },
    [onChange, onBlur]
  );

  const handleClearFile = useCallback(() => {
    onChange?.(null);

    if (onBlur) {
      onBlur();
    }
  }, [onChange, onBlur]);

  const handleWindowFocus = useCallback(() => {
    if (onBlur) {
      onBlur();
    }
  }, [onBlur]);

  const handleUploadClickWithBlur = useCallback(() => {
    fileInputRef.current?.click();

    const handleFocus = () => {
      handleWindowFocus();
      window.removeEventListener('focus', handleFocus);
    };

    setTimeout(() => {
      window.addEventListener('focus', handleFocus);
    }, 100);
  }, [handleWindowFocus]);

  const getPreviewUrl = useCallback(() => {
    if (!value) return null;

    if (typeof value === 'string') {
      return value;
    }

    if (value instanceof File) {
      return URL.createObjectURL(value);
    }

    return null;
  }, [value]);

  const previewUrl = getPreviewUrl();

  return (
    <FormControl required={required} fullWidth={fullWidth} error={Boolean(error)} disabled={disabled}>
      <FormLabel sx={STYLES.label}>{label}</FormLabel>

      <Box sx={STYLES.uploadContainer}>
        <Button
          variant="outlined"
          startIcon={<CloudUpload />}
          onClick={handleUploadClickWithBlur}
          disabled={disabled}
          sx={STYLES.uploadButton}
        >
          {value ? 'Change File' : 'Upload File'}
        </Button>

        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          disabled={disabled}
          onChange={handleFileSelect}
          style={STYLES.hiddenInput}
          name={name}
        />

        <Box sx={STYLES.previewContainer}>
          <Avatar src={previewUrl || ''} sx={STYLES.avatar} variant="rounded" />
          {previewUrl && (
            <IconButton size="small" sx={STYLES.clearButton} onClick={handleClearFile}>
              <Close fontSize="small" />
            </IconButton>
          )}
        </Box>
      </Box>

      {error && <FormHelperText sx={STYLES.helperText}>{error}</FormHelperText>}
    </FormControl>
  );
};

export default memo(FileUploadField);
