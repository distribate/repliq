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
          <TabsTrigger
            value="edit"
            className="flex group items-center justify-center gap-2 data-[state=active]:!bg-shark-900 data-[state=active]:border-2 data-[state=active]:border-shark-50/60"
          >
            <Edit size={20} className="text-shark-300" />
            <span className="text-shark-50">Редактирование</span>
          </TabsTrigger>
          <TabsTrigger
            disabled
            value="preview"
            className="flex group items-center justify-center gap-2 data-[state=active]:!bg-shark-900 data-[state=active]:border-2 data-[state=active]:border-shark-50/60"
          >
            <Eye size={20} className="text-shark-300" />
            <span className="text-shark-50">Предварительный просмотр</span>
          </TabsTrigger>
        </TabsList>
        <TabsContent value="edit">
          <Suspense fallback={<Skeleton className="h-44 w-full" />}>
            <FormThreadEditor />
          </Suspense>
        </TabsContent>
        <TabsContent value="preview">
          Превью в разработке...
        </TabsContent>
      </Tabs>
    </div>
  )
}