import React from 'react';

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  loading?: boolean;
};

export const Button: React.FC<ButtonProps> = ({ variant = 'primary', loading, children, ...rest }) => {
  const base = 'inline-flex items-center justify-center rounded px-4 py-2 font-semibold';
  const variants: Record<string, string> = {
    primary: 'bg-primary text-on-primary hover:opacity-95',
    secondary: 'bg-secondary text-on-secondary hover:opacity-95',
    danger: 'bg-error text-on-error hover:opacity-95',
    ghost: 'bg-transparent text-on-surface hover:bg-surface-container-lowest'
  };

  return (
    <button className={[base, variants[variant]].join(' ')} disabled={loading || rest.disabled} {...rest}>
      {loading ? 'Loading...' : children}
    </button>
  );
};

export default Button;
