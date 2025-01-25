"use client"

import { Dialog, DialogContent } from "@repo/landing-ui/src/dialog";
import { ReactNode, useEffect, useState } from "react";
import { PaymentSuccess, PaymentSuccessProps } from "#templates/payment-success.tsx";

type ParamType = "payment"

const COMPONENTS: Record<ParamType, (props: any) => ReactNode> = {
  payment: ({ id, nickname }: PaymentSuccessProps) => <PaymentSuccess id={id!} nickname={nickname!} />
}

export const ParamProvider = () => {
  const [currentType, setCurrentType] = useState<"payment" | null>(null)
  const [o, setO] = useState<boolean>(false);
  const params = new URLSearchParams(window.location.search);
  const type = params.get("type") as "payment";
  const id = params.get("id");
  const nickname = params.get("nickname");

  useEffect(() => {
    if (type && id && nickname) {
      setO(true);
      setCurrentType(type);
    }
  }, [])

  const handleClose = (o: boolean) => {
    if (!o) {
      const newParams = new URLSearchParams(window.location.search);
      newParams.delete("type");
      newParams.delete("id");
      newParams.delete("nickname");
      window.history.replaceState(null, "", `?${newParams.toString()}`);
    }

    setO(false)
  }

  if (!currentType || !id) return null;

  return (
    <Dialog open={o} onOpenChange={handleClose}>
      <DialogContent className="!max-w-2xl !p-0 !overflow-visible">
        {COMPONENTS[currentType]({ id, nickname })}
      </DialogContent>
    </Dialog>
  )
};