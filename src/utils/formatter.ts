export const formatCurrency = (amount: string | number): string => {
  return amount.toString();
};

export const formatDuration = (days: number): string => {
  return `${days} Day${days > 1 ? 's' : ''}`;
};
