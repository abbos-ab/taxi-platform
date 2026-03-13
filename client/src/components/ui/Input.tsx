import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input: React.FC<InputProps> = ({ label, error, className = '', ...props }) => {
  return (
    <div className="w-full">
      {label && <label className="block text-sm font-medium text-text-secondary mb-1">{label}</label>}
      <input
        className={`w-full px-4 py-3 rounded-xl border border-border bg-white text-primary text-base
          focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent
          placeholder:text-text-secondary/50 ${error ? 'border-danger' : ''} ${className}`}
        {...props}
      />
      {error && <p className="text-danger text-sm mt-1">{error}</p>}
    </div>
  );
};
