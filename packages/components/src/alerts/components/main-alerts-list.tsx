import { AlertCard } from "../../alert/components/alert-card.tsx";
import { getAlerts } from "../queries/get-alerts.ts";

export const MainAlertsList = async () => {
	const alerts = await getAlerts();
	
	return (
		alerts.map((item, i) => (
			<AlertCard key={i} {...item}/>
		))
	)
}