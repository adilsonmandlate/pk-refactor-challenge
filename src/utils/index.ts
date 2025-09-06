export const formatCurrency = (n: number) => new Intl.NumberFormat(undefined, { style: 'currency', currency: 'USD' }).format(n)
export const classNames = (...xs: Array<string | false | null | undefined>) => xs.filter(Boolean).join(' ')
export const formatDate = (iso?: string) => iso ? new Date(iso).toLocaleDateString() : ''
