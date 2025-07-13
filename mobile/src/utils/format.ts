/**
 * Format currency value
 * @param value - The numeric value to format
 * @param currency - The currency symbol (default: '$')
 * @returns Formatted currency string
 */
export const formatCurrency = (value: number | string | null | undefined, currency: string = '$'): string => {
  if (value === null || value === undefined) return `${currency}0`
  
  const numValue = typeof value === 'string' ? parseFloat(value) : value
  
  if (isNaN(numValue)) return `${currency}0`
  
  return `${currency}${numValue.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`
}

/**
 * Format percentage value
 * @param value - The percentage value to format
 * @param decimals - Number of decimal places (default: 2)
 * @returns Formatted percentage string
 */
export const formatPercentage = (value: number | string | null | undefined, decimals: number = 2): string => {
  if (value === null || value === undefined) return '0%'
  
  const numValue = typeof value === 'string' ? parseFloat(value) : value
  
  if (isNaN(numValue)) return '0%'
  
  return `${numValue.toFixed(decimals)}%`
}

/**
 * Format large numbers with K, M, B suffixes
 * @param value - The numeric value to format
 * @param decimals - Number of decimal places (default: 1)
 * @returns Formatted number string with suffix
 */
export const formatCompactNumber = (value: number | string, decimals: number = 1): string => {
  const numValue = typeof value === 'string' ? parseFloat(value) : value
  
  if (isNaN(numValue)) return '0'
  
  if (numValue < 1000) return numValue.toString()
  
  const units = ['K', 'M', 'B', 'T']
  let unitIndex = -1
  let scaledValue = numValue
  
  while (scaledValue >= 1000 && unitIndex < units.length - 1) {
    scaledValue /= 1000
    unitIndex++
  }
  
  return `${scaledValue.toFixed(decimals)}${units[unitIndex]}`
}

/**
 * Format date string to a more readable format
 * @param dateString - The date string to format
 * @returns Formatted date string
 */
export const formatDate = (dateString: string | Date): string => {
  if (!dateString) return 'N/A'
  
  const date = typeof dateString === 'string' ? new Date(dateString) : dateString
  
  if (isNaN(date.getTime())) return 'Invalid Date'
  
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}
