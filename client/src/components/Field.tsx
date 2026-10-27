import type { InputHTMLAttributes } from 'react';

interface FieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export function Field({ label, error, id, ...props }: FieldProps) {
  const fieldId = id || props.name;
  return (
    <label className="field" htmlFor={fieldId}>
      <span className="field-label">{label}</span>
      <input
        id={fieldId}
        className={'input' + (error ? ' input-error' : '')}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? fieldId + '-error' : undefined}
        {...props}
      />
      {error && (
        <span className="field-error" id={fieldId + '-error'}>
          {error}
        </span>
      )}
    </label>
  );
}

