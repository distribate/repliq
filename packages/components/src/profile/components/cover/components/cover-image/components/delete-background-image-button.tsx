import { Button } from "@repo/ui/src/components/button.tsx";
import { X } from "lucide-react";
import { useControlCoverImage } from "../hooks/use-control-cover-image.tsx";
import { currentUserQuery } from "@repo/lib/queries/current-user-query.ts";

export const DeleteBackgroundImageButton = () => {
	const { deleteBackgroundImageMutation } = useControlCoverImage();
	const { data: currentUser } = currentUserQuery()
	
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