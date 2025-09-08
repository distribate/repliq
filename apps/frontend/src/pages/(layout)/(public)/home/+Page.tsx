import { reatomComponent } from "@reatom/npm-react"
import { isAuthenticatedAtom } from '#components/auth/models/auth.model';
import { LatestThreadsByCategories } from "#components/category/latest-threads/components/latest-threads";
import { Button } from "@repo/ui/src/components/button";
import { Typography } from "@repo/ui/src/components/typography";
import { CustomLink } from "#shared/components/link";
import { OnlineUsers } from "#components/widgets/online-users/components/online-users";
import { IconBrandThreads, IconPhoneCall, IconPlus } from "@tabler/icons-react";
import { globalPreferencesAtom } from "#components/user/components/settings/main/models/update-global-preferences.model";
import { LatestComments } from "#components/widgets/latest-comments/components/latest-comments";
import { Alert } from "#components/widgets/alert/components/alert-widget";
import { SOFTWARE_OWNER_LINK } from "#shared/constants/links";

const Alerts = reatomComponent(({ ctx }) => {
  const { alerts: alertsShowing } = ctx.spy(globalPreferencesAtom)

  if (alertsShowing === 'hide') return null;

  return (
    <div className="flex flex-col gap-2 w-full">
      <Alert />
    </div>
  )
}, "Alerts")

const About = () => {
  return (
    <div className="flex flex-col gap-4 w-full p-2 sm:p-4 rounded-lg overflow-hidden bg-primary-color">
      <Typography textSize="big" textColor="shark_white" className="font-semibold">
        Прочее
      </Typography>
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <CustomLink to="/misc/about" className="flex items-center p-2 rounded-lg gap-2 bg-shark-900">
            <IconBrandThreads size={20} />
            <Typography>
              О нас
            </Typography>
          </CustomLink>
          <CustomLink to="/misc/contacts" className="flex items-center p-2 rounded-lg gap-2 bg-shark-900">
            <IconPhoneCall size={20} />
            <Typography>
              Контакты
            </Typography>
          </CustomLink>
        </div>
        <a href={SOFTWARE_OWNER_LINK} target="_blank" rel="noreferrer">
          Forum software by distribate
        </a>
      </div>
    </div>
  )
}

const CreateThreadButton = () => {
  return (
    <CustomLink to="/create-thread" className="w-full">
      <Button className="border-2 group *:ease-out *:duration-150 duration-150 ease-out border-shark-300 hover:bg-shark-50 w-full">
        <Typography className="text-lg font-semibold text-shark-50 group-hover:text-shark-950">
          Создать тред
        </Typography>
        <IconPlus size={20} className="text-shark-200 group-hover:text-shark-950" />
      </Button>
    </CustomLink>
  )
}

const Home = reatomComponent(({ ctx }) => {
  const isAuthenticated = ctx.spy(isAuthenticatedAtom)

  return (
    <main className="flex flex-col w-full gap-2 h-full">
      {isAuthenticated && <Alerts />}
      <div className="flex xl:flex-row gap-2 flex-col w-full h-full">
        <div className="hidden xl:flex flex-col gap-2 w-full xl:w-1/4 h-full">
          <div className="flex flex-col gap-4 p-2 sm:p-4 w-full h-full rounded-lg overflow-hidden bg-primary-color">
            <CreateThreadButton />
            {isAuthenticated && <LatestComments />}
          </div>
          <OnlineUsers />
          <About />
        </div>
        <div className="flex flex-col w-full xl:w-3/4 gap-2 h-full">
          <div className="xl:hidden block">
            <CreateThreadButton />
          </div>
          <LatestThreadsByCategories />
          <div className="xl:hidden flex flex-col gap-2 w-full xl:w-1/4 h-full">
            <div className="flex flex-col gap-4 p-2 sm:p-4 w-full h-full rounded-lg overflow-hidden bg-primary-color">
              {isAuthenticated &&<LatestComments />}
            </div>
            <OnlineUsers />
            <About />
          </div>
        </div>
      </div>
    </main>
  )
})

export default function Page() {
  return <Home />
}