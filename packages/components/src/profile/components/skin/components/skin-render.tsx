"use client"

import DefaultSkin from "@repo/assets/images/default.png"
import ReactSkinview3d from "react-skinview3d";
import { useSkinViewer } from "../hooks/use-skin-viewer.ts";
import { UserSkinProps } from '../skin.tsx';
import { useSkinStateQuery } from '../queries/skin-query.ts';

export const SkinRender = ({
	reqUserNickname
}: UserSkinProps) => {
	const { setViewerRef } = useSkinViewer();
	const { data: skinState } = useSkinStateQuery(reqUserNickname)
	
	return (
		<ReactSkinview3d
			skinUrl={skinState || DefaultSkin.src}
			height="500"
			width="500"
			onReady={({ viewer }) => setViewerRef(viewer)}
		/>
	)
}