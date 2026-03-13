import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  fullWidth?: boolean;
  loading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  fullWidth = false,
  loading = false,
  disabled,
  className = '',
  ...props
}) => {
  const base = 'px-6 py-3 rounded-xl font-semibold text-base transition-all duration-200 flex items-center justify-center gap-2';
  const variants = {
    primary: 'bg-accent text-white hover:bg-sky-600 active:bg-sky-700',
    secondary: 'bg-gray-100 text-primary hover:bg-gray-200',
    danger: 'bg-danger text-white hover:bg-red-600',
    ghost: 'bg-transparent text-accent hover:bg-sky-50',
  };
  const disabledStyle = 'opacity-50 cursor-not-allowed';
  const widthStyle = fullWidth ? 'w-full' : '';

  return (
    <button
      className={`${base} ${variants[variant]} ${disabled || loading ? disabledStyle : ''} ${widthStyle} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      )}
      {children}
    </button>
  );
};
