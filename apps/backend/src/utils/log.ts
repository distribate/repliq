export function log(
  message: string,
  ...args: unknown[]
) {
  process.env.NODE_ENV === 'development' && console.log(message, args)
}