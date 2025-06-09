import { IconInfoSquareFilled, IconAlertSquareRoundedFilled, IconSquareCheckFilled } from "@tabler/icons-react"

export const InfoIcon = () => {
  return <IconInfoSquareFilled size={24} />
}

export const WarningIcon = () => {
  return <IconAlertSquareRoundedFilled size={24} className="text-yellow-500" />
}

export const ErrorIcon = () => {
  return <IconAlertSquareRoundedFilled size={24} className='text-red-500' />
}

export const SuccessIcon = () => {
  return <IconSquareCheckFilled size={24} className="text-green-500" />
}