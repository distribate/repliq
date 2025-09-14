import { cva } from "class-variance-authority";

export const friendCardVariant = cva(`
  flex items-center group justify-between bg-shark-900/40
  overflow-hidden gap-3 border-2 md:gap-4 p-2 rounded-lg relative w-full
`, {
  variants: {
    variant: {
      default: "border-transparent",
      pinned: "border-blue-500/40"
    }
  }
})