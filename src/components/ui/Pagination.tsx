import React from 'react'

export interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  loading?: boolean
  className?: string
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  loading = false,
  className = ''
}: PaginationProps) {
  const canGoPrevious = currentPage > 1 && !loading
  const canGoNext = currentPage < totalPages && !loading

  const handleFirstPage = () => {
    if (canGoPrevious) {
      onPageChange(1)
    }
  }

  const handlePreviousPage = () => {
    if (canGoPrevious) {
      onPageChange(currentPage - 1)
    }
  }

  const handleNextPage = () => {
    if (canGoNext) {
      onPageChange(currentPage + 1)
    }
  }

  const handleLastPage = () => {
    if (canGoNext) {
      onPageChange(totalPages)
    }
  }

  if (totalPages <= 1) {
    return null
  }

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <button
        className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
        onClick={handleFirstPage}
        disabled={!canGoPrevious}
        aria-label="Go to first page"
      >
        First
      </button>
      <button
        className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
        onClick={handlePreviousPage}
        disabled={!canGoPrevious}
        aria-label="Go to previous page"
      >
        Prev
      </button>
      <span className="text-sm text-gray-700 px-2">
        Page {currentPage} of {totalPages}
      </span>
      <button
        className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
        onClick={handleNextPage}
        disabled={!canGoNext}
        aria-label="Go to next page"
      >
        Next
      </button>
      <button
        className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
        onClick={handleLastPage}
        disabled={!canGoNext}
        aria-label="Go to last page"
      >
        Last
      </button>
    </div>
  )
}
