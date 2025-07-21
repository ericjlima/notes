export const truncateString = (str = '', length) => {
  if (str.length > length) {
    return str.slice(0, length) + '...'; // Add ellipsis if truncated
  }
  return str;
};
