import { Typography } from "@repo/ui/src/components/typography.tsx";
import React from "react";
import { DropdownMenuItem } from "@repo/ui/src/components/dropdown-menu.tsx";
import { useUpdateCurrentUser } from "@repo/lib/hooks/use-update-current-user.ts";
import { DropdownWrapper } from '../../../../../../../../wrappers/dropdown-wrapper.tsx';
import { VISIBILITY_FORMATS } from '../constants/visibility-formats.ts';
import { ProfileVisibilityChangeType } from '../types/visibility-types.ts';

export const ProfileVisibilityChange = ({
	visibility
}: ProfileVisibilityChangeType) => {
	const { updateFieldMutation } = useUpdateCurrentUser()
	
	const profileVisibilityType = visibility === 'all'
		? 'открытый'
		: 'закрытый';
	
	const handleVisibility = (
		e: React.MouseEvent<HTMLDivElement, MouseEvent>, type: ProfileVisibilityChangeType["visibility"]
	) => {
		e.preventDefault();
		
		updateFieldMutation.mutate({
			field: "visibility", value: type
		})
	}
	
	return (
		<DropdownWrapper
			properties={{ contentAlign: 'end', sideAlign: 'right' }}
			trigger={<Typography className="text-base">{profileVisibilityType}</Typography>}
			content={
				<div className="flex flex-col gap-y-4">
					<Typography className="text-shark-300 text-sm px-2 pt-2">
						Изменить тип профиля
					</Typography>
					<div className="flex flex-col gap-y-2">
						{VISIBILITY_FORMATS.map((item) => (
							<DropdownMenuItem
								key={item.value}
								onClick={(e) => handleVisibility(e, item.value)}
							>
								<Typography className={visibility === item.value ? 'text-caribbean-green-500' : ''}>
									{item.title}
								</Typography>
							</DropdownMenuItem>
						))}
					</div>
				</div>
			}
		/>
	)
}