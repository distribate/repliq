import { Typography } from '@repo/ui/src/components/typography.tsx';
import { Dialog, DialogContent, DialogTrigger } from '@repo/ui/src/components/dialog';
import { ThreadPreview } from '@repo/types/entities/thread-type';
import { ThreadLayout } from '#components/thread/components/thread-layout/thread-layout';
import { Skeleton } from '@repo/ui/src/components/skeleton';
import { onConnect } from '@reatom/framework';
import { reatomComponent } from '@reatom/npm-react';
import { latestThreadsByCategoriesAction } from '../models/latest-threads.model';
import { CustomLink } from "#shared/components/link";
import { ThreadByCategoryItem } from '../../threads/components/category-threads';
import { createIdLink } from '#lib/create-link';
import { clientOnly } from 'vike-react/clientOnly';

const ThreadNotFound = clientOnly(() =>
  import("#components/templates/components/threads-not-found").then(m => m.ThreadNotFound)
);

const CategoriesListSkeleton = () => {
  return Array.from({ length: 5 }).map((_, idx) =>
    <div key={idx} className="flex flex-col gap-4 w-full py-6 rounded-lg px-4 bg-primary-color">
      <Skeleton className="h-10 w-1/3" />
      <div className="flex flex-col gap-y-2 w-full">
        <Skeleton className="h-6 w-24" />
        <div className="flex flex-col gap-y-2 w-full h-full">
          <Skeleton className="h-14 w-full" />
          <Skeleton className="h-14 w-full" />
          <Skeleton className="h-14 w-full" />
        </div>
      </div>
      <div className="flex items-center mt-2 justify-end gap-2 w-full h-full">
        <Skeleton className="h-8 w-24" />
        <Skeleton className="h-8 w-28" />
      </div>
    </div>
  )
};

const CategoryDescription = ({
  id, title, description
}: {
  id: number, title: string, description: string
}) => {
  return (
    <div className="flex items-center mt-2 justify-end gap-2 w-full h-full *:duration-150 *:ease-in-out">
      <CustomLink
        to={createIdLink("category", id.toString())}
        className="flex gap-2 items-center justify-start hover:bg-shark-800 bg-shark-900 px-2 py-1 rounded-md"
      >
        <Typography>Все треды</Typography>
      </CustomLink>
      <Dialog>
        <DialogTrigger>
          <div className="flex items-center hover:bg-shark-800 bg-shark-900 px-2 py-1 rounded-md">
            <Typography>О категории</Typography>
          </div>
        </DialogTrigger>
        <DialogContent>
          <div className="flex flex-col items-center justify-center gap-y-4 w-full">
            <Typography variant="dialogTitle">
              {title}
            </Typography>
            <div className="flex flex-col gap-2 p-2 w-full">
              <Typography>
                {description ?? "Описания пока нет"}
              </Typography>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

const ThreadItem = ({
  created_at, description, id, properties, title, comments_count, views_count, owner
}: ThreadPreview) => {
  return (
    <ThreadLayout id={id} title={title} owner={owner}>
      <ThreadByCategoryItem
        id={id}
        title={title}
        created_at={created_at}
        description={description}
        properties={properties}
        comments_count={comments_count}
        views_count={views_count}
        owner={owner}
      />
    </ThreadLayout>
  );
};

onConnect(latestThreadsByCategoriesAction.dataAtom, latestThreadsByCategoriesAction)

export const LatestThreadsByCategories = reatomComponent(({ ctx }) => {
  const data = ctx.spy(latestThreadsByCategoriesAction.dataAtom)

  if (ctx.spy(latestThreadsByCategoriesAction.statusesAtom).isPending) {
    return <CategoriesListSkeleton />
  }

  if (!data) return null;

  return (
    <div className="flex flex-col gap-2 w-full">
      {data.map(category => (
        <div
          key={category.category_id}
          className="flex flex-col gap-4 w-full rounded-lg p-2 sm:p-4 bg-primary-color"
        >
          <Typography textSize="very_big" textColor="shark_white" className="font-bold">
            {category.category_title}
          </Typography>
          {category.threads ? (
            <div className="flex flex-col gap-y-2 w-full">
              <Typography className="text-shark-300 px-2">
                Треды
              </Typography>
              <div className="flex flex-col gap-2 w-full h-full">
                {category.threads.map(thread => <ThreadItem key={thread.id} {...thread} />)}
              </div>
            </div>
          ) : (
            <ThreadNotFound />
          )}
          <CategoryDescription
            id={category.category_id}
            title={category.category_title}
            description={category.category_description}
          />
        </div>
      ))}
    </div>
  );
}, "LatestThreadsByCategories")