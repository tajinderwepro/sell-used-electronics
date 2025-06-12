import React, { createContext, useState, useEffect } from 'react';
const FilterContext = createContext();

export const FilterProvider = ({ children }) => {
  const[pageSize, setPageSize] = useState(10);
  const [filters, setFilters] = useState({
      current_page: 1,
      limit: pageSize,
      search: '',
      sort_by: '',
      order_by: '',
    });
  return (
    <FilterContext.Provider value={{ filters, setFilters }}>
      {children}
    </FilterContext.Provider>
  );
};

export const useFilters = () => React.useContext(FilterContext);  
