import { SkinRender } from "./components/skin-render.tsx";
import { SkinControls } from "./components/skin-controls.tsx";
import { getSkinDetails } from "@repo/lib/helpers/get-skin-details.ts";

export interface UserSkinProps {
	reqUserNickname: string
}

export const UserSkin = async({
	reqUserNickname
}: UserSkinProps) => {
	
	const skinUrl = getSkinDetails({
		nickname: reqUserNickname, type: "skin"
	})
	
	return (
		<div className="flex h-[500px] w-[500px]">
			<SkinControls reqUserNickname={reqUserNickname}/>
			<SkinRender textureUrl={skinUrl}/>
		</div>
	)
}