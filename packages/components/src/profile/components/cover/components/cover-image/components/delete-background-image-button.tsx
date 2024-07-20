import { Button } from "@repo/ui/src/components/button.tsx";
import { X } from "lucide-react";
import { useControlCoverImage } from "../hooks/use-control-cover-image.tsx";
import { CURRENT_USER_QUERY_KEY, CurrentUser } from '@repo/lib/queries/current-user-query.ts';
import { useQueryClient } from '@tanstack/react-query';

export const DeleteBackgroundImageButton = () => {
	const qc = useQueryClient();
	const currentUser = qc.getQueryData<CurrentUser>(CURRENT_USER_QUERY_KEY)
	const { deleteBackgroundImageMutation } = useControlCoverImage();
	
	if (!currentUser) return null;
	
	return (
		<Button
			onClick={() => deleteBackgroundImageMutation.mutate()}
			disabled={!currentUser.cover_image}
			className="gap-2 items-center justify-start"
		>
			<X size={16} className="text-shark-300"/>
			Удалить фон
		</Button>
	)
}