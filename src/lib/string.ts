/**
 * Formats a number of bytes into a human-readable string.
 * For example, 1024 bytes will be formatted as "1 KB".
 * @param bytes number
 * @param decimals number
 * @returns string
 * @example
 * formatBytes(1024) // "1 KB"
 * formatBytes(1234) // "1.21 KB"
 * formatBytes(1234, 3) // "1.205 KB"
 * formatBytes(1234, 0) // "1 KB"
 */
export const formatBytes = (bytes: number, decimals = 2): string => {
  if (isNaN(bytes)) return '0 B'

  const k = 1024
  const dm = decimals < 0 ? 0 : decimals
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
  // Determine which size to use
  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`
}
