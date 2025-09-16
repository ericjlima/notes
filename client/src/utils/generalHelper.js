export const truncateString = (str = '', length) => {
  if (str.length > length) {
    return str.slice(0, length) + '...'; // Add ellipsis if truncated
  }
  return str;
};

export const toTitleCase = str => {
  return str.replace(/\w\S*/g, function (txt) {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });
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
