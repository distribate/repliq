import { Typography } from "@repo/ui/src/components/typography.tsx";
import { Select, SelectContent, SelectItem, SelectTrigger } from "@repo/ui/src/components/select.tsx";
import { FormField } from "@repo/ui/src/components/form-field.tsx";
import { Skeleton } from "@repo/ui/src/components/skeleton.tsx";
import { reatomComponent } from "@reatom/npm-react";
import { availableCategoriesAction, threadFormCategoryAtom } from "../models/thread-form.model.ts";
import { atom } from "@reatom/core";

const AvailableCategoriesSkeleton = () => {
  return (
    Array.from({ length: 5 }).map((_, idx) => (
      <Skeleton key={idx} className="h-6 rounded-md px-2 py-1 " />
    ))
  );
};

const List = reatomComponent(({ ctx }) => {
  const availableCategories = ctx.spy(availableCategoriesAction.dataAtom)

  if (!availableCategories) {
    return (
      <Typography textColor="shark_white" textSize="medium">
        Категорий нет.
      </Typography>
    )
  }

  return (
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
    ))
  )
}, "List")

const AvailableCategories = reatomComponent(({ ctx }) => {
  const isLoading = ctx.spy(availableCategoriesAction.statusesAtom).isPending;

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
          {isLoading ? <AvailableCategoriesSkeleton /> : <List />}
        </div>
      </div>
    </SelectContent>
  );
}, "AvailableCategories")

const selectedCategoryAtom = atom((ctx) => {
  const availableCategories = ctx.spy(availableCategoriesAction.dataAtom)
  const threadCategory = ctx.spy(threadFormCategoryAtom)

  return availableCategories?.find(target => Number(target.id) === threadCategory) || null;
}, "selectedCategoryAtom")

const FormThreadCategory = reatomComponent(({ ctx }) => {
  const threadCategory = ctx.spy(threadFormCategoryAtom)

  if (!threadCategory) {
    return (
      <Typography
        textSize="medium"
        textColor={threadCategory ? "shark_black" : "shark_white"}
      >
        Категория не выбрана
      </Typography>
    )
  }

  const selectedCategory = ctx.spy(selectedCategoryAtom)

  return (
    <div className="flex items-center gap-2">
      <img
        src={selectedCategory?.emoji}
        draggable={false}
        alt=""
        width={24}
        height={24}
        loading="lazy"
      />
      <Typography
        textSize="medium"
        textColor={threadCategory ? "shark_black" : "shark_white"}
      >
        {selectedCategory?.title}
      </Typography>
    </div>
  )
}, "FormThreadCategory")

export const FormThreadCategories = reatomComponent(({ ctx }) => {
  const threadCategory = ctx.spy(threadFormCategoryAtom)
  const selectedCategory = ctx.spy(selectedCategoryAtom)

  const handleValueChange = (value: string) => {
    threadFormCategoryAtom(ctx, Number(value))
  };

  const handleOpen = (value: boolean) => {
    if (value) {
      availableCategoriesAction(ctx)
    }
  };

  return (
    <FormField >
      <div className="flex flex-col">
        <Typography textColor="shark_white" textSize="large">
          Категория <span className="text-red-500">*</span>
        </Typography>
      </div>
      <Select
        onOpenChange={handleOpen}
        onValueChange={v => handleValueChange(v)}
      >
        <SelectTrigger
          className={`${threadCategory ? "bg-shark-50 border-2" : "bg-shark-800"} flex `}
          style={{ borderColor: selectedCategory?.color ?? "" }}
        >
          <FormThreadCategory />
        </SelectTrigger>
        <AvailableCategories />
      </Select>
    </FormField>
  );
}, "FormThreadCategories")