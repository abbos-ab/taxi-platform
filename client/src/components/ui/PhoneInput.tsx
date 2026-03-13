import React from 'react';

interface PhoneInputProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

export const PhoneInput: React.FC<PhoneInputProps> = ({ value, onChange, error }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/[^\d+]/g, '');
    if (!val.startsWith('+')) val = '+' + val;
    if (val.length <= 13) onChange(val);
  };

  return (
    <div className="w-full">
      <label className="block text-sm font-medium text-text-secondary mb-1">Номер телефона</label>
      <div className="relative">
        <input
          type="tel"
          value={value}
          onChange={handleChange}
          placeholder="+992 XX XXX XXXX"
          maxLength={13}
          className={`w-full px-4 py-3 rounded-xl border border-border bg-white text-primary text-lg font-medium
            focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent
            placeholder:text-text-secondary/40 ${error ? 'border-danger' : ''}`}
        />
      </div>
      {error && <p className="text-danger text-sm mt-1">{error}</p>}
    </div>
  );
};
