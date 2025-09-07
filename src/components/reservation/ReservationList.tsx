import React, { useState, useEffect, useMemo, memo, useCallback } from 'react'
import { getReservations } from '../../api/fakeApi'
import { ReservationData } from '../../types/reservation'
import { formatCurrency, formatDate } from '../../utils'
import { SearchInput } from '../ui/SearchInput'
import { Select } from '../ui/Select'
import { DataTable, Column } from '../ui/DataTable'
import { Pagination } from '../ui/Pagination'
import { useDebounce } from '../../hooks/useDebounce'

const ReservationList: React.FC<{
  onOpen: (id: string) => void
}> = ({ onOpen }) => {
  const [rows, setRows] = useState<ReservationData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [query, setQuery] = useState('')
  const [page, setPage] = useState(1)
  const [perPage, setPerPage] = useState(25)
  const [total, setTotal] = useState(0)
  const [totalPages, setTotalPages] = useState(1)
  
  const debouncedQuery = useDebounce(query, 500)

  useEffect(() => {
    setLoading(true)
    setError(null)

    getReservations({ page, perPage })
      .then(({ data, page, perPage, total, totalPages }) => {
        setRows(data || [])
        setPage(page)
        setPerPage(perPage)
        setTotal(total)
        setTotalPages(totalPages)
        setLoading(false)
      })
      .catch((e: any) => {
        setError(e?.message || 'Failed to load reservations')
        setLoading(false)
      })
  }, [page, perPage])

  const filtered = useMemo(() => {
    if (!debouncedQuery) return rows
    return rows.filter(r =>
      (r.guestName || '').toLowerCase().includes(debouncedQuery.toLowerCase()) ||
      (r.siteName || '').toLowerCase().includes(debouncedQuery.toLowerCase()) ||
      (r.id || '').toLowerCase().includes(debouncedQuery.toLowerCase())
    )
  }, [rows, debouncedQuery])

  const startIdx = (page - 1) * perPage + 1
  const endIdx = Math.min(page * perPage, total)

  const columns: Column<ReservationData>[] = useMemo(() => [
    {
      key: 'guestName',
      header: 'Guest',
      render: (value, row) => (
        <div>
          <div className="font-medium text-gray-900">{value}</div>
          <div className="text-xs text-gray-500">#{row.id}</div>
        </div>
      ),
      className: 'text-nowrap'
    },
    {
      key: 'siteName',
      header: 'Site'
    },
    {
      key: 'startDate',
      header: 'Start',
      render: (value) => formatDate(value)
    },
    {
      key: 'endDate',
      header: 'End',
      render: (value) => formatDate(value)
    },
    {
      key: 'checkinTime',
      header: 'Check-in'
    },
    {
      key: 'checkoutTime',
      header: 'Check-out'
    },
    {
      key: 'total',
      header: 'Total owed',
      render: (_, row) => {
        const total = (row.basePrice || 0) * (row.nights || 0) + (row.fees || 0)
        return <span className="font-medium">{formatCurrency(total)}</span>
      },
      className: 'text-right'
    }
  ], [])

  const handleRowClick = (row: ReservationData) => {
    onOpen(row.id)
  }

  const handlePageChange = (newPage: number) => {
    setPage(newPage)
  }


  return (
    <div className='w-full max-w-7xl mx-auto p-4'>
      <div className='mb-4 flex items-center justify-between gap-3'>
        <div>
          <h1 className='text-xl font-semibold tracking-tight'>Reservations</h1>
          <p className='text-sm text-gray-500'>Manage stays, guests, and balances</p>
        </div>
        <div className='flex items-center gap-3'>
          <SearchInput
            value={query}
            placeholder='Search name, site, id…'
            onChange={setQuery}
          />
          <Select
            items={[
              {value: 10, label: "10"}, 
              {value: 25, label: "25"}, 
              {value: 50, label: "50"}, 
              {value: 100, label: "100"}
            ]}
            onChange={value => { setPage(1); setPerPage(Number(value)) }}
            value={String(perPage)}
          />
        </div>
      </div>

      {error && (
        <div role='alert' className='mb-3 rounded-md border border-red-200 bg-red-50 p-3 text-red-700'>
          {error}
          <button className='ml-3 underline' onClick={() => setPage(p => p)}>Tentar de novo</button>
        </div>
      )}

      <DataTable
        data={filtered}
        columns={columns}
        loading={loading}
        emptyMessage="No reservations"
        onRowClick={handleRowClick}
      />

      <div className='flex flex-col sm:flex-row items-center justify-between gap-3 px-4 py-3 border-t border-gray-200 bg-white'>
        <div className='text-sm text-gray-600'>
          {total > 0 ? `Showing ${startIdx}–${endIdx} of ${total}` : '—'}
        </div>

        <Pagination
          currentPage={page}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          loading={loading}
        />
      </div>
    </div>
  )
}

export default memo(ReservationList)
