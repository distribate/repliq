import { cva } from "class-variance-authority";

export const friendCardVariant = cva(`
  flex items-center group justify-between
  overflow-hidden gap-3 border-2 md:gap-4 p-2 rounded-lg relative w-full bg-shark-950
`, {
  variants: {
    variant: {
      default: "border-transparent",
      pinned: "border-gold-500/40"
    }
  }
})