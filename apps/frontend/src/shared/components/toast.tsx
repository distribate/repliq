import { Toaster as Initial } from 'sonner'
import { cva } from 'class-variance-authority'

const TOAST_ICONS = {
  info: null,
  success: null,
  warning: null,
  error: null
}

const toastBase = cva(`
  flex !items-start !bg-shark-50 !text-base !gap-2 !font-semibold !text-shark-950 !rounded-lg
`)

const toastOptions = {
  classNames: {
    error: toastBase(),
    success: toastBase(),
    warning: toastBase(),
    info: toastBase(),
  },
}

export const Toaster = () => {
  return (
    <Initial
      expand={false}
      position="top-center"
      icons={TOAST_ICONS}
      toastOptions={toastOptions}
    />
  )
}