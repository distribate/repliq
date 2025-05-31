import { useEffect } from "react"
import { navigateToBackAction, settingsIsGlobalDialogAtom } from "../models/user-settings.model"
import { ArrowLeft } from "lucide-react"
import { reatomComponent } from "@reatom/npm-react"

export const UserSettingsBack = reatomComponent(({ ctx }) => {
  const global = ctx.spy(settingsIsGlobalDialogAtom)

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        navigateToBackAction(ctx)
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  if (!global) return null;

  return (
    <div
      onClick={() => navigateToBackAction(ctx)}
      className="absolute left-2 top-2 cursor-pointer rounded-lg hover:bg-shark-800 p-2"
    >
      <ArrowLeft size={24} className='text-shark-300' />
    </div>
  )
}, "UserSettingsBack")