export const Chip = ({ status,children }) => {
  const statusConfig = {
    admin: { label: "Admin", className: "bg-blue-300 text-blue-800" },
    user: { label: "User", className: "bg-gray-300 text-gray-800" },

    // Order lifecycle
    pending: { label: "Pending", className: "bg-gray-300 text-white" },
    approved: { label: "Approved", className: "bg-green-500 text-white" },
    shipped: { label: "Shipped", className: "bg-[#2196F3] text-white" },
    received: { label: "Received", className: "bg-green-300 text-green-800" },

    // Device condition
    excellent: { label: "Excellent", className: "bg-green-500 text-white" },
    good: { label: "Good", className: "bg-yellow-200 text-yellow-800" },
    fair: { label: "Fair", className: "bg-orange-300 text-orange-800" },
    bad: { label: "Bad", className: "bg-red-400 text-red-800" },

    // Tracking statuses
    in_transit: { label: "In Transit", className: "bg-blue-100 text-blue-800" },
    out_for_delivery: { label: "Out for Delivery", className: "bg-indigo-300 text-indigo-900" },
    delivered: { label: "Delivered", className: "bg-green-500 text-white" },
    pre_transit: { label: "Pre Transit", className: "bg-gray-200 text-gray-700" },
    return_to_sender: { label: "Return to Sender", className: "bg-red-300 text-red-900" },

    //Payment statuses
    success: { label: "Paid", className: "bg-green-500 text-white" },

    // Stripe Status
    verified: { label: "Verified", className: "bg-green-500 text-white" },

    // Risk Status
    highRisk : { label: "High Risk", className: "bg-red-500/20 border border-red-500 text-red-500" },
  };

  const config = statusConfig[status];
  
  return config ? (
    <span className={`inline-block px-3 py-1 text-xs font-semibold rounded-full capitalize ${config.className}`}>
         {children ?? config.label}
    </span>
  ) : (
    <span className="inline-block px-3 py-1 text-xs font-semibold rounded-full bg-gray-200 text-gray-600 capitalize">
      {status}
    </span>
  );
};
