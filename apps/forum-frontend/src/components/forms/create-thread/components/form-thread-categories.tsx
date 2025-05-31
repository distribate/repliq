import { Typography } from "@repo/ui/src/components/typography.tsx";
import { Select, SelectContent, SelectItem, SelectTrigger } from "@repo/ui/src/components/select.tsx";
import { FormField } from "@repo/ui/src/components/form-field.tsx";
import { availableCategoriesResource } from "../models/available-categories.model.ts";
import { useState } from "react";
import { Skeleton } from "@repo/ui/src/components/skeleton.tsx";
import { reatomComponent } from "@reatom/npm-react";
import { threadFormCategoryAtom } from "../models/thread-form.model.ts";

type AvailableCategoriesProps = {
  enabled: boolean;
};

const AvailableCategoriesSkeleton = () => {
  return (
    Array.from({ length: 5 }).map((_, idx) => (
      <Skeleton key={idx} className="h-6 rounded-md px-2 py-1 " />
    ))
  );
};

const AvailableCategories = reatomComponent<AvailableCategoriesProps>(({ ctx }) => {
  const availableCategories = ctx.spy(availableCategoriesResource.dataAtom)
  const isLoading = ctx.spy(availableCategoriesResource.statusesAtom).isPending;

  return (
    <SelectContent
      side="bottom"
      align="center"
      className="max-h-[300px] z-[60] overflow-y-scroll"
    >
      <div className="flex flex-col gap-y-4 p-1">
        <Typography className="text-shark-300" textSize="large">
          Доступные категории
        </Typography>
        <div className="flex flex-col gap-y-2">
          {isLoading && <AvailableCategoriesSkeleton />}
          {!isLoading && (
            <>
              {availableCategories &&
                availableCategories.map((category) => (
                  <SelectItem
                    withCheck={false}
                    key={category.id}
                    value={category.id.toString()}
                    className="flex items-center bg-shark-800 hover:bg-shark-700 w-full p-2 group"
                  >
                    <div className="flex items-center gap-2">
                      <img src={category.emoji} draggable={false} alt="" width={24} height={24} />
                      <Typography textColor="shark_white" textSize="medium">
                        {category.title}
                      </Typography>
                    </div>
                  </SelectItem>
                ))}
              {!availableCategories && (
                <Typography textColor="shark_white" textSize="medium">
                  Категорий нет.
                </Typography>
              )}
            </>
          )}
        </div>
      </div>
    </SelectContent>
  );
}, "AvailableCategories")

export const FormThreadCategories = reatomComponent(({ ctx }) => {
  const [enabled, setEnabled] = useState<boolean>(false);
  const availableCategories = ctx.spy(availableCategoriesResource.dataAtom)
  const threadCategory = ctx.spy(threadFormCategoryAtom)

  const handleValueChange = (value: string) => {
    threadFormCategoryAtom(ctx, Number(value))
  };

  const handleOpen = (v: boolean) => {
    if (v && !enabled) {
      setEnabled(true);
    }
  };

  const selectedCategory = availableCategories?.find(i => Number(i.id) === threadCategory) || null;

  return (
    <FormField >
      <div className="flex flex-col">
        <Typography textColor="shark_white" textSize="large">
          Категория <span className="text-red-500">*</span>
        </Typography>
      </div>
      <Select
        onOpenChange={handleOpen}
        onValueChange={(v) => handleValueChange(v)}
      >
        <SelectTrigger
          className={`${threadCategory ? "bg-shark-50 border-2" : "bg-shark-800"} flex `}
          style={{ borderColor: selectedCategory?.color ?? "" }}
        >
          {!threadCategory ? (
            <Typography
              textSize="medium"
              textColor={threadCategory ? "shark_black" : "shark_white"}
            >
              Категория не выбрана
            </Typography>
          ) : (
            <div className="flex items-center gap-2">
              <img src={selectedCategory?.emoji} draggable={false} alt="" width={24} height={24} />
              <Typography
                textSize="medium"
                textColor={threadCategory ? "shark_black" : "shark_white"}
              >
                {selectedCategory?.title}
              </Typography>
            </div>
          )}
        </SelectTrigger>
        <AvailableCategories enabled={enabled} />
      </Select>
    </FormField>
  );
}, "FormThreadCategories")