import { useEffect } from "react"
import { userSettingsQuery, UserSettingsQuery } from "../queries/user-settings-query"
import { ArrowLeft } from "lucide-react"
import { useUserSettingsModal } from "#components/modals/user-settings/hooks/use-user-settings-modal"

type ProfileSettingsBackProps = {
  to: UserSettingsQuery["current"]
}

export const UserSettingsBack = ({
  to
}: ProfileSettingsBackProps) => {
  const { global } = userSettingsQuery().data
  const { updateDialogSectionMutation } = useUserSettingsModal()

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        updateDialogSectionMutation.mutate({ to })
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
      onClick={() => updateDialogSectionMutation.mutate({ to })}
      className="absolute left-2 top-2 cursor-pointer rounded-lg hover:bg-shark-800 p-2"
    >
      <ArrowLeft size={24} className='text-shark-300' />
    </div>
  )
}