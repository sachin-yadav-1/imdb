import { Autocomplete } from '@mui/material';
import { debounce } from 'lodash';
import { memo, useCallback, useMemo, useRef } from 'react';
import FormField from '../../molecules/FormField';

interface SearchOption {
  id?: string | number;
  name: string;
  [key: string]: any;
}

interface SearchComponentProps {
  name: string;
  label: string;
  value?: SearchOption | SearchOption[] | null;
  options: SearchOption[];
  multiple?: boolean;
  required?: boolean;
  error?: string;
  debounceTime?: number;
  fullWidth?: boolean;
  createButtonText?: string;
  onCreateButtonClick?: () => void;
  onSearch: (searchValue: string, fieldName: string) => void;
  onInputValueChange: (searchValue: string, fieldName: string) => void;
  onChange?: (fieldName: string, value: SearchOption | SearchOption[] | null) => void;
  onBlur?: (fieldName: string) => void;
  getOptionLabel?: (option: SearchOption) => string;
  sx?: any;
}

const SearchComponent: React.FC<SearchComponentProps> = ({
  name,
  label,
  value,
  options,
  multiple = false,
  required = false,
  error = '',
  debounceTime = 0,
  fullWidth = true,
  createButtonText,
  onSearch,
  onChange,
  onCreateButtonClick,
  onInputValueChange,
  onBlur,
  getOptionLabel = (option) => option.name || '',
  sx,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = useCallback(
    (e: unknown, inputValue: string) => {
      onInputValueChange?.(inputValue, name);
      if (inputValue?.trim().length > 0) {
        debouncedSearch(inputValue, name);
      }
    },
    [name, onSearch, onInputValueChange]
  );

  const handleSelectionChange = useCallback(
    (_: unknown, selectedValue: SearchOption | SearchOption[] | null) => {
      if (onChange) {
        onChange(name, selectedValue);
      }
    },
    [name, onChange]
  );

  const handleBlur = useCallback(() => {
    if (onBlur) {
      onBlur(name);
    }
  }, [name, onBlur]);

  const debouncedSearch = useMemo(
    () =>
      debounce((searchValue: string, fieldName: string) => {
        onSearch(searchValue, fieldName);
      }, debounceTime),
    [onSearch, debounceTime]
  );

  return (
    <Autocomplete
      fullWidth={fullWidth}
      key={name}
      ref={inputRef}
      data-field={name}
      sx={sx}
      value={value}
      multiple={multiple}
      onChange={handleSelectionChange}
      onInputChange={handleInputChange}
      options={options}
      clearOnBlur={false}
      getOptionLabel={getOptionLabel}
      renderInput={(params) => (
        <FormField
          {...params}
          name={name}
          label={label}
          fullWidth
          required={required}
          error={error}
          createButtonText={createButtonText}
          onCreateButtonClick={onCreateButtonClick}
          onBlur={handleBlur}
        />
      )}
    />
  );
};

export default memo(SearchComponent);
