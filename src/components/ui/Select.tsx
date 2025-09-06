import { classNames } from "../../utils"

interface SelectProps {
  value: string
  onChange: (value: string) => void
  items: Array<{value: string | number, label: string}>
  className?: string
}

export const Select: React.FC<SelectProps> = ({
  value,
  onChange,
  items,
  className
}) => {
  return (
    <select
            value={value}
            onChange={e => { onChange(e.target.value) }}
            className={classNames(
              'rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm outline-none focus:ring-2 focus:ring-indigo-200',
              className
            )}
            aria-label='Rows per page'
          >
            {items.map((n, index: number) => (
              <option key={`${n}-${index}`} value={n.value}>{n.label} / page</option>
            ))}
          </select>
  )
}