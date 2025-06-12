export const formatCurrency = (value) => {
        if (!value) return "";
        const num = parseFloat(value.toString().replace(/[^0-9.]/g, ""));
        if (isNaN(num)) return "";
        return `$${num.toLocaleString()}`;
    };