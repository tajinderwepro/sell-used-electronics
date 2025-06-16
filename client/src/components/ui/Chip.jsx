export const Chip = ({status}) => {

  const statusConfig = {
    admin: { label: "Admin", className: "bg-blue-300 text-blue-800" },
    user: { label: "User", className: "bg-gray-300 text-gray-800" },
    pending:  { label: "Pending", className: "bg-gray-300 text-gray-800" },
    approved: { label: "Approved", className: "bg-green-300 text-green-800" },
    excellent: { label: "Excellent", className: "bg-green-300 text-green-800" },
    good:      { label: "Good",      className: "bg-yellow-200 text-yellow-800" },
    fair:      { label: "Fair",      className: "bg-orange-300 text-orange-800" },
    bad:       { label: "Bad",       className: "bg-red-400 text-red-800" },
  };
  const config = statusConfig[status];

  return config ? (
    <span className={`inline-block px-3 py-1 text-xs font-semibold rounded-full  ${config.className}`}>
      {config.label}
    </span>
  ) : (
    <span>{status}</span>
  );
};
