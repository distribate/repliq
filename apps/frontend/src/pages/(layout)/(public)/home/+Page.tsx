import { reatomComponent } from "@reatom/npm-react"
import { isAuthenticatedAtom } from '#components/auth/models/auth.model';
import { LatestCommentsSkeleton } from '#components/templates/components/main-page-skeleton';
import { MainCategories } from "#components/categories/components/main/components/main-categories-list";
import { Button } from "@repo/ui/src/components/button";
import { Typography } from "@repo/ui/src/components/typography";
import { CustomLink } from "#shared/components/link";
import { OnlineUsers } from "#components/layout/components/widgets/online-users/online-users";
import { IconPhoneCall, IconPlus } from "@tabler/icons-react";
import { clientOnly } from "vike-react/clientOnly";
import { globalPreferencesAtom } from "#components/user/components/settings/main/models/update-global-preferences.model";

const Comments = clientOnly(() => import('#components/layout/components/widgets/latest-comments/latest-comments').then((m) => m.LatestComments))
const AlertWidget = clientOnly(() => import('#components/layout/components/widgets/alert/alert-widget').then((m) => m.AlertWidget))

const Alerts = reatomComponent(({ ctx }) => {
  if (!ctx.spy(isAuthenticatedAtom)) return null;

  return (
    ctx.spy(globalPreferencesAtom).alerts === 'show' && (
      <div className="flex flex-col gap-2 w-full">
        <AlertWidget />
      </div>
    )
  )
}, "Alerts")

const LatestComments = reatomComponent(({ ctx }) => {
  if (!ctx.spy(isAuthenticatedAtom)) return null;

  return <Comments fallback={<LatestCommentsSkeleton />} />
}, "LatestComments")

const About = () => {
  return (
    <div className="flex flex-col gap-4 w-full p-2 sm:p-4 rounded-lg overflow-hidden bg-primary-color">
      <Typography textSize="big" textColor="shark_white" className="font-semibold">
        Прочее
      </Typography>
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <CustomLink to="/misc/contacts" className="flex items-center p-2 rounded-lg gap-2 bg-shark-900">
            <IconPhoneCall size={20} />
            <Typography>
              Контакты
            </Typography>
          </CustomLink>
        </div>
        <a href="https://github.com/distribate" target="_blank" rel="noreferrer">
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

export default function HomePage() {
  return (
    <main className="flex flex-col w-full gap-2 h-full">
      <Alerts />
      <div className="flex xl:flex-row gap-2 flex-col w-full h-full">
        <div className="hidden xl:flex flex-col gap-4 w-full xl:w-1/4 h-full">
          <div className="flex flex-col gap-4 p-2 sm:p-4 w-full h-full rounded-lg overflow-hidden bg-primary-color">
            <CreateThreadButton />
            <LatestComments />
          </div>
          <OnlineUsers />
          <About />
        </div>
        <div className="flex flex-col w-full xl:w-3/4 gap-2 h-full">
          <div className="xl:hidden block">
            <CreateThreadButton />
          </div>
          <MainCategories />
          <div className="xl:hidden flex flex-col gap-2 w-full xl:w-1/4 h-full">
            <div className="flex flex-col gap-4 p-2 sm:p-4 w-full h-full rounded-lg overflow-hidden bg-primary-color">
              <LatestComments />
            </div>
            <OnlineUsers />
            <About />
          </div>
        </div>
      </div>
    </main>
  )
}