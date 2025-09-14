import { requestedUserProfilesAtom } from "#components/profile/models/requested-user.model";
import { reatomComponent } from "@reatom/npm-react";
import { clientOnly } from "vike-react/clientOnly";

const Minecraft = clientOnly(() => import("#components/profile/components/integrations/minecraft/components/minecraft").then(m => m.Minecraft));

const INTEGRATIONS: Record<string, (id: string) => React.ReactNode> = {
  "minecraft": (id: string) => <Minecraft nickname={id} />
}

export const UserProfileIntegrations = reatomComponent(({ ctx }) => {
  const values = ctx.spy(requestedUserProfilesAtom);

  return (
    values.map((item) => (
      <div
        key={item.type}
        className="flex items-center justify-center w-full h-full rounded-lg bg-primary-color p-1 sm:p-2"
      >
        {INTEGRATIONS[item.type](item.value)}
      </div>
    ))
  )
}, "UserProfileIntegrations")