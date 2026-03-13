export const isValidPhone = (phone: string): boolean =>
  /^\+992\d{9}$/.test(phone);

export const isValidOtp = (code: string): boolean =>
  /^\d{6}$/.test(code);
