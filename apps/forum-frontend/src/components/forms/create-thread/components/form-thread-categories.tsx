import { Typography } from "@repo/ui/src/components/typography.tsx";
import { Controller } from "react-hook-form";
import { Select, SelectContent, SelectItem, SelectTrigger } from "@repo/ui/src/components/select.tsx";
import { FormField } from "@repo/ui/src/components/form-field.tsx";
import { availableCategoriesQuery } from "../queries/available-query.ts";
import { useState } from "react";
import { threadFormQuery } from "../queries/thread-form-query.ts";
import { FormChildsProps } from "./form-thread.tsx";
import { useEditThread } from "../hooks/use-edit-thread.tsx";
import { Skeleton } from "@repo/ui/src/components/skeleton.tsx";

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

const AvailableCategories = ({ enabled }: AvailableCategoriesProps) => {
  const { data: availableCategories, isLoading } = availableCategoriesQuery(enabled);

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
};

export const FormThreadCategories = ({
  errors, control
}: FormChildsProps) => {
  const [enabled, setEnabled] = useState<boolean>(false);
  const { data: availableCategories } = availableCategoriesQuery(enabled);
  const { data: threadFormState } = threadFormQuery();
  const { updateThreadFormMutation } = useEditThread();

  if (!threadFormState) return;

  const handleValueChange = (value: string, onChange: (v: number) => void) => {
    onChange(Number(value));

    return updateThreadFormMutation.mutate({ category_id: Number(value) });
  };

  const handleOpen = (v: boolean) => {
    if (v && !enabled) {
      setEnabled(true);
    }
  };

  const isActive = threadFormState.category_id;
  const selectedCategoryId = threadFormState.category_id;
  const selectedCategory = availableCategories?.find(i => Number(i.id) === selectedCategoryId) || null;

  return (
    <FormField errorMessage={errors?.category_id?.message}>
      <div className="flex flex-col">
        <Typography textColor="shark_white" textSize="large">
          Категория <span className="text-red-500">*</span>
        </Typography>
      </div>
      <Controller
        control={control}
        name="category_id"
        render={({ field: { onChange } }) => {
          return (
            <Select
              onOpenChange={handleOpen}
              onValueChange={(v) => handleValueChange(v, onChange)}
            >
              <SelectTrigger
                className={`${isActive ? "bg-shark-50 border-2" : "bg-shark-800"} flex `}
                style={{ borderColor: selectedCategory?.color ?? "" }}
              >
                {!threadFormState.category_id ? (
                  <Typography
                    textSize="medium"
                    textColor={isActive ? "shark_black" : "shark_white"}
                  >
                    Категория не выбрана
                  </Typography>
                ) : (
                  <div className="flex items-center gap-2">
                    <img src={selectedCategory?.emoji} draggable={false} alt="" width={24} height={24} />
                    <Typography
                      textSize="medium"
                      textColor={isActive ? "shark_black" : "shark_white"}
                    >
                      {selectedCategory?.title}
                    </Typography>
                  </div>
                )}
              </SelectTrigger>
              <AvailableCategories enabled={enabled} />
            </Select>
          );
        }}
      />
    </FormField>
  );
};