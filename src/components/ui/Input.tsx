import React from 'react'
import { classNames } from '../../utils'

interface InputProps {
  value: string
  name: string
  type?: string
  onChange: (value: string) => void
  className?: string
}

export const Input: React.FC<InputProps> = ({
  value,
  name,
  type = 'text',
  onChange,
  className
}) => {
  return (
    <input
      name={name}
      value={value}
      type={type}
      onChange={e => onChange(e.target.value)}
      className={classNames(
        'w-full rounded-lg border border-gray-300 bg-white px-3 py-2 shadow-sm outline-none focus:ring-2 focus:ring-indigo-200',
        className
      )}
    />
  )
}
