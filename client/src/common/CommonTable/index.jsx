import React, { useState, useMemo, useEffect } from 'react';
import LoadingIndicator from '../LoadingIndicator';
import SearchInput from '../../components/ui/SearchInput';
import Button from '../../components/ui/Button';
import { Plus, ChevronDown, ChevronUp } from 'lucide-react';
import { useColorClasses } from '../../theme/useColorClasses';
import { FONT_FAMILIES } from '../../constants/theme';
import { useFilters } from '../../context/FilterContext';
import { Chip } from '../../components/ui/Chip';
import { formatCurrency } from '../../components/ui/CurrencyFormatter';
import { RiskChip } from '../../components/ui/RiskChip';
import RiskScoreBadge from '../RiskScoreBadge';

const CommonTable = ({
  columns,
  data = [],
  loading = false,
  searchable = true,
  title = '',
  onClick = () => { },
  isCreate = true,
  totalItems = 0,
  onFetch = null,
  isDownloadCSV=false
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const { filters, setFilters } = useFilters();
  const COLOR_CLASSES = useColorClasses();
  const totalPages = Math.ceil(totalItems / filters.limit || 1);

  useEffect(() => {
    if (onFetch) {
      onFetch(filters);
    }
  }, [filters]);
  const handleSearch = (value) => {
    setSearchTerm(value);
    setFilters((prev) => ({
      ...prev,
      current_page: 1,
      search: value,
    }));
  };

  const handleSort = (key) => {
    setFilters((prev) => {
      const isSameKey = prev.sort_by === key;
      const newOrder = isSameKey && prev.order_by === 'asc' ? 'desc' : 'asc';

      return {
        ...prev,
        sort_by: key,
        order_by: newOrder,
        current_page: 1,
      };
    });
  };

  const handlePageChange = (newPage) => {
    setFilters((prev) => ({
      ...prev,
      current_page: newPage,
    }));
  };

  const downloadCSV = (columns, data, filename = "data.csv") => {
    const exportableColumns = columns.filter(col => col.key !== "actions");

    const headers = exportableColumns.map((col) => col.label).join(",");

    const rows = data.map((row) =>
      exportableColumns.map((col) => {
        const value = col.render ? col.render(row) : row[col.key];
        return `"${typeof value === "string" ? value.replace(/"/g, '""') : value}"`;
      }).join(",")
    );

    const csvContent = [headers, ...rows].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");

    link.href = URL.createObjectURL(blob);
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className={`w-full font-sans ${COLOR_CLASSES.bgWhite}  ${FONT_FAMILIES.primary} overflow-x-auto`}>
      {/* Title & Button */}
      {(isCreate || title !== "") && (
        <div className="flex justify-between items-start md:items-center mb-4 md:mb-6 gap-2">
          {title !== "" && (
            <h2 className={`text-lg font-semibold ${COLOR_CLASSES.primary}`}>{title}</h2>
          )}
          {isCreate && (
            <Button className="w-24 px-4 py-[11px] text-sm" onClick={onClick} icon={<Plus size={18} />}>
              Create
            </Button>
          )}
        </div>
      )}
      {/* Table & Search */}
      <div className={`overflow-x-auto ${COLOR_CLASSES.bgWhite}  border ${COLOR_CLASSES.borderGray200} rounded-lg ${COLOR_CLASSES.shadowMd}`}>
        <LoadingIndicator isLoading={loading} />

        <div className="flex flex-col md:flex-row justify-end items-center gap-2 m-3">
          {searchable && (
            <SearchInput
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
            />
          )}
          {(data.length > 0 && isDownloadCSV) && (
            <Button
              className="text-sm px-4 py-2"
              onClick={() => downloadCSV(columns, data)}
            >
              Download CSV
            </Button>
          )}
        </div>

        <table className="min-w-full divide-y text-sm">
          <thead className={`${COLOR_CLASSES.primaryLightBg} sticky top-0`}>
            <tr>
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={`px-6 py-5 text-left text-xs font-semibold uppercase capitalize tracking-wider cursor-pointer ${COLOR_CLASSES.textSecondary}`}
                  onClick={() => col.sortable && handleSort(col.key)}
                >
                  <div className="flex items-center gap-1">
                    {col.label}
                    {col.sortable && filters.sort_by === col.key && (
                      filters.order_by === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className={`divide-y ${COLOR_CLASSES.borderGray200}`}>
            {data.length > 0 ? (
              data.map((row, rowIndex) => (
                <tr
                  key={rowIndex}
                  className={`${rowIndex % 2 === 0 ? COLOR_CLASSES.bgWhite : COLOR_CLASSES.bgWhite
                    } hover:${COLOR_CLASSES.primaryLightBg} transition-colors`}
                >
                  {columns.map((col) => (
                    <td
                      key={col.key}
                      className={`px-6 py-4 whitespace-nowrap truncate max-w-[200px] border-t ${COLOR_CLASSES.borderGray200} ${COLOR_CLASSES.textPrimary}`}
                    >
                        {['role', 'status', 'condition'].includes(col.key) ? (
                          <Chip status={row[col.key]} />
                        ) : ['risk_score'].includes(col.key) ? (
                          <RiskScoreBadge score={row[col.key]} />
                        ) : col.render ? (
                          col.render(row)
                        ) : ['base_price', 'ebay_avg_price', 'offered_price'].includes(col.key) ? (
                          formatCurrency(row[col.key])
                        ) : typeof row[col.key] === 'string' && /https?:\/\/[^\s]+/.test(row[col.key]) ? (
                          <a className={`${COLOR_CLASSES.primary}`} href={row[col.key]} target="_blank" rel="noopener noreferrer">
                            {row[col.key]}
                          </a>
                        ) : 
                          col.key == 'payment_status'  ? (
                            <Chip status={row.payment.length > 0 ? row.payment[0].status : "pending"} />
                          ):
                        (
                          row[col.key]
                        )}
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

      {totalPages > 1 && (
        <div className="flex justify-center items-center mt-4 text-sm mr-3">
          <button
            onClick={() => handlePageChange(filters.current_page - 1)}
            disabled={filters.current_page === 1}
            className={`px-4 py-2 mr-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${COLOR_CLASSES.secondaryBg} ${COLOR_CLASSES.textPrimary} ${COLOR_CLASSES.secondaryBgHover}`}
          >
            Previous
          </button>
          <span className={`${COLOR_CLASSES.textSecondary} mr-3`}>
            Page {filters.current_page} of {totalPages}
          </span>
          <button
            onClick={() => handlePageChange(filters.current_page + 1)}
            disabled={filters.current_page === totalPages}
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
