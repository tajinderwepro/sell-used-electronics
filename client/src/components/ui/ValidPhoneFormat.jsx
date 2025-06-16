const validatePhone = (input) => {
  if (!input) return "";

  // Ensure input is a string
  input = String(input).replace(/\D/g, "").substring(0, 10);

  const size = input.length;
  if (size === 0) {
    return "";
  } else if (size < 4) {
    return `(${input}`;
  } else if (size < 7) {
    return `(${input.substring(0, 3)}) ${input.substring(3)}`;
  } else {
    return `(${input.substring(0, 3)}) ${input.substring(3, 6)}-${input.substring(6)}`;
  }
};

export default validatePhone;
