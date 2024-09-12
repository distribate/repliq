import { Typography } from '@repo/ui/src/components/typography.tsx';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@repo/ui/src/components/accordion.tsx';
import { Textarea } from '@repo/ui/src/components/textarea.tsx';
import { useCreateThread } from '../hooks/use-create-thread.tsx';
import { threadFormQuery } from '../queries/thread-form-query.ts';

function parseStringToArray(input: string) {
  const parts = input.split(',');
  return parts.map(item => item.trim())
}

export const AdditionalSections = () => {
  const { updateThreadFormMutation } = useCreateThread();
  const { data: threadFormState } = threadFormQuery()
  
  return (
    <>
      {threadFormState.values?.auto_remove && (
        <div className="flex flex-col gap-y-2 w-full rounded-md p-6 bg-shark-950">
          <Typography textColor="shark_white" textSize="big">
            Настройка авто-удаления
          </Typography>
        </div>
      )}
      {threadFormState.values?.permission && (
        <div className="flex flex-col gap-y-2 w-full rounded-md p-6 bg-shark-950">
          <Typography textColor="shark_white" textSize="big">
            Настройка хайда
          </Typography>
        </div>
      )}
      <div className="flex flex-col gap-y-2 w-full rounded-md px-6 py-2 bg-shark-950">
        <Accordion type="single" collapsible>
          <AccordionItem value="show-more">
            <AccordionTrigger>
              <Typography textColor="shark_white" textSize="big">
                Дополнительные настройки
              </Typography>
            </AccordionTrigger>
            <AccordionContent>
              <div className="flex flex-col gap-y-2">
                <div className="flex flex-col">
                  <Typography textColor="shark_white" textSize="medium">Теги</Typography>
                  <Typography className="text-shark-300" textSize="small">
                    (теги для поиска треда, перечисление через запятую)
                  </Typography>
                </div>
                <Textarea
                  placeholder="например: тред,абоба"
                  className="min-h-[100px] max-h-[200px] bg-shark-900 py-2"
                  onChange={(e) => {
                    updateThreadFormMutation.mutate({
                      values: { tags: parseStringToArray(e.target.value) }
                    })
                  }}
                />
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </>
  );
};