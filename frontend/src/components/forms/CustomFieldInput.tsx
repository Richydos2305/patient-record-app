import type { CustomField, CustomFieldValue } from '../../types';
import { Input } from './Input';
import { Textarea } from './Textarea';
import styles from './CustomFieldInput.module.css';

interface CustomFieldInputProps {
  field: CustomField;
  value: CustomFieldValue | undefined;
  onChange: (value: CustomFieldValue) => void;
  error?: string;
}

export function CustomFieldInput({ field, value, onChange, error }: CustomFieldInputProps) {
  const handleChange = (newValue: string | number | File | File[]) => {
    onChange({
      fieldId: field.id,
      field,
      value: newValue,
    });
  };

  const currentValue = value?.value || '';

  switch (field.type) {
    case 'text':
      return (
        <Input
          label={field.label}
          value={currentValue as string}
          onChange={(e) => handleChange(e.target.value)}
          required={field.required}
          error={error}
          placeholder={field.placeholder}
        />
      );

    case 'textarea':
      return (
        <Textarea
          label={field.label}
          value={currentValue as string}
          onChange={(e) => handleChange(e.target.value)}
          required={field.required}
          error={error}
          placeholder={field.placeholder}
          rows={4}
        />
      );

    case 'number':
      return (
        <Input
          label={field.label}
          type="number"
          value={currentValue as string}
          onChange={(e) => handleChange(e.target.value)}
          required={field.required}
          error={error}
          placeholder={field.placeholder}
        />
      );

    case 'date':
      return (
        <Input
          label={field.label}
          type="date"
          value={currentValue as string}
          onChange={(e) => handleChange(e.target.value)}
          required={field.required}
          error={error}
        />
      );

    case 'dropdown':
      return (
        <div className={styles.field}>
          <label className={styles.label}>
            {field.label}
            {field.required && <span className={styles.required}>*</span>}
          </label>
          <select
            value={currentValue as string}
            onChange={(e) => handleChange(e.target.value)}
            required={field.required}
            className={`${styles.select} ${error ? styles.selectError : ''}`}
            aria-invalid={!!error}
          >
            <option value="">Select an option...</option>
            {field.options?.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          {error && (
            <p className={styles.error} role="alert">
              {error}
            </p>
          )}
        </div>
      );

    case 'file':
      return (
        <div className={styles.field}>
          <label className={styles.label}>
            {field.label}
            {field.required && <span className={styles.required}>*</span>}
          </label>
          <div className={styles.fileInput}>
            <input
              type="file"
              onChange={(e) => {
                const files = e.target.files;
                if (files && files.length > 0) {
                  handleChange(files[0]);
                }
              }}
              required={field.required}
              className={styles.fileInputElement}
              id={`file-${field.id}`}
            />
            <label htmlFor={`file-${field.id}`} className={styles.fileLabel}>
              <svg
                className={styles.fileIcon}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                />
              </svg>
              {currentValue && (currentValue as File).name
                ? (currentValue as File).name
                : 'Choose file'}
            </label>
          </div>
          {error && (
            <p className={styles.error} role="alert">
              {error}
            </p>
          )}
        </div>
      );

    default:
      return null;
  }
}
