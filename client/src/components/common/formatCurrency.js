export const formatCurrency = (value, currency = "USD", locale = "en-US") => {
  if (!value) return "";
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(Number(value));
};
