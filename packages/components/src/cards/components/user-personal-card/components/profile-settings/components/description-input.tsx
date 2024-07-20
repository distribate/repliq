import { Input } from "@repo/ui/src/components/input.tsx";
import { ChangeEvent, useCallback, useState } from "react";
import { useDebounce } from "@repo/lib/hooks/use-debounce.ts";
import { CURRENT_USER_QUERY_KEY, CurrentUser } from '@repo/lib/queries/current-user-query.ts';
import { useUpdateCurrentUser } from "@repo/lib/hooks/use-update-current-user.ts";
import { useQueryClient } from '@tanstack/react-query';

export const DescriptionInput = () => {
	const qc = useQueryClient();
	const currentUser = qc.getQueryData<CurrentUser>(CURRENT_USER_QUERY_KEY)
	
	const [value, setValue] = useState<string | ''>(
		currentUser?.description || ''
	);
	
	const { updateFieldMutation } = useUpdateCurrentUser()
	
	const debouncedHandleSearch = useCallback(useDebounce((val: string) => {
		updateFieldMutation.mutate({
			field: "description", value: val
		});
	}, 600), []);
	
	const handleDescriptionInput = (e: ChangeEvent<HTMLInputElement>) => {
		const { value } = e.target;
		
		setValue(value)
		debouncedHandleSearch(value)
	}
	
	return (
		<Input
			value={value}
			onChange={handleDescriptionInput}
			placeholder="Описание..."
			className="!text-base"
			backgroundType="transparent"
		/>
	)
}