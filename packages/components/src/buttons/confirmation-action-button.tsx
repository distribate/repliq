import { Button, ButtonProps } from '@repo/ui/src/components/button.tsx';
import { Typography } from '@repo/ui/src/components/typography.tsx';

interface ConfirmationButtonProps extends ButtonProps {
  title: string,
  actionType: "cancel" | "continue"
}

export const ConfirmationButton = ({
  title, actionType, ...props
}: ConfirmationButtonProps) => {
  return (
    <Button className="bg-shark-50" {...props}>
      <Typography className={`text-base ${actionType === 'continue' ? 'text-shark-950' : 'text-red-600'} font-medium`}>
        {title}
      </Typography>
    </Button>
  )
}