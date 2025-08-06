import { Toaster as Initial } from 'sonner'
import { ErrorIcon, InfoIcon, SuccessIcon, WarningIcon } from "@repo/ui/src/components/toast-icons.tsx"

const TOAST_ICONS = {
  info: <InfoIcon />,
  success: <SuccessIcon />,
  warning: <WarningIcon />,
  error: <ErrorIcon />,
}

const toastOptions = {
  classNames: {
    error: "bg-black/80 !text-base !gap-4 !font-semibold text-shark-50 border-2 border-shark-700 rounded-lg",
    success:
      "bg-black/80 !text-base !gap-4 !font-semibold text-shark-50 border-2 border-shark-700 rounded-lg",
    warning:
      "bg-black/80 !text-base !gap-4 !font-semibold text-shark-50 border-2 border-shark-700 rounded-lg",
    info: "bg-black/80 !text-base !gap-4 !font-semibold text-shark-50 border-2 border-shark-700 rounded-lg",
  },
}

export const Toaster = () => {
  return <Initial expand={false} position="top-center" icons={TOAST_ICONS} toastOptions={toastOptions} />
}