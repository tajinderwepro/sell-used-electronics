export const Chip = (status) => {

  const statusConfig = {
    admin: { label: "Admin", className: "bg-blue-100 text-blue-800" },
    user: { label: "User", className: "bg-gray-100 text-gray-800" },
    pending:  { label: "Pending", className: "bg-gray-100 text-gray-800" },
    approved: { label: "Approved", className: "bg-green-100 text-green-800" }
  };

  const config = statusConfig[status];

  return config ? (
    <span className={`inline-block px-3 py-1 text-xs font-semibold rounded-full ${config.className}`}>
      {config.label}
    </span>
  ) : (
    <span>{status}</span>
  );
};
