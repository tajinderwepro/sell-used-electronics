import React, { useState, useMemo } from 'react';
import LoadingIndicator from '../LoadingIndicator';
import SearchInput from '../../components/ui/SearchInput';
import Button from '../../components/ui/Button';
import { Plus } from 'lucide-react';
import { useColorClasses } from '../../theme/useColorClasses';
import { FONT_FAMILIES } from '../../constants/theme';

const CommonTable = ({
  columns,
  data = [],
  loading = false,
  searchable = true,
  pageSize = 10,
  title = '',
  onClick = () => {},
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const COLOR_CLASSES = useColorClasses();

  const filteredData = useMemo(() => {
    if (!searchTerm) return data;
    return data.filter((row) =>
      columns.some((col) => {
        const value = row[col.key];
        return (
          typeof value === 'string' &&
          value.toLowerCase().includes(searchTerm.toLowerCase())
        );
      })
    );
  }, [searchTerm, data, columns]);

  const totalPages = Math.ceil(filteredData.length / pageSize);
  const paginatedData = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filteredData.slice(start, start + pageSize);
  }, [filteredData, page, pageSize]);

  const handlePrev = () => setPage((p) => Math.max(p - 1, 1));
  const handleNext = () => setPage((p) => Math.min(p + 1, totalPages));

  return (
    <div className={`w-full font-sans ${COLOR_CLASSES.bgWhite}  ${FONT_FAMILIES.primary}`}>
      {/* Title & Button */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-2">
        <h2 className={`text-lg font-semibold ${COLOR_CLASSES.textPrimary}`}>{title}</h2>
        <Button className='w-24 text-sm' onClick={onClick} icon={<Plus size={18} />}>Create</Button>
      </div>

      {/* Table & Search */}
      <div className={`overflow-x-auto ${COLOR_CLASSES.bgWhite}  border rounded-lg ${COLOR_CLASSES.shadowMd}`}>
        <LoadingIndicator isLoading={loading} />
        <div className="flex flex-col md:flex-row justify-end items-center gap-2 m-3">
          {searchable && (
            <SearchInput
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setPage(1);
              }}
            />
          )}
        </div>

        <table className="min-w-full divide-y text-sm">
          <thead className={`${COLOR_CLASSES.primaryLightBg} sticky top-0 z-10`}>
            <tr>
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={`px-6 py-5 text-left text-xs font-semibold uppercase tracking-wider ${COLOR_CLASSES.textSecondary}`}
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y">
            {paginatedData.length > 0 ? (
              paginatedData.map((row, rowIndex) => (
                <tr
                  key={rowIndex}
                  className={`${
                    rowIndex % 2 === 0 ? COLOR_CLASSES.bgWhite : COLOR_CLASSES.bgWhite
                  } hover:${COLOR_CLASSES.primaryLightBg} transition-colors`}
                >
                  {columns.map((col) => (
                    <td
                      key={col.key}
                      className={`px-6 py-4 whitespace-nowrap truncate max-w-xs ${COLOR_CLASSES.textPrimary}`}
                    >
                      {col.render ? col.render(row) : row[col.key]}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={columns.length}
                  className={`text-center py-4 ${COLOR_CLASSES.textSecondary}`}
                >
                  No data available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center mt-4 text-sm mr-3">
          <button
            onClick={handlePrev}
            disabled={page === 1}
            className={`px-4 py-2 mr-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${COLOR_CLASSES.secondaryBg} ${COLOR_CLASSES.textPrimary} ${COLOR_CLASSES.secondaryBgHover}`}
          >
            Previous
          </button>
          <span className={`${COLOR_CLASSES.textSecondary} mr-3`}>
            Page {page} of {totalPages}
          </span>
          <button
            onClick={handleNext}
            disabled={page === totalPages}
            className={`px-4 py-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${COLOR_CLASSES.secondaryBg} ${COLOR_CLASSES.textPrimary} ${COLOR_CLASSES.secondaryBgHover}`}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default CommonTable;
