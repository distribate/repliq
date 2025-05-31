import { atom } from "@reatom/core";
import { reatomComponent } from "@reatom/npm-react";
import { Separator } from "@repo/ui/src/components/separator";
import { ArrowLeft, ArrowRight, RegexIcon } from "lucide-react";
import { isExperimentalDesignAtom } from "../default/experimental-layout.model";

const devPanelIsOpenAtom = atom(false, "devPanelIsOpen")

export const DevPanel = reatomComponent(({ ctx }) => {
  return (
    <div
      data-state={ctx.spy(devPanelIsOpenAtom)}
      className="flex items-center group gap-5 justify-center bg-black/40 rounded-l-lg p-2 
        data-[state=true]:translate-x-4 data-[state=false]:translate-x-20 duration-300 fixed z-[200] bottom-24 right-4"
    >
      {!ctx.spy(devPanelIsOpenAtom) ?
        <ArrowLeft size={24} className="cursor-pointer" onClick={() => devPanelIsOpenAtom(ctx, true)} /> :
        <ArrowRight size={24} className="cursor-pointer" onClick={() => devPanelIsOpenAtom(ctx, false)} />
      }
      <Separator orientation="vertical" />
      <RegexIcon
        size={24}
        className="text-shark-100 cursor-pointer"
        onClick={() => isExperimentalDesignAtom(ctx, (state) => !state)}
      />
    </div>
  )
})