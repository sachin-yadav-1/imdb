export const getYearFromDate = (dateString: string): number => {
  return new Date(dateString).getFullYear();
};
