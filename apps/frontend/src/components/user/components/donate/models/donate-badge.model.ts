import { buyDonateModalIsOpenAtom } from "#components/modals/custom/components/buy-donate-modal";
import { currentUserAtom } from "#components/user/models/current-user.model";
import { action, atom } from "@reatom/core";
import { withLocalStorage } from "@reatom/persist-web-storage";

export const donateTipShowIsPreventedAtom = atom(false, "donateTipShowIsPrevented").pipe(
  withLocalStorage("donate-prevent")
)

export const donateTipPopoverIsOpenAtom = atom(false, "donateTipPopoverIsOpen")
export const donateTipTypeAtom = atom<"not-buyed" | "buyed">("not-buyed", "donateTipType")

export const validateDonateTipCheckedAction = action((ctx) => {
  const donateTipIsPrevented = ctx.get(donateTipShowIsPreventedAtom)

  if (donateTipIsPrevented) {
    return;
  }

  const isDonate = ctx.get(currentUserAtom)?.is_donate ?? false

  if (isDonate) {
    donateTipTypeAtom(ctx, "buyed")
    donateTipPopoverIsOpenAtom(ctx, true)
  } else {
    buyDonateModalIsOpenAtom(ctx, true)
  }
})

export const preventShowDonateTipAction = action((ctx) => {
  donateTipShowIsPreventedAtom(ctx, true)
  buyDonateModalIsOpenAtom(ctx, false)
})