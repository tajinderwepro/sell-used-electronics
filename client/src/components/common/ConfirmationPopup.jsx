// components/common/ConfirmationPopup.jsx
import React from "react";
import Popup from "../../common/Popup";

const ConfirmationPopup = ({
  open,
  onClose,
  onSubmit,
  title = "Confirm Action",
  description,
  icon,
  content,
  loading = false,
  btnCancel = "Cancel",
  btnSubmit = "Submit",
  isbtnCancel = true,
  isbtnSubmit = true,
}) => {
  return (
    <Popup
      open={open}
      onClose={onClose}
      onSubmit={onSubmit}
      title={title}
      btnCancel={btnCancel}
      btnSubmit={btnSubmit}
      isbtnCancel={isbtnCancel}
      isbtnSubmit={isbtnSubmit}
      loading={loading}
    >
      {content ? (
        content
      ) : (
        <div className="flex flex-col items-center text-center space-y-4 py-2">
          {icon && <div className="w-20 h-20">{icon}</div>}
          {description && <p className="text-sm font-medium text-gray-700">{description}</p>}
        </div>
      )}
    </Popup>
  );
};

export default ConfirmationPopup;
