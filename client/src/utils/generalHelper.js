export const truncateString = (str = '', length) => {
  if (str.length > length) {
    return str.slice(0, length) + '...'; // Add ellipsis if truncated
  }
  return str;
};


export const debounce = (func, delay) => {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      func(...args);
    }, delay);
  };
};
