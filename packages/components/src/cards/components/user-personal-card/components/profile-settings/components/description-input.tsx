import { Input } from "@repo/ui/src/components/input.tsx";
import { ChangeEvent, useCallback, useState } from "react";
import { useDebounce } from "@repo/lib/hooks/use-debounce.ts";
import { useUpdateCurrentUser } from "@repo/lib/hooks/use-update-current-user.ts";
import { getUser } from "@repo/lib/helpers/get-user.ts";

export const DescriptionInput = () => {
  const currentUser = getUser();
  const [value, setValue] = useState<string | "">(
    currentUser.description || "",
  );
  const { updateFieldMutation } = useUpdateCurrentUser();

  const debouncedHandleSearch = useCallback(
    useDebounce((val: string) => {
      return updateFieldMutation.mutate({ field: "description", value: val });
    }, 600),
    [],
  );

  const handleDescriptionInput = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;

    setValue(value);
    debouncedHandleSearch(value);
  };

  return (
    <Input
      value={value}
      onChange={handleDescriptionInput}
      placeholder="Описание..."
      className="!text-base"
      backgroundType="transparent"
    />
  );
};
