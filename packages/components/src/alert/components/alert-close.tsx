"use client"

import { X } from "lucide-react";
import { toast } from "@repo/ui/src/hooks/use-toast.ts";
import { disableAlerts } from "@repo/lib/actions/disable-alerts.ts";

export const AlertClose = () => {
	
	const handleShowAlerts = () => {
		toast({
			title: "Объявления выключены. Вы можете их включить в настройках профиля.",
			variant: "positive"
		})
		
		return disableAlerts();
	}
	
	return (
		<div
			onClick={handleShowAlerts}
			className="absolute right-4 top-3 opacity-70 hover:opacity-100 disabled:pointer-events-none	cursor-pointer"
		>
			<X className="h-4 w-4"/>
		</div>
	)
}