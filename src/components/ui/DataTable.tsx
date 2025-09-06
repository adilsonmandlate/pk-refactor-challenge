import React from 'react'
import { classNames } from '../../utils'

export interface Column<T> {
  key: keyof T | string
  header: string
  render?: (value: any, row: T, index: number) => React.ReactNode
  className?: string
}

export interface DataTableProps<T> {
  data: T[]
  columns: Column<T>[]
  loading?: boolean
  emptyMessage?: string
  onRowClick?: (row: T, index: number) => void
  className?: string
  rowClassName?: string
}

export function DataTable<T>({
  data,
  columns,
  loading = false,
  emptyMessage = 'No data available',
  onRowClick,
  className,
  rowClassName
}: DataTableProps<T>) {

  return (
    <div className={classNames('overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm', className)}>
      <table className="min-w-full border-collapse">
        <thead className="bg-gray-50 text-left text-sm text-gray-600">
          <tr>
            {columns.map((column, index) => (
              <th
                key={index}
                className={`px-4 py-3 font-medium`}
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {loading && (
            <tr>
              <td colSpan={columns.length} className="px-4 py-6 text-sm text-gray-500 text-center">
                Loading…
              </td>
            </tr>
          )}

          {!loading && data.length === 0 && (
            <tr>
              <td colSpan={columns.length} className="px-4 py-6 text-sm text-gray-500 text-center">
                {emptyMessage}
              </td>
            </tr>
          )}

          {!loading && data.map((row, rowIndex) => (
            <tr
              key={rowIndex}
              className={classNames(
                'hover:bg-gray-50',
                onRowClick && 'cursor-pointer',
                rowClassName
              )}
              onClick={() => onRowClick?.(row, rowIndex)}
            >
              {columns.map((column, colIndex) => {
                const value = (row as any)[column.key]
                
                return (
                  <td
                    key={colIndex}
                    className={classNames('px-4 py-3', column.className)}
                  >
                    {column.render ? column.render(value, row, rowIndex) : value}
                  </td>
                )
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
