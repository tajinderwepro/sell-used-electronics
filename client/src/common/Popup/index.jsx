import React, { useRef, useEffect, useState } from 'react';
import { X } from 'lucide-react';
import LoadingIndicator from '../LoadingIndicator';
import Button from '../../components/ui/Button';
import { useColorClasses } from '../../theme/useColorClasses';

const Popup = ({
  open,
  onClose,
  title,
  onSubmit,
  onDelete,
  loading,
  btnCancel = 'Cancel',
  btnSubmit = 'Submit',
  btnDelete = 'Delete',
  isbtnCancel = true,
  isbtnSubmit = true,
  isbtnDelete = false,
  children,
  width = '600px',
  height,
}) => {
  const contentRef = useRef(null);
  const [contentHeight, setContentHeight] = useState(200);
  const COLOR_CLASSES = useColorClasses();

  useEffect(() => {
    if (contentRef.current) {
      setContentHeight(contentRef.current.offsetHeight);
    }
  }, [loading, children]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-40"
        onClick={(e) => e.stopPropagation()}
      />

      {/* Modal */}
      <div
        className={`relative z-50 flex flex-col rounded-xl ${COLOR_CLASSES.bgWhite} ${COLOR_CLASSES.shadowMd}`}
        style={{ width, maxWidth: '90%' }}
      >
        {/* Header */}
        <div className={`px-6 py-4 border-b ${COLOR_CLASSES.borderGray200}`}>
          <h6 className={`text-lg font-medium text-center ${COLOR_CLASSES.primary}`}>
            {title}
          </h6>
          <button
            onClick={onClose}
            className={`absolute top-4 right-4 ${COLOR_CLASSES.textLight} hover:${COLOR_CLASSES.textHoverPrimary}`}
          >
            <X size={20} />
          </button>
        </div>

        {/* Loading Overlay */}
        {loading && (
          <div
            className="absolute top-1/2 left-1/2 w-full flex items-center justify-center z-10"
            style={{
              height: `${contentHeight}px`,
              transform: 'translate(-50%, -50%)',
            }}
          >
            <LoadingIndicator isLoading={loading} fullScreen={false} />
          </div>
        )}

        {/* Content */}
        <div
          ref={contentRef}
          className={`px-6 py-4 border-y  ${COLOR_CLASSES.borderGray200} text-sm text-center ${COLOR_CLASSES.textSecondary} ${COLOR_CLASSES.borderGray100}`}
        >
          {children}
        </div>

        {/* Actions */}
        <div className="flex justify-center gap-3 px-6 py-4">
          {isbtnCancel && (
            <Button className="w-24 text-sm" onClick={onClose} variant="secondary">
              {btnCancel}
            </Button>
          )}
          {isbtnDelete && (
            <Button className="w-24 text-sm" onClick={onDelete} variant="warning">
              {btnDelete}
            </Button>
          )}
          {isbtnSubmit && (
            <Button className="w-24 text-sm" onClick={onSubmit} variant="primary">
              {btnSubmit}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Popup;
