import { X } from "lucide-react";
import { useControlCoverImage } from "../hooks/use-control-cover-image.tsx";
import { CURRENT_USER_QUERY_KEY, CurrentUser } from '@repo/lib/queries/current-user-query.ts';
import { useQueryClient } from '@tanstack/react-query';
import { HoverCardItem } from '@repo/ui/src/components/hover-card.tsx';
import { Typography } from '@repo/ui/src/components/typography.tsx';

export const DeleteBackgroundImageButton = () => {
	const qc = useQueryClient();
	const currentUser = qc.getQueryData<CurrentUser>(CURRENT_USER_QUERY_KEY)
	const { deleteBackgroundImageMutation } = useControlCoverImage();
	
	if (!currentUser) return null;
	
	return (
		<HoverCardItem
			className="gap-2 items-center group"
		>
			<X size={16} className="text-shark-300 group-hover:text-pink-500"/>
			<Typography>Удалить фон</Typography>
		</HoverCardItem>
	)
}