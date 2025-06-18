import React from 'react';
import { useColorClasses } from '../../theme/useColorClasses';

const SearchInput = ({ value, onChange, placeholder = 'Search...', className = '' }) => {
  const COLOR_CLASSES = useColorClasses()
  return (
    <input
      type="text"
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className={`${COLOR_CLASSES.bgWhite} ${COLOR_CLASSES.borderGray200} w-full md:w-64 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 ${className}`}
    />
  );
};

export default SearchInput;
