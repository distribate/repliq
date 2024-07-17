import { cva, VariantProps } from "class-variance-authority";
import { HTMLAttributes } from "react";
import { DropdownWrapper } from "../../../../../wrappers/dropdown-wrapper.tsx";
import { ImageWrapper } from "../../../../../wrappers/image-wrapper.tsx";
import Photo from "@repo/assets/images/minecraft/photo.webp"
import { DialogWrapper } from "../../../../../wrappers/dialog-wrapper.tsx";
import { UserProfileSettings } from "../../../../../cards/components/user-personal-card/components/profile-settings/user-profile-settings.tsx";
import BookAndQuill from "@repo/assets/images/minecraft/book_quill.webp"
import { FriendButton } from '../../components/add-friend/components/friend-button.tsx';
import {
	UploadBackgroundImageButton
} from '../../components/cover-image/components/upload-background-image-button.tsx';
import {
	DeleteBackgroundImageButton
} from '../../components/cover-image/components/delete-background-image-button.tsx';

const userCoverPanelVariants = cva("relative z-[3] flex bg-transparent gap-x-4 border-none", {
	variants: {
		variant: { default: "", end: "self-end justify-end" }
	}
})

interface UserCover {
	userByParamNickname: string,
	isOwner: boolean
}

interface UserCoverPanelProps
	extends HTMLAttributes<HTMLDivElement>,
		VariantProps<typeof userCoverPanelVariants>, UserCover {}

export const UserCoverPanel = ({
	variant, className, userByParamNickname, isOwner, ...props
}: UserCoverPanelProps) => {
	return (
		<div
			className={userCoverPanelVariants(({ variant, className }))}
			{...props}
		>
			{!isOwner && (
				<FriendButton requestedUserNickname={userByParamNickname}/>
			)}
			{isOwner && (
				<div className="flex items-center gap-x-2 bg-white/10 rounded-md px-4 py-0.5">
					<DropdownWrapper
						properties={{ triggerAsChild: true, contentAlign: "end", contentClassname: "w-[196px]" }}
						trigger={
							<div className="rounded-md p-1 cursor-pointer">
								<ImageWrapper propSrc={Photo?.src} width={26} height={26} loading="eager" propAlt="Change cover image"/>
							</div>
						}
						content={
							<div className="flex flex-col gap-y-1">
								<UploadBackgroundImageButton/>
								<DeleteBackgroundImageButton/>
							</div>
						}
					/>
					<DialogWrapper
						name="profile-description"
						trigger={
							<div className="rounded-md min-w-[30px] min-h-[30px] p-1 cursor-pointer">
								<ImageWrapper propSrc={BookAndQuill?.src} width={26} height={26} loading="eager" propAlt="Change description"/>
							</div>
						}
					>
						<UserProfileSettings/>
					</DialogWrapper>
				</div>
			)}
		</div>
	)
}