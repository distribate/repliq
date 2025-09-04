import { action, atom, batch, Ctx } from "@reatom/core";
import { reatomAsync, withReset, withStatusesAtom } from "@reatom/framework";
import { toast } from "sonner";

export const METHODS = [
  { title: "Криптовалюты", value: "crypto" },
  { title: "СБП", value: "fiat" }
] as const;

export const STEPS_TITLE: Record<number, string> = {
  1: "Начало",
  2: "Выбор метода оплаты",
  3: "Оформление"
}

export const buyDonateModalIsOpenAtom = atom(false, "buyDonateModalIsOpen").pipe(withReset())
export const methodPaymentAtom = atom<"crypto" | "fiat" | null>(null, "methodPayment").pipe(withReset())
export const donateWidgetTypeAtom = atom<"preview" | "process">("preview", "donateWidgetType").pipe(withReset())
export const donateProcessingStepAtom = atom(1, "donateProcessingStep").pipe(withReset())

export const donateProcessingPaymentIsValidAtom = atom((ctx) => {
  const cumm = ctx.spy(methodPaymentAtom)
  return cumm;
})

export const nextStep = action((ctx, target: number) => {
  if (target === 3) {
    const condition = ctx.get(donateProcessingPaymentIsValidAtom)

    if (!condition) return;

    return donateProcessingStepAtom(ctx, 3)
  }

  donateProcessingStepAtom(ctx, target)
}, "nextStep")

buyDonateModalIsOpenAtom.onChange((ctx, state) => {
  if (!state) {
    donateWidgetTypeAtom.reset(ctx)
  }
})

export const back = action((ctx) => {
  const step = ctx.get(donateProcessingStepAtom)

  if (step === 1) {
    return donateWidgetTypeAtom(ctx, "preview")
  }

  donateProcessingStepAtom(ctx, (state) => state - 1)
}, "back")

export const startPaymentAction = reatomAsync(async (ctx) => {
  return await ctx.schedule(() => { })
}, {
  name: "startPaymentAction",
  onFulfill: (ctx, res) => {
    toast.info("In build")
    // 
    buyDonateModalIsOpenAtom(ctx, false)
    resetAll(ctx)
  }
}).pipe(withStatusesAtom())

function resetAll(ctx: Ctx) {
  batch(ctx, () => {
    methodPaymentAtom.reset(ctx)
    donateWidgetTypeAtom.reset(ctx)
    donateProcessingStepAtom.reset(ctx)
  })
}