import { Delete, PhotoCamera } from '@mui/icons-material';
import { Box, Button, Card, CardMedia, FormControl, FormHelperText, IconButton, Typography } from '@mui/material';
import React, { memo, useCallback, useState } from 'react';
import FormLabel from '../../atoms/FormLabel';

interface FileUploadProps {
  label?: string;
  accept?: string;
  maxSize?: number; // in bytes
  allowedTypes?: string[];
  required?: boolean;
  disabled?: boolean;
  error?: boolean;
  helperText?: string;
  value?: File | null;
  preview?: string | null;
  showPreview?: boolean;
  uploadProgress?: number;
  multiple?: boolean;
  variant?: 'button' | 'dropzone';
  placeholder?: string;
  onChange: (file: File | File[] | null) => void;
  onRemove?: () => void;
  onBlur?: () => void;
}

const FileUpload: React.FC<FileUploadProps> = ({
  label = 'Upload File',
  accept = 'image/*',
  maxSize = 5 * 1024 * 1024,
  allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
  required = false,
  disabled = false,
  error = false,
  helperText = '',
  value = null,
  preview = null,
  showPreview = true,
  multiple = false,
  placeholder = 'Choose file',
  onChange,
  onRemove,
  onBlur,
}) => {
  const [localPreview, setLocalPreview] = useState<string | null>(null);

  const validateFile = (file: File): string | null => {
    if (!allowedTypes.includes(file.type)) {
      const typeList = allowedTypes.map((type) => type.split('/')[1]).join(', ');
      return `Please upload a valid file type: ${typeList}`;
    }

    if (file.size > maxSize) {
      const maxSizeMB = (maxSize / 1024 / 1024).toFixed(1);
      return `File size must be less than ${maxSizeMB}MB`;
    }

    return null;
  };

  const handleFileSelect = useCallback(
    (files: FileList | null) => {
      if (!files || files.length === 0) return;

      const selectedFiles = Array.from(files);

      if (!multiple && selectedFiles.length > 1) {
        return;
      }

      // Validate files
      for (const file of selectedFiles) {
        const validationError = validateFile(file);
        if (validationError) {
          // You might want to show this error in a toast or callback
          console.error(validationError);
          return;
        }
      }

      const result = multiple ? selectedFiles : selectedFiles[0];
      onChange?.(result);

      // Create preview for single image files
      if (!multiple && selectedFiles[0] && selectedFiles[0].type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (event) => {
          setLocalPreview(event.target?.result as string);
        };
        reader.readAsDataURL(selectedFiles[0]);
      }
    },
    [allowedTypes, maxSize, multiple, onChange]
  );

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFileSelect(e.target.files);
    onBlur?.();
  };

  const handleRemove = () => {
    onChange?.(null);
    setLocalPreview(null);
    onRemove?.();

    // Reset file input
    const fileInput = document.getElementById(`file-upload-${label}`) as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  };

  const displayPreview = preview || localPreview;
  const isImage = value?.type?.startsWith('image/') || displayPreview;

  return (
    <FormControl fullWidth error={error}>
      {label && <FormLabel label={label} required={required} />}

      <Box
        sx={{
          display: 'flex',
          gap: 2,
          alignItems: 'center',
          justifyContent: 'space-between',
          border: '1px dashed #e0e0e0',
          padding: '1rem',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            gap: 2,
            flexDirection: 'column',
            alignItems: 'flex-start',
          }}
        >
          <input
            accept={accept}
            style={{ display: 'none' }}
            id={`file-upload-${label}`}
            type="file"
            multiple={multiple}
            onChange={handleFileChange}
            disabled={disabled}
          />
          <label htmlFor={`file-upload-${label}`}>
            <Button variant="outlined" component="span" startIcon={<PhotoCamera />} disabled={disabled}>
              {placeholder}
            </Button>
          </label>

          {/* File Info */}
          {value && (
            <Typography variant="body2" color="text.secondary">
              Selected: {value.name} ({(value.size / 1024 / 1024).toFixed(2)} MB)
            </Typography>
          )}
        </Box>

        {/* Preview */}
        {showPreview && isImage && displayPreview && (
          <Card sx={{ width: '72px', height: '110px', position: 'relative' }}>
            <CardMedia
              component="img"
              height="200"
              image={displayPreview}
              alt="File preview"
              sx={{ objectFit: 'cover', width: '72px', height: '110px' }}
            />
            <IconButton
              sx={{
                position: 'absolute',
                top: 8,
                right: 8,
                bgcolor: 'rgba(0, 0, 0, 0.5)',
                color: 'white',
                '&:hover': {
                  bgcolor: 'rgba(0, 0, 0, 0.7)',
                },
              }}
              onClick={handleRemove}
              disabled={disabled}
            >
              <Delete />
            </IconButton>
          </Card>
        )}
      </Box>

      {helperText && <FormHelperText>{helperText}</FormHelperText>}
    </FormControl>
  );
};

export default memo(FileUpload);
