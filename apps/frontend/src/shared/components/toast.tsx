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
    error: "!bg-shark-50 !text-md !gap-2 !font-semibold !text-shark-950 !border-2 !border-shark-200 !rounded-lg",
    success:
      "!bg-shark-50 !text-md !gap-2 !font-semibold !text-shark-950 !border-2 !border-shark-200 !rounded-lg",
    warning:
      "!bg-shark-50 !text-md !gap-2 !font-semibold !text-shark-950 !border-2 !border-shark-200 !rounded-lg",
    info: "!bg-shark-50 !text-md !gap-2 !font-semibold !text-shark-950 !border-2 !border-shark-200 !rounded-lg",
  },
}

export const Toaster = () => {
  return <Initial expand={false} position="top-center" icons={TOAST_ICONS} toastOptions={toastOptions} />
}