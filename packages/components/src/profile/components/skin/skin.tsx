import { SkinRender } from "./components/skin-render.tsx";
import { SkinControls } from "./components/skin-controls.tsx";
import { getSkinDetails } from "@repo/lib/helpers/get-skin-details.ts";

export interface UserSkinProps {
	userNicknameByParam: string
}

export const UserSkin = async({
	userNicknameByParam
}: UserSkinProps) => {
	
	const skinUrl = getSkinDetails({
		nickname: userNicknameByParam, type: "skin"
	})
	
	return (
		<div className="flex h-[500px] w-[500px]">
			<SkinControls userNicknameByParam={userNicknameByParam}/>
			<SkinRender textureUrl={skinUrl}/>
		</div>
	)
}