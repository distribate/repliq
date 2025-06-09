import { Skeleton } from '@repo/ui/src/components/skeleton.tsx'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@repo/ui/src/components/tabs.tsx'
import { Typography } from '@repo/ui/src/components/typography.tsx'
import { Edit, Eye } from 'lucide-react'
import { lazy, Suspense } from 'react'

const FormThreadEditor = lazy(() => import('./form-thread-editor.tsx').then(m => ({ default: m.FormThreadEditor })))

export const FormThreadContent = () => {
  return (
    <div className="flex flex-col gap-y-1 w-full max-w-full overflow-hidden">
      <Typography textColor="shark_white" textSize="large">
        Контент <span className="text-red-500">*</span>
      </Typography>
      <Tabs defaultValue="edit" className="flex flex-col w-full gap-4">
        <TabsList className="flex flex-col sm:flex-row items-center justify-between w-full gap-2 *:w-full">
          <TabsTrigger value="edit" className="flex group items-center justify-center gap-2">
            <Edit
              size={20}
              className="group-data-[state=active]:text-shark-900 text-shark-50"
            />
            <span>Редактирование</span>
          </TabsTrigger>
          <TabsTrigger disabled value="preview" className="flex group items-center justify-center gap-2">
            <Eye
              size={20}
              className="group-data-[state=active]:text-shark-900 text-shark-50"
            />
            <span>Предварительный просмотр</span>
          </TabsTrigger>
        </TabsList>
        <TabsContent value="edit">
          <Suspense fallback={<Skeleton className="h-44 w-full" />}>
            <FormThreadEditor />
          </Suspense>
        </TabsContent>
        <TabsContent value="preview">
          Preview built...
        </TabsContent>
      </Tabs>
    </div>
  )
}