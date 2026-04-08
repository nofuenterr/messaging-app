import type { ChangeEvent, ReactNode } from 'react';

interface TextInputProps {
  title: string;
  name: string;
  value: string;
  placeholder: string;
  maxLength: number;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  error: string | undefined;
}

export function TextInput({
  title,
  name,
  value,
  placeholder,
  maxLength,
  onChange,
  error,
}: TextInputProps) {
  return (
    <div className="grid gap-1">
      <label className="grid gap-3">
        <h4 className="text-lg font-semibold">{title}</h4>
        <input
          autoComplete="off"
          spellCheck={false}
          type="text"
          name={name}
          value={value}
          placeholder={placeholder}
          onChange={onChange}
          maxLength={maxLength}
          className="border-dark-500 bg-dark-900 rounded-lg border p-3"
        />
      </label>
      {error && <p className="text-danger text-start text-sm">{error}</p>}
    </div>
  );
}

interface TextareaProps {
  title: string;
  name: string;
  value: string;
  maxLength: number;
  onChange: (e: ChangeEvent<HTMLTextAreaElement>) => void;
  error: string | undefined;
}

export function Textarea({ title, name, value, onChange, maxLength, error }: TextareaProps) {
  return (
    <div className="grid-gap-1">
      <label className="grid gap-3">
        <h4 className="text-lg font-semibold">{title}</h4>
        <textarea
          autoComplete="off"
          spellCheck={false}
          rows={5}
          name={name}
          value={value}
          onChange={onChange}
          maxLength={maxLength}
          className="border-dark-500 bg-dark-900 rounded-lg border p-3"
        />
      </label>
      {error && <p className="text-danger text-start text-sm">{error}</p>}
    </div>
  );
}

interface EditImageWrapperProps {
  title: string;
  children: ReactNode;
}

export function EditImageWrapper({ title, children }: EditImageWrapperProps) {
  return (
    <div className="grid gap-3">
      <h4 className="text-lg font-semibold">{title}</h4>
      {children}
    </div>
  );
}
