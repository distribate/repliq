"use client"

import { toast } from "sonner";
import { disableAlerts } from "@repo/lib/actions/disable-alerts.ts";
import { DeleteButton } from '@repo/ui/src/components/detele-button.tsx';

export const AlertClose = () => {
	
	const handleShowAlerts = () => {
		toast.info("Объявления выключены.", {
			description: "Вы можете их включить в настройках."
		})
		
		return disableAlerts();
	}
	
	return (
		<DeleteButton variant="invisible" onClick={handleShowAlerts} />
	)
}