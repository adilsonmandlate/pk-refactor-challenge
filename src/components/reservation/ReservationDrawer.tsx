import React, { useEffect, useRef, useState } from 'react'
import { getReservation, saveReservation } from '../../api/fakeApi'
import { ReservationData } from '../../types/reservation'
import { classNames, formatCurrency } from '../../utils'
import { Input } from '../ui/Input'

const ReservationDrawer: React.FC<{
  open: boolean
  id: string | null
  onClose: () => void
}> = ({ open, id, onClose }) => {
  const [data, setData] = useState<ReservationData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [guestName, setGuestName] = useState('')
  const [siteName, setSiteName] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [checkinTime, setCheckinTime] = useState('15:00')
  const [checkoutTime, setCheckoutTime] = useState('11:00')
  const [nights, setNights] = useState(1)
  const [fees, setFees] = useState(0)
  const [formError, setFormError] = useState<string | null>(null)
  const panelRef = useRef<HTMLDivElement | null>(null)

  const total = data ? (data.basePrice || 0) * (nights || 0) + (fees || 0) : 0

  useEffect(() => {
    if (!open || !id) return
    setLoading(true)
    setError(null)
    getReservation(id)
      .then((r: ReservationData) => {
        setData(r)
        setGuestName(r.guestName)
        setNights(r?.nights)
        setFees(r?.fees)
        setLoading(false)
      })
  }, [open, id])

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    if (!data) return
    setFormError(null)
    setLoading(true)
    const payload: ReservationData = {
      ...data,
      guestName,
      siteName,
      startDate,
      endDate,
      checkinTime,
      checkoutTime,
      nights,
      fees,
      total
    }
    saveReservation(payload)
      .then(() => {
        alert('saved')
        onClose()
      })
      .catch((err: any) => setFormError(err?.message || 'failed to save'))
      .finally(() => setLoading(false))
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="reservation-title"
      aria-hidden={!open}
      className={classNames(
        'fixed inset-0 z-40 transition',
        open ? 'pointer-events-auto' : 'pointer-events-none'
      )}
    >
      <div
        className={classNames(
          'absolute inset-0 bg-black/30 transition-opacity',
          open ? 'opacity-100' : 'opacity-0'
        )}
        onClick={onClose}
      />
      <div
        ref={panelRef}
        className={classNames(
          'absolute right-0 top-0 h-full w-full sm:w-[480px] bg-white shadow-2xl outline-none transition-transform',
          open ? 'translate-x-0' : 'translate-x-full'
        )}
      >
        <div className='flex items-center justify-between border-b px-4 py-3'>
          <div>
            <h2 className='text-lg font-semibold'>Edit reservation</h2>
            <p className='text-xs text-gray-500'>ID: {data?.id}</p>
          </div>
          <button onClick={onClose} className='rounded-md border px-2 py-1 text-sm hover:bg-gray-50'>Close</button>
        </div>

        <div className='p-4 space-y-4'>
          {error && (
            <div role='alert' className='rounded-md border border-red-200 bg-red-50 p-3 text-red-700'>
              {error}
            </div>
          )}

          {formError && (
            <div
              role='alert'
              aria-live='assertive'
              className='rounded-md border border-red-200 bg-red-50 p-3 text-red-700'
            >
              {formError}
            </div>
          )}

          {loading && (
            <div className='text-sm text-gray-500'>Loading…</div>
          )}

          {!!data && (
            <form onSubmit={handleSave} className='space-y-4'>
              <div className='grid grid-cols-1 gap-4'>
                <div>
                  <label htmlFor='guestName' className='mb-1 block text-sm font-medium text-gray-800'>Guest name</label>
                  <Input
                    name='guestName'
                    onChange={setGuestName}
                    value={guestName}
                  />
                </div>

                <div>
                  <label htmlFor='siteName' className='mb-1 block text-sm font-medium text-gray-800'>Site name</label>
                  <Input
                    name='siteName'
                    onChange={setSiteName}
                    value={siteName}
                  />
                </div>

                <div className='grid grid-cols-2 gap-4'>
                  <div>
                    <label htmlFor='startDate' className='mb-1 block text-sm font-medium text-gray-800'>Start date</label>
                    <Input
                      type='date'
                      name='startDate'
                      onChange={setStartDate}
                      value={startDate}
                    />
                  </div>
                  <div>
                    <label htmlFor='endDate' className='mb-1 block text-sm font-medium text-gray-800'>End date</label>
                    <Input
                      type='date'
                      name='endDate'
                      onChange={setEndDate}
                      value={endDate}
                    />
                  </div>
                </div>

                <div className='grid grid-cols-2 gap-4'>
                  <div>
                    <label htmlFor='checkinTime' className='mb-1 block text-sm font-medium text-gray-800'>Check-in time</label>
                    <Input
                      type='time'
                      name='checkinTime'
                      onChange={setCheckinTime}
                      value={checkinTime}
                    />
                  </div>
                  <div>
                    <label htmlFor='checkoutTime' className='mb-1 block text-sm font-medium text-gray-800'>Check-out time</label>
                    <Input
                      type='time'
                      name='checkoutTime'
                      onChange={setCheckoutTime}
                      value={checkoutTime}
                    />
                  </div>
                </div>

                <div className='grid grid-cols-3 gap-4'>
                  <div>
                    <label htmlFor='nights' className='mb-1 block text-sm font-medium text-gray-800'>Nights</label>
                    <Input
                      type='number'
                      name='nights'
                      onChange={(value) => setNights(Number(value))}
                      value={String(nights)}
                    />
                  </div>

                  <div>
                    <label htmlFor='fees' className='mb-1 block text-sm font-medium text-gray-800'>Fees</label>
                    <Input
                      type='number'
                      name='fees'
                      onChange={(value) => setFees(Number(value))}
                      value={String(fees)}
                    />
                  </div>

                  <div>
                    <label className='mb-1 block text-sm font-medium text-gray-800'>Price/night</label>
                    <div className='rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-gray-800'>
                      {formatCurrency(data.basePrice ?? 0)}
                    </div>
                  </div>
                </div>
              </div>

              <div className='mt-2 flex items-center justify-between rounded-xl border border-gray-200 bg-white p-3 shadow-sm'>
                <div className='text-base'>Total: <span className='font-semibold'>{formatCurrency(total)}</span></div>
                <button
                  type='submit'
                  disabled={loading}
                  className='inline-flex items-center rounded-lg border border-gray-300 bg-gray-900 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-black disabled:opacity-50'
                >
                  Save
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}

export default ReservationDrawer
