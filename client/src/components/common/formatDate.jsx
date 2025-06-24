export const formatDate = (dateStr, min = true) => {
  const options = {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    
  };

  if (min) {
    options.minute = '2-digit';
    options.hour = '2-digit';
    options.hour12 = true;
  }

  return new Date(dateStr).toLocaleDateString('en-GB', options);
};
