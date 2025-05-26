import { useEffect } from "react"
import { userSettingsAtom, UserSettingsDialog } from "../models/user-settings.model"
import { ArrowLeft } from "lucide-react"
import { updateDialogSectionAction } from "#components/modals/user-settings/models/update-user-settings.model"
import { reatomComponent } from "@reatom/npm-react"

export const UserSettingsBack = reatomComponent<{ to: UserSettingsDialog["current"] }>(({ ctx, to }) => {
  const { global } = ctx.spy(userSettingsAtom)

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        updateDialogSectionAction(ctx, to)
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
      onClick={() => updateDialogSectionAction(ctx, to)}
      className="absolute left-2 top-2 cursor-pointer rounded-lg hover:bg-shark-800 p-2"
    >
      <ArrowLeft size={24} className='text-shark-300' />
    </div>
  )
}, "UserSettingsBack")