import React, { useRef, useEffect, useState } from 'react';
import ThemeButton from '../../components/ui/Button';
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
}) => {
  const contentRef = useRef(null);
  const [contentHeight, setContentHeight] = useState(200); // Default height
  const COLOR_CLASSES = useColorClasses();
  useEffect(() => {
    if (contentRef.current) {
      setContentHeight(contentRef.current.offsetHeight);
    }
  }, [loading, children]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center rounded-lg">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-20"
        onClick={(e) => {
          e.stopPropagation(); // Prevent backdrop click from closing (per original logic)
        }}
      />

      {/* Modal Content */}
      <div
        className="bg-gray-100 relative z-50 flex flex-col  rounded-lg"
        style={{ width: width, maxWidth: '80%' }}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 relative">
          <h6 className={`text-lg font-medium ${COLOR_CLASSES.primary} text-center mx-auto`}>
            {title}
          </h6>
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-600 hover:text-gray-800"
          >
            <X />
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
          className="px-6 py-4 border-y border-gray-200 text-center text-sm text-gray-700 relative"
        >
          {children}
        </div>

        {/* Actions */}
        <div className="flex justify-center gap-2 px-6 py-4">
          {isbtnCancel && (
            <Button className='w-24 text-sm' onClick={onClose} variant="danger">{btnCancel}</Button>  
          )}
          {isbtnDelete && (
            <Button className='w-24 text-sm' onClick={onDelete} variant="warning">{btnDelete}</Button> 
          )}
          {isbtnSubmit && (
            <Button className='w-24 text-sm' onClick={onSubmit} variant="primary">{btnSubmit}</Button> 
          )}
        </div>
      </div>
    </div>
  );
};

export default Popup;




