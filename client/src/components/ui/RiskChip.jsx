export const RiskChip = ({ value }) => {
console.log(value="excellent",'value')
  const riskConfig = {
    // fair: { label: "High", className: "bg-red-100 text-red-800" },
    // excellent: { label: "Medium", className: "bg-yellow-100 text-yellow-800" },
    // good: { label: "Low", className: "bg-green-100 text-green-800" },
    // bad: { label: "Unknown", className: "bg-gray-100 text-gray-800" },
    excellent: { label: "Excellent", className: "bg-green-200 text-green-800" },
    good:      { label: "Good",      className: "bg-emerald-100 text-emerald-800" },
    fair:       { label: "Fair",   className: "bg-yellow-100 text-yellow-800" },
    bad:       { label: "Bad",       className: "bg-orange-100 text-orange-800" },

  };

  const config = riskConfig[value?.toLowerCase()] ;

  return (
    <span
      className={`inline-block px-3 py-1 text-xs font-semibold rounded-full h-[24px] ${config.className}`}
    >
      {/* {config.label} */}
    </span>
  );
};
