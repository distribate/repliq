import { action, atom } from "@reatom/core";
import { withLocalStorage } from "@reatom/persist-web-storage";

export const donateTipIsCheckedAtom = atom(false, "donateTipIsChecked").pipe(
  withLocalStorage("donate-tip")
)

export const donateTipPopoverIsOpenAtom = atom(false, "donateTipPopoverIsOpen")

export const validateDonateTipCheckedAction = action((ctx) => {
  const donateTipIsChecked = ctx.get(donateTipIsCheckedAtom)

  if (donateTipIsChecked) return;

  donateTipPopoverIsOpenAtom(ctx, true)
})

export const checkDonateTipAction = action((ctx, value: boolean) => {
  if (!value) {
    donateTipIsCheckedAtom(ctx, true)
    donateTipPopoverIsOpenAtom(ctx, false)
  }
})