import { Typography } from "@repo/ui/src/components/typography.tsx";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@repo/ui/src/components/accordion.tsx";
import { useCreateThread } from "../hooks/use-create-thread.tsx";
import { threadFormQuery } from "../queries/thread-form-query.ts";
import { Input } from "@repo/ui/src/components/input.tsx";
import { useState, ChangeEvent } from "react";
import { X } from "lucide-react";
import { THREAD_TAGS_LIMIT } from "@repo/shared/constants/limits.ts";

function parseStringToArray(input: string) {
  const parts = input.split(",");
  return parts.map((item) => item.trim()).filter((item) => item);
}

export const AdditionalSections = () => {
  const { updateThreadFormMutation } = useCreateThread();
  const { data: threadFormState } = threadFormQuery();
  const [inputValue, setInputValue] = useState<string>("");

  if (!threadFormState) return;

  const tags = threadFormState.tags;

  const handleDeleteTag = (index: number) => {
    if (!tags) return;

    const updatedTags = tags.filter((_, i) => i !== index);

    return updateThreadFormMutation.mutate({
      tags: updatedTags.length >= 1 ? updatedTags : null,
    });
  };

  const handleAddTags = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);

    if (tags && tags.length >= THREAD_TAGS_LIMIT[1]) {
      return;
    }

    if (value.endsWith(",")) {
      const tags = parseStringToArray(value);
      const lastTag = tags[tags.length - 1];

      if (lastTag) {
        updateThreadFormMutation.mutate({
          tags: [...(threadFormState.tags || []), lastTag],
        });
      }

      setInputValue("");
    }
  };

  return (
    <>
      {/*{threadFormState.auto_remove && (*/}
      {/*  <div className="flex flex-col gap-y-2 w-full rounded-md p-6 bg-shark-950">*/}
      {/*    <Typography textColor="shark_white" textSize="big">*/}
      {/*      Настройка авто-удаления*/}
      {/*    </Typography>*/}
      {/*  </div>*/}
      {/*)}*/}
      {/*{threadFormState.permission && (*/}
      {/*  <div className="flex flex-col gap-y-2 w-full rounded-md p-6 bg-shark-950">*/}
      {/*    <Typography textColor="shark_white" textSize="big">*/}
      {/*      Настройка хайда*/}
      {/*    </Typography>*/}
      {/*  </div>*/}
      {/*)}*/}
      <div className="flex flex-col gap-y-2 w-full rounded-md px-4 py-2 bg-primary-color">
        <Accordion type="single" collapsible defaultValue="show-more">
          <AccordionItem value="show-more">
            <AccordionTrigger>
              <Typography textColor="shark_white" textSize="big">
                Дополнительные настройки
              </Typography>
            </AccordionTrigger>
            <AccordionContent>
              <div className="flex flex-col gap-y-2">
                <div className="flex flex-col">
                  <Typography textColor="shark_white" textSize="large">
                    Теги
                  </Typography>
                  <Typography className="text-shark-300" textSize="medium">
                    (теги для поиска треда, перечисление через запятую)
                  </Typography>
                </div>
                <div className="flex flex-col gap-2 min-h-[100px] max-h-[200px] rounded-md p-2 bg-shark-900">
                  {threadFormState.tags && (
                    <div className="flex flex-wrap items-center gap-2">
                      {threadFormState.tags.map((tag, i) => (
                        <div
                          key={i}
                          className="flex items-center justify-between bg-shark-500 rounded-sm px-2 py-3 h-3 overflow-hidden"
                        >
                          <Typography className="text-[15px] font-medium">
                            {tag.toString()}
                          </Typography>
                          <X
                            onClick={() => handleDeleteTag(i)}
                            size={15}
                            className="text-shark-50 cursor-pointer"
                          />
                        </div>
                      ))}
                    </div>
                  )}
                  {!tags || (tags && tags.length < THREAD_TAGS_LIMIT[1]) ? (
                    <Input
                      value={inputValue}
                      placeholder={!threadFormState.tags ? "тег" : ""}
                      className="!p-0 !m-0 !min-h-3 w-fit !text-[15px]"
                      onChange={handleAddTags}
                    />
                  ) : (
                    <Typography className="text-red-500 text-[15px]">
                      Максимальное количество тегов
                    </Typography>
                  )}
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </>
  );
};
