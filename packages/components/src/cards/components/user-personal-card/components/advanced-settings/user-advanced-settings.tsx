import { Typography } from "@repo/ui/src/components/typography.tsx";
import { HoverCardItem } from "@repo/ui/src/components/hover-card.tsx";
import { ImageWrapper } from "../../../../../wrappers/image-wrapper.tsx";
import CopperHorn from "@repo/assets/images/minecraft/copper-horn.webp"
import { useCallback, useEffect, useState } from "react";
import { hasAlertsShow } from "@repo/lib/actions/has-alerts.ts";
import { setAlerts } from "@repo/lib/actions/set-alerts.ts";
import { disableAlerts } from "@repo/lib/actions/disable-alerts.ts";
import { usePreferences } from "./hooks/use-preferences.ts";
import Paper from "@repo/assets/images/minecraft/paper.webp"

export const UserAdvancedSettings = () => {
	const [isAlerts, setIsAlerts] = useState<boolean | null>(null);
	const { preferences, setAutoSaveThreads } = usePreferences()
	
	useEffect(() => {
		hasAlertsShow().then(res => setIsAlerts(res))
	}, [isAlerts]);
	
	const enableAlerts = useCallback(() => {
		if (isAlerts) {
			disableAlerts().then()
		} else {
			setAlerts().then()
		}
		
		setIsAlerts(!isAlerts);
	}, [ isAlerts ])
	
	return (
		<div className="flex flex-col gap-y-4 items-center w-full">
			<Typography className="text-xl text-shark-50 font-semibold">
				Дополнительные настройки
			</Typography>
			<div className="flex flex-col gap-y-2 w-full">
				<HoverCardItem className="justify-between w-full">
					<div className="flex gap-x-2 items-center w-full px-2">
						<ImageWrapper
							propSrc={CopperHorn?.src}
							width={32}
							height={32}
							loading="eager"
							propAlt="Change description"
						/>
						<Typography className="text-base">
							Объявления
						</Typography>
					</div>
					<Typography className="text-base" onClick={enableAlerts}>
						{isAlerts ? "вкл" : "выкл"}
					</Typography>
				</HoverCardItem>
				<HoverCardItem className="justify-between w-full">
					<div className="flex gap-x-2 items-center w-full px-2">
						<ImageWrapper
							propSrc={Paper?.src}
							width={32}
							height={32}
							loading="eager"
							propAlt="Change description"
						/>
						<Typography className="text-base">
							Автосохранение топиков
						</Typography>
					</div>
					<Typography className="text-base" onClick={setAutoSaveThreads}>
						{preferences.autoSaveThreads ? "вкл" : "выкл"}
					</Typography>
				</HoverCardItem>
			</div>
		</div>
	)
}