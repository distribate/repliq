"use client"

import DefaultSkin from "@repo/assets/images/default.png"
import ReactSkinview3d from "react-skinview3d";
import { useSkinViewer } from "../hooks/use-skin-viewer.ts";

type SkinRenderProps = {
	textureUrl?: string | null
}

export const SkinRender = ({
	textureUrl
}: SkinRenderProps) => {
	const { setViewerRef } = useSkinViewer();
	
	return (
		<ReactSkinview3d
			skinUrl={textureUrl || DefaultSkin.src}
			height="500"
			width="500"
			onReady={({ viewer }) => setViewerRef(viewer)}
		/>
	)
}