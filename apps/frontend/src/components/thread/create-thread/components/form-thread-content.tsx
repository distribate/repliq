import { Skeleton } from '@repo/ui/src/components/skeleton.tsx'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@repo/ui/src/components/tabs.tsx'
import { Typography } from '@repo/ui/src/components/typography.tsx'
import { cva } from 'class-variance-authority'
import { Edit, Eye } from 'lucide-react'
import { clientOnly } from 'vike-react/clientOnly'

const FormThreadEditor = clientOnly(() => import('./form-thread-editor.tsx').then(m => m.FormThreadEditor))

const tabVariant = cva(`
  flex group items-center justify-center 
  gap-2 data-[state=active]:!bg-shark-900 data-[state=active]:border-2 data-[state=active]:border-shark-600
`)

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
            className={tabVariant()}
          >
            <Edit size={20} className="text-shark-300" />
            <span className="text-shark-50">Редактирование</span>
          </TabsTrigger>
          <TabsTrigger
            disabled
            value="preview"
            className={tabVariant()}
          >
            <Eye size={20} className="text-shark-300" />
            <span className="text-shark-50">
              Предварительный просмотр
            </span>
          </TabsTrigger>
        </TabsList>
        <TabsContent value="edit">
          <FormThreadEditor />
        </TabsContent>
        <TabsContent value="preview">
          Превью в разработке...
        </TabsContent>
      </Tabs>
    </div>
  )
}