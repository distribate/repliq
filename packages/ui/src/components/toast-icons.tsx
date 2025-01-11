import Image from "next/image";
import WhiteCandle from "@repo/assets/images/minecraft/white_candle.webp"
import RedCandle from "@repo/assets/images/minecraft/red_candle.webp"
import LimeCandle from "@repo/assets/images/minecraft/lime_candle.webp"
import YellowCandle from "@repo/assets/images/minecraft/yellow_candle.webp"

export const InfoIcon = () => {
  return <Image src={WhiteCandle.src} width={24} height={24} alt="" />
}

export const WarningIcon = () => {
  return <Image src={YellowCandle.src} width={24} height={24} alt="" />
}

export const ErrorIcon = () => {
  return <Image src={RedCandle.src} width={24} height={24} alt="" />
}

export const SuccessIcon = () => {
  return <Image src={LimeCandle.src} width={24} height={24} alt="" />
}