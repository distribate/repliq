import { Input } from "@repo/ui/src/components/input"
import { Search } from "lucide-react"

export const CategoryThreadsSearch = () => {
  return (
    <div
      className="flex items-center gap-4 h-12 px-4 w-full lg:w-3/4 rounded-lg duration-300 
        ease-in-out transtion-all bg-shark-950 outline-none 
        focus-within:outline focus-within:outline-2 focus-within:outline-biloba-flower-500"
    >
      <Search size={24} className="text-shark-300" />
      <Input
        placeholder="Название треда"
        backgroundType="transparent"
        className="text-xl !p-0"
      />
    </div>
  )
}