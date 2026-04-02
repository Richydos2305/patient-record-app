import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Modal } from '../ui/Modal';
import type { CustomField, CustomFieldType } from '../../types';
import styles from './CustomFieldBuilder.module.css';

interface CustomFieldBuilderProps {
  onSave: (field: Omit<CustomField, 'id'>) => void;
  onClose: () => void;
}

export function CustomFieldBuilder({ onSave, onClose }: CustomFieldBuilderProps) {
  const [fieldType, setFieldType] = useState<CustomFieldType>('text');
  const [label, setLabel] = useState('');
  const [required, setRequired] = useState(false);
  const [options, setOptions] = useState<string[]>([]);
  const [optionInput, setOptionInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!label.trim()) return;

    const newField: Omit<CustomField, 'id'> = {
      name: label.trim().toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, ''),
      label: label.trim(),
      description: '',
      type: fieldType,
      required,
      options: fieldType === 'dropdown' ? options : undefined,
    };

    onSave(newField);
    handleClose();
  };

  const handleClose = () => {
    setLabel('');
    setFieldType('text');
    setRequired(false);
    setOptions([]);
    setOptionInput('');
    onClose();
  };

  const handleAddOption = () => {
    if (optionInput.trim() && !options.includes(optionInput.trim())) {
      setOptions([...options, optionInput.trim()]);
      setOptionInput('');
    }
  };

  const handleRemoveOption = (index: number) => {
    setOptions(options.filter((_, i) => i !== index));
  };

  return (
    <Modal
      isOpen={true}
      onClose={handleClose}
      title="Add Custom Field"
      footer={
        <>
          <Button type="button" variant="ghost" onClick={handleClose}>
            Cancel
          </Button>
          <Button type="submit" form="custom-field-form">
            Add Field
          </Button>
        </>
      }
    >
      <form id="custom-field-form" onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.field}>
            <label htmlFor="field-label" className={styles.label}>
              Field Label
            </label>
            <input
              id="field-label"
              type="text"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              placeholder="e.g., Blood Type, Allergies"
              required
              className={styles.input}
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="field-type" className={styles.label}>
              Field Type
            </label>
            <select
              id="field-type"
              value={fieldType}
              onChange={(e) => setFieldType(e.target.value as CustomFieldType)}
              className={styles.select}
            >
              <option value="text">Text Input</option>
              <option value="textarea">Text Area</option>
              <option value="number">Number</option>
              <option value="date">Date</option>
              <option value="boolean">Yes/No (Checkbox)</option>
              <option value="dropdown">Dropdown</option>
              <option value="file">File Upload</option>
            </select>
          </div>

          {fieldType === 'dropdown' && (
            <div className={styles.field}>
              <label className={styles.label}>Dropdown Options</label>
              <div className={styles.optionInput}>
                <input
                  type="text"
                  value={optionInput}
                  onChange={(e) => setOptionInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddOption();
                    }
                  }}
                  placeholder="Type option and press Enter"
                  className={styles.input}
                />
                <Button type="button" size="sm" onClick={handleAddOption}>
                  Add
                </Button>
              </div>

              {options.length > 0 && (
                <ul className={styles.optionList}>
                  {options.map((option, index) => (
                    <li key={index} className={styles.option}>
                      <span>{option}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveOption(index)}
                        className={styles.removeButton}
                        aria-label={`Remove ${option}`}
                      >
                        ×
                      </button>
                    </li>
                  ))}
                </ul>
              )}

              {fieldType === 'dropdown' && options.length === 0 && (
                <p className={styles.hint}>Add at least one option for the dropdown</p>
              )}
            </div>
          )}

          <div className={styles.checkbox}>
            <input
              id="required"
              type="checkbox"
              checked={required}
              onChange={(e) => setRequired(e.target.checked)}
              className={styles.checkboxInput}
            />
            <label htmlFor="required" className={styles.checkboxLabel}>
              Required field
            </label>
          </div>
        </form>
      </Modal>
  );
}
