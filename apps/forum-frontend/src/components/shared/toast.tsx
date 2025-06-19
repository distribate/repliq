import { lazy, Suspense } from 'react'
import { Toaster as Initial } from 'sonner'

const InfoIcon = lazy(() => import("@repo/ui/src/components/toast-icons.tsx").then(m => ({ default: m.InfoIcon })))
const WarningIcon = lazy(() => import("@repo/ui/src/components/toast-icons.tsx").then(m => ({ default: m.WarningIcon })))
const ErrorIcon = lazy(() => import("@repo/ui/src/components/toast-icons.tsx").then(m => ({ default: m.ErrorIcon })))
const SuccessIcon = lazy(() => import("@repo/ui/src/components/toast-icons.tsx").then(m => ({ default: m.SuccessIcon })))

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
  return (
    <Suspense>
      <Initial expand={false} position="top-center" icons={TOAST_ICONS} toastOptions={toastOptions} />
    </Suspense>
  )
}