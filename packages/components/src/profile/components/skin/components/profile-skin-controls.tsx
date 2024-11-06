"use client"

import { Button } from "@repo/ui/src/components/button.tsx";
import { Icon } from "@repo/shared/ui/icon/icon.tsx"
import { Download, RotateCw } from "lucide-react";
import { Separator } from "@repo/ui/src/components/separator.tsx";
import { useSkinStateChange } from "../hooks/use-skin-animation.ts";
import { useSkinAnimationQuery } from "../queries/skin-query.ts";
import { useRouter } from "next/navigation";
import { SKIN_ANIMATIONS } from '../constants/skin-animations.ts';
import { SKIN_DOWNLOAD_SKIN } from '@repo/shared/constants/routes.ts';
import { UserSkinProps } from '#profile/components/skin/components/profile-skin.tsx';

export const ProfileSkinControls = ({
	reqUserNickname
}: UserSkinProps) => {
	const { push } = useRouter();
	const { data: skinAnimation } = useSkinAnimationQuery()
	const { updateSkinStateMutation } = useSkinStateChange()
	
	return (
		<div className="flex flex-col gap-y-2">
			{SKIN_ANIMATIONS.map((control, i) => (
				<Button
					key={i}
					className="min-h-[40px] min-w-[40px]"
					state={skinAnimation.animation === control.animation ? 'active' : 'default'}
					onClick={() => updateSkinStateMutation.mutate({ animation: control.animation })}
				>
					<Icon name={control.icon} className="text-xl"/>
				</Button>
			))}
			<Button
				className="min-h-[40px] min-w-[40px]"
				state={skinAnimation.rotate ? 'active' : 'default'}
				onClick={() => updateSkinStateMutation.mutate({ rotate: !skinAnimation.rotate })}
			>
				<RotateCw size={20}/>
			</Button>
			<Separator/>
			<Button className="p-2.5" onClick={() => push(SKIN_DOWNLOAD_SKIN + reqUserNickname)}>
				<Download size={20}/>
			</Button>
		</div>
	)
}