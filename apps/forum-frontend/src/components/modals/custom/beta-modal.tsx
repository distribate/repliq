import { Button } from "@repo/ui/src/components/button"
import { Dialog, DialogContent, DialogTrigger } from "@repo/ui/src/components/dialog"
import { Typography } from "@repo/ui/src/components/typography"
import { Link } from "@tanstack/react-router"

type BetaModalProps = {
  open: boolean
  onClose: () => void
}

export const BetaModal = ({
  open,
  onClose
}: BetaModalProps) => {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <div className="flex flex-col gap-y-4 items-center w-full h-full">
          <Typography variant="dialogTitle">
            Форум все еще в бета-версии 💥
          </Typography>
          <div className="flex flex-col gap-y-4 w-full p-4">
            <Typography textSize="large">
              Если вы нашли баг, пожалуйста, сообщите нам,&nbsp;
              <Link to="/create-ticket" className="font-semibold" onClick={() => onClose()}>
                создав тикет
              </Link>
              .
            </Typography>
            <Button variant="positive" onClick={() => onClose()} className="px-6 self-end">
              <Typography textSize="medium">
                Понял
              </Typography>
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}