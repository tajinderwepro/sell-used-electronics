import React from 'react';
import PropTypes from 'prop-types';
import { useColorClasses } from '../../theme/useColorClasses';

const LoadingIndicator = ({ isLoading, fullScreen }) => {
  const COLOR_CLASSES = useColorClasses();
  return (
  <div
    className={`flex items-center justify-center bg-white bg-opacity-50 absolute inset-0 z-[10000] ${
      fullScreen ? 'fixed' : ''
    }`}
    style={{ display: isLoading ? 'flex' : 'none' }}
  >
    {/* Spinner */}
    <div className={`w-12 h-12 border-4 border-t-4 ${COLOR_CLASSES.borderPrimary} rounded-full animate-spin`} />
  </div>
);
}

LoadingIndicator.propTypes = {
  isLoading: PropTypes.bool.isRequired,
  fullScreen: PropTypes.any,
};

export default LoadingIndicator;