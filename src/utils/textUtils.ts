export const truncateWords = (input: string, maxWords: number): string => {
  if (!input || maxWords <= 0) return '';
  const words = input.trim().split(/\s+/);
  if (words.length <= maxWords) return input.trim();
  return words.slice(0, maxWords).join(' ');
};
