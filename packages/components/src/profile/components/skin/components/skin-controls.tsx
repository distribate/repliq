"use client"

import { Button } from "@repo/ui/src/components/button.tsx";
import { Icon } from "@repo/shared/ui/icon/icon.tsx"
import { Download, RotateCw } from "lucide-react";
import { Separator } from "@repo/ui/src/components/separator.tsx";
import { useSkinStateChange } from "../hooks/use-skin-animation.ts";
import { SkinAnimation, useSkinStateQuery } from "../queries/skin-query.ts";
import { useRouter } from "next/navigation";
import { UserSkinProps } from "../skin.tsx";

type SkinControls = {
	animation: SkinAnimation,
	icon: SkinIconType,
}

type SkinIconType = "sprite/people-idle"
	| "sprite/people-running"
	| "sprite/people-flying"

const SKIN_CONTROLS: SkinControls[] = [
	{
		animation: "idle",
		icon: "sprite/people-idle"
	},
	{
		animation: "run",
		icon: "sprite/people-running",
	},
	{
		animation: "flying",
		icon: "sprite/people-flying"
	}
]

export const SkinControls = ({
	reqUserNickname
}: UserSkinProps) => {
	const { push } = useRouter();
	const { data: skinState } = useSkinStateQuery()
	const { updateSkinStateMutation } = useSkinStateChange()
	
	return (
		<div className="flex flex-col gap-y-2">
			{SKIN_CONTROLS.map((control, i) => (
				<Button
					key={i}
					className="min-h-[40px] min-w-[40px]"
					state={skinState.animation === control.animation ? 'active' : 'default'}
					onClick={() => updateSkinStateMutation.mutate({
						animation: control.animation
					})}
				>
					<Icon name={control.icon} className="text-xl"/>
				</Button>
			))}
			<Button
				className="min-h-[40px] min-w-[40px]"
				state={skinState.rotate ? 'active' : 'default'}
				onClick={() => updateSkinStateMutation.mutate({
					rotate: !skinState.rotate
				})}
			>
				<RotateCw size={20}/>
			</Button>
			<Separator/>
			<Button
				className="p-2.5"
				onClick={() => push(
					`http://localhost:8000/download-skin/${reqUserNickname}`
				)}
			>
				<Download size={20}/>
			</Button>
		</div>
	)
}