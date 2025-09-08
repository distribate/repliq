import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@repo/ui/src/components/dialog"
import { Typography } from "@repo/ui/src/components/typography"
import { Fragment, ReactNode } from "react"
import { reatomComponent } from "@reatom/npm-react"
import { DONATE_ICON } from "#components/user/components/donate/components/donate"
import { DONATE_FEATURES } from "#shared/constants/donate"
import { Button } from "@repo/ui/src/components/button"
import { IconArrowLeft } from "@tabler/icons-react"
import clsx from "clsx"
import {
  back,
  buyDonateModalIsOpenAtom,
  donateProcessingPaymentIsValidAtom,
  donateProcessingStepAtom,
  donateWidgetTypeAtom,
  methodPaymentAtom,
  METHODS,
  nextStep,
  openProcessingAction,
  startPaymentAction,
  STEPS_TITLE
} from "./buy-donate.model"

const DonateDialogFeatureItem = ({ description, icon: Icon, title }: typeof DONATE_FEATURES[number]) => {
  return (
    <div className="flex items-start select-none py-2 px-6 justify-start rounded-md  hover:bg-shark-700 gap-4">
      <div className="flex items-center justify-center rounded-lg p-2 bg-shark-400/40">
        <Icon size={40} />
      </div>
      <div className="flex flex-col w-full">
        <Typography textSize="large">{title}</Typography>
        <Typography textSize="medium" textColor="gray">{description}</Typography>
      </div>
    </div>
  )
}

const DonateProcessingBack = reatomComponent(({ ctx }) => {
  return (
    <Button
      className="bg-shark-50 rounded-lg p-2 aspect-square"
      onClick={() => back(ctx)}
    >
      <IconArrowLeft size={16} className="text-shark-950" />
    </Button>
  )
}, "DonateProcessingBack")

const DonateProcessingSteps = reatomComponent(({ ctx }) => {
  const currentStep = ctx.spy(donateProcessingStepAtom);

  const steps = Object.entries(STEPS_TITLE)
    .map(([k, v]) => [Number(k), v] as const)
    .sort(([a], [b]) => a - b);

  return (
    <>
      <div className="flex sm:hidden items-center gap-2 p-2">
        {steps.map(([step], i) => (
          <div
            key={step}
            className={clsx(
              "h-2 flex-1 rounded-full",
              currentStep >= step ? "bg-shark-50" : "bg-shark-700"
            )}
          />
        ))}
      </div>
      <div className="hidden sm:flex font-semibold gap-2 p-2">
        {steps.map(([step, title], i) => (
          <Fragment key={step}>
            <Typography
              data-state={currentStep >= step}
              className="data-[state=true]:text-shark-50 text-nowrap data-[state=false]:text-shark-300"
            >
              {title}
            </Typography>
            {i < steps.length - 1 && (
              <span className="text-shark-300">{`>`}</span>
            )}
          </Fragment>
        ))}
      </div>
    </>
  )
}, "DonateProcessingSteps")

const DonateProcessingPaymentMethod = reatomComponent(({ ctx }) => {
  const selected = ctx.spy(methodPaymentAtom)

  return (
    <div className="flex flex-col gap-4 p-2 w-full">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full">
        {METHODS.map((method) => (
          <div
            key={method.value}
            data-state={selected === method.value}
            className="flex group data-[state=true]:bg-shark-50 data-[state=false]:bg-shark-800 rounded-lg p-2 items-end w-full"
            onClick={() => methodPaymentAtom(ctx, method.value)}
          >
            <Typography className='font-semibold group-data-[state=false]:text-shark-50 group-data-[state=true]:text-shark-950'>
              {method.title}
            </Typography>
          </div>
        ))}
      </div>
      <div className="flex items-center justify-end w-full">
        <Button
          variant="positive"
          className=""
          disabled={!ctx.spy(donateProcessingPaymentIsValidAtom)}
          onClick={() => nextStep(ctx, 3)}
        >
          <Typography className="font-semibold text-lg">
            Продолжить
          </Typography>
        </Button>
      </div>
    </div>
  )
}, "DonateProcessingPaymentMethod")

const DonateProcessingPayment = reatomComponent(({ ctx }) => {
  return (
    <div className="flex flex-col gap-4 p-2 w-full">
      <div className="flex items-center justify-between w-full">
        <Typography className="text-shark-300 font-semibold text-base">
          Итого
        </Typography>
        <Typography className="font-semibold text-shark-50 text-xl">
          $10
        </Typography>
      </div>
      <div className="flex items-center justify-end w-full">
        <Button
          variant="positive"
          disabled={ctx.spy(startPaymentAction.statusesAtom).isPending}
          onClick={() => startPaymentAction(ctx)}
        >
          <Typography className="font-semibold text-lg">
            Приобрести
          </Typography>
        </Button>
      </div>
    </div>
  )
}, "DonateProcessingPayment")

const DonateProcessingAbout = reatomComponent(({ ctx }) => {
  return (
    <div className="flex flex-col gap-4 p-2 w-full">
      <div className="flex flex-col items-start w-full">
        <Typography className="text-lg break-words">
          Получите доступ к расширенным функциям и возможностям с Repliq+
        </Typography>
        <Typography
          className="text-base font-semibold text-green-500 cursor-pointer"
          onClick={() => donateWidgetTypeAtom(ctx, "preview")}
        >
          Возможности
        </Typography>
      </div>
      <div className="flex items-center justify-end w-full">
        <Button
          variant="positive"
          className=""
          onClick={() => nextStep(ctx, 2)}
        >
          <Typography className="font-semibold text-lg">
            Продолжить
          </Typography>
        </Button>
      </div>
    </div>
  )
}, "DonateProcessingAbout")

const PROCESSING_STEPS: Record<number, ReactNode> = {
  1: <DonateProcessingAbout />,
  2: <DonateProcessingPaymentMethod />,
  3: <DonateProcessingPayment />
}

const DonateProcessing = reatomComponent(({ ctx }) => {
  return (
    <div className="flex flex-col gap-4 w-full h-full">
      <div className="relative w-full h-40 rounded-lg overflow-hidden">
        <img src="/preview.jpg" alt="" className="object-cover w-full h-full" />
        <div className="absolute top-0 left-0 flex items-center justify-center z-10 p-2">
          <DonateProcessingBack />
        </div>
        <div className="absolute bottom-0 left-0 flex items-center justify-center z-10 p-2">
          <Typography className="text-2xl sm:text-3xl font-semibold">Repliq+</Typography>
        </div>
      </div>
      <DonateProcessingSteps />
      {PROCESSING_STEPS[ctx.spy(donateProcessingStepAtom)]}
    </div>
  )
}, "DonateProcessing")

const DonatePreview = reatomComponent(({ ctx }) => {
  return (
    <div className="flex flex-col relative items-center w-full h-full">
      <div className="flex flex-col relative px-4 py-6 items-center gap-4 w-full">
        <div className="green-gradient opacity-30 w-full h-full z-[1] absolute left-0 right-0 top-0" />
        <span className="text-6xl select-none">{DONATE_ICON}</span>
        <div className="flex flex-col">
          <span className="text-xl text-center font-semibold">Repliq+</span>
          <Typography className="text-lg text-center break-words">
            Получите доступ к расширенным функциям и возможностям с Repliq+
          </Typography>
        </div>
      </div>
      <div className="flex flex-col relative pt-4 bg-black/40 rounded-t-lg gap-y-2 w-full">
        {DONATE_FEATURES.map((feature, idx) => (
          <DonateDialogFeatureItem key={idx} {...feature} />
        ))}
      </div>
      <div className="bg-[#191919] sticky -bottom-2 py-4 px-6 flex items-center justify-center w-full">
        <Button
          className="flex items-center justify-center w-full py-2 bg-green-600 px-6 rounded-lg"
          onClick={() => openProcessingAction(ctx)}
        >
          <Typography className="text-xl font-semibold">
            Приобрести
          </Typography>
        </Button>
      </div>
    </div>
  )
}, "DonatePreview")

const DonateDialog = reatomComponent(({ ctx }) => {
  return ctx.spy(donateWidgetTypeAtom) === 'preview' ? <DonatePreview /> : <DonateProcessing />
}, "DonateDialog")

export const BuyDonateModal = reatomComponent<{ trigger?: ReactNode }>(({ ctx, trigger }) => {
  return (
    <Dialog
      open={ctx.spy(buyDonateModalIsOpenAtom)}
      onOpenChange={v => buyDonateModalIsOpenAtom(ctx, v)}
    >
      {trigger && <DialogTrigger>{trigger}</DialogTrigger>}
      <DialogContent className="p-0 sm:max-w-xl sm:!min-w-xl">
        <DialogTitle className="hidden">Repliq+</DialogTitle>
        <DonateDialog />
      </DialogContent>
    </Dialog>
  )
}, "BuyDonateModal")