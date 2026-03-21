import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

interface ImageUploadProps {
  label: string;
  value?: string; // base64 string
  onChange: (base64: string | null) => void;
  error?: string;
  maxSizeMB?: number;
}

export function ImageUpload({ 
  label, 
  value, 
  onChange, 
  error,
  maxSizeMB = 2 
}: ImageUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadError, setUploadError] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateAndConvertFile = async (file: File): Promise<string | null> => {
    setUploadError('');

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setUploadError('Please upload an image file');
      return null;
    }

    // Validate file size
    const maxSize = maxSizeMB * 1024 * 1024; // Convert MB to bytes
    if (file.size > maxSize) {
      setUploadError(`Image must be less than ${maxSizeMB}MB`);
      return null;
    }

    // Convert to base64
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = () => {
        setUploadError('Failed to read file');
        reject(null);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const base64 = await validateAndConvertFile(files[0]);
      if (base64) {
        onChange(base64);
      }
    }
  };

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      const base64 = await validateAndConvertFile(files[0]);
      if (base64) {
        onChange(base64);
      }
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleRemove = () => {
    onChange(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const displayError = error || uploadError;

  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      
      {value ? (
        <div className="space-y-3">
          <div className="relative inline-block">
            <img
              src={value}
              alt="Preview"
              className="max-w-xs max-h-48 rounded-lg border border-border object-contain bg-muted"
            />
          </div>
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleClick}
            >
              Change Image
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleRemove}
            >
              Remove
            </Button>
          </div>
        </div>
      ) : (
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={handleClick}
          className={`
            border-2 border-dashed rounded-lg p-8 text-center cursor-pointer
            transition-colors
            ${isDragging 
              ? 'border-primary bg-primary/10' 
              : 'border-border hover:border-primary/50 hover:bg-muted/50'
            }
          `}
        >
          <div className="flex flex-col items-center gap-2">
            <svg
              className="w-12 h-12 text-muted-foreground"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <div>
              <p className="text-sm font-medium">
                Drop your image here, or{' '}
                <span className="text-primary">browse</span>
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                PNG, JPG up to {maxSizeMB}MB
              </p>
            </div>
          </div>
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
        aria-label={label}
      />

      {displayError && (
        <p className="text-sm text-destructive" role="alert">
          {displayError}
        </p>
      )}
    </div>
  );
}
