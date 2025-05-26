import { Typography } from '@repo/ui/src/components/typography.tsx';
import { CATEGORY_URL } from '@repo/shared/constants/routes';
import Spyglass from "@repo/assets/images/minecraft/spyglass.webp";
import { lazy, Suspense } from 'react';
import { Separator } from '@repo/ui/src/components/separator';
import { Dialog, DialogContent, DialogTrigger } from '@repo/ui/src/components/dialog';
import { ThreadByCategoryItem } from '#components/thread/thread-card-category/thread-by-category-item';
import { ThreadPreview } from '@repo/types/entities/thread-type';
import { ThreadLayout } from '#components/thread/thread-layout/thread-layout';
import { Skeleton } from '@repo/ui/src/components/skeleton';
import { onConnect } from '@reatom/framework';
import { reatomComponent } from '@reatom/npm-react';
import { categoriesResource } from '../models/categories.model';
import { globalOptionsAtom } from "@repo/lib/queries/global-option-query";
import { AuthTemplate } from "#components/templates/components/auth-template";
import { CustomLink } from "#components/shared/link";

const ThreadNotFound = lazy(() => import("#components/templates/components/threads-not-found").then(m => ({ default: m.ThreadNotFound })));

const ThreadItem = ({
  created_at, description, id, properties, title, comments_count, views_count, owner
}: ThreadPreview) => {
  return (
    <ThreadLayout id={id} title={title} owner={owner}>
      <ThreadByCategoryItem
        created_at={created_at}
        description={description}
        id={id}
        properties={properties}
        title={title}
        comments_count={comments_count}
        views_count={views_count}
        owner={owner}
      />
    </ThreadLayout>
  );
};

export const MainCategoriesSkeleton = () => {
  return (
    <div className="flex flex-col gap-y-4 w-full">
      <div className="flex flex-col rounded-lg gap-2 w-full">
        {Array.from({ length: 3 }).map((_, idx) => (
          <div
            key={idx}
            className="flex flex-col gap-y-4 w-full py-8 rounded-lg px-4 bg-primary-color"
          >
            <div className="flex items-center w-fit gap-2">
              <Skeleton className="h-12 w-36" />
            </div>
            <div className="flex flex-col gap-y-2 w-full">
              <Skeleton className="h-10 w-24" />
              <div className="flex flex-col gap-y-2 w-full h-full">
                {Array.from({ length: 3 }).map((_, idx) => 
                  <Skeleton key={idx} className="h-20 w-full" />
                )}
              </div>
            </div>
            <Separator />
            <div className="flex items-center gap-2 w-fit h-full">
              <Skeleton className="h-10 w-16" />
              <Skeleton className="h-10 w-16" />
            </div>
          </div>
        ))}
      </div>
    </div >
  )
}

const CategoriesListSkeleton = () => {
  return Array.from({ length: 5 }).map((_, idx) => 
    <Skeleton key={idx} className="h-[200px] w-full" />
  )
};

onConnect(categoriesResource.dataAtom, categoriesResource)

export const MainCategories = reatomComponent(({ ctx }) => {
  return (
    ctx.spy(globalOptionsAtom).isAuthenticated ? <MainCategoriesList /> : (
      <div className="relative w-full min-h-[300px] h-fit rounded-lg overflow-hidden">
        <div className="flex flex-col gap-2 absolute w-full p-4 h-full">
          <div className="bg-shark-950 w-full rounded-lg h-20" />
          <div className="bg-shark-950 w-full rounded-lg h-20" />
          <div className="bg-shark-950 w-full rounded-lg h-20" />
        </div>
        <Suspense>
          <AuthTemplate />
        </Suspense>
      </div>
    )
  )
}, "Categories")

const MainCategoriesList = reatomComponent(({ ctx }) => {
  const categories = ctx.spy(categoriesResource.dataAtom)

  if (ctx.spy(categoriesResource.statusesAtom).isPending) return <CategoriesListSkeleton />

  if (!categories) return null;

  return (
    <div className="flex flex-col gap-y-4 w-full">
      <div className="flex flex-col rounded-lg gap-2 w-full">
        {categories.map(c => (
          <div
            key={c.category_id}
            className="flex flex-col gap-y-4 w-full py-8 rounded-lg px-4 bg-primary-color"
          >
            <div className="flex items-center w-fit gap-2">
              <Typography textSize="very_big" textColor="shark_white" className="font-bold">
                {c.category_title}
              </Typography>
            </div>
            {c.threads ? (
              <div className="flex flex-col gap-y-2 w-full">
                <Typography className="text-shark-300 text-base font-normal px-2">
                  Треды
                </Typography>
                <div className="flex flex-col gap-y-2 w-full h-full">
                  {c.threads.map(t => <ThreadItem key={t.id} {...t} />)}
                </div>
              </div>
            ) : (
              <Suspense>
                <ThreadNotFound />
              </Suspense>
            )}
            <Separator />
            <div className="flex items-center gap-2 w-fit h-full">
              <CustomLink
                to={CATEGORY_URL + c.category_id}
                className="flex gap-2 items-center justify-start hover:bg-shark-700 transition-all 
                duration-300 ease-in-out group bg-shark-900 px-2 py-1 rounded-md"
              >
                <img src={Spyglass} alt="" width={20} height={20} draggable={false} />
                <Typography>
                  Все треды
                </Typography>
              </CustomLink>
              <Dialog>
                <DialogTrigger>
                  <div 
                    className="flex gap-2 items-center justify-start 
                      hover:bg-shark-700 transition-all duration-300 ease-in-out group bg-shark-900 px-2 py-1 rounded-md"
                    >
                    <Typography>
                      О категории
                    </Typography>
                  </div>
                </DialogTrigger>
                <DialogContent>
                  <div className="flex flex-col items-center justify-center gap-y-4 w-full">
                    <Typography variant="dialogTitle">
                      {c.category_title}
                    </Typography>
                    <div className="flex flex-col gap-2 p-2 w-full">
                      <Typography>
                        {c.category_description ?? "Описания пока нет"}
                      </Typography>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        ))}
      </div>
    </div >
  );
}, "MainCategoriesList")