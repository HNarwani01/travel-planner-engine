export const sanitizeInput = (input: string): string => {
  if (!input) return '';
  return input.trim().replace(/[<>]/g, '');
};
