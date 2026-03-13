export const isValidPhone = (phone: string): boolean => {
  const cleaned = phone.replace(/\D/g, '');
  return cleaned.length === 12 && cleaned.startsWith('992');
};

export const isValidOTP = (code: string): boolean => {
  return /^\d{6}$/.test(code);
};
