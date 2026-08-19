import React from 'react';

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  error?: string;
};

export const Input: React.FC<InputProps> = ({ label, error, ...rest }) => {
  return (
    <label className="flex flex-col gap-1 w-full">
      {label && <span className="text-label-sm text-on-surface-variant">{label}</span>}
      <input className="h-10 px-3 bg-surface-container-lowest border border-outline-variant rounded-md outline-none focus:border-primary focus:ring-2 focus:ring-primary/15" {...rest} />
      {error && <span className="text-red-600 text-sm mt-1">{error}</span>}
    </label>
  );
};

export default Input;
