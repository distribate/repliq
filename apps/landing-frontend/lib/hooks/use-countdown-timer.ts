import { useEffect, useState } from "react";

export const useCountdownTimer = (targetDate: Date) => {
	const [timeRemaining, setTimeRemaining] = useState({
		days: 0,
		hours: 0,
		minutes: 0,
	});
	
	useEffect(() => {
		const intervalId = setInterval(() => {
			const now = new Date();
			const difference = targetDate.getTime() - now.getTime();
			
			if (difference <= 0) {
				clearInterval(intervalId);
				setTimeRemaining({ days: 0, hours: 0, minutes: 0 });
			} else {
				const days = Math.floor(difference / (1000 * 60 * 60 * 24));
				const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
				const minutes = Math.floor((difference / (1000 * 60)) % 60);
				
				setTimeRemaining({ days, hours, minutes });
			}
		}, 1000);
		
		return () => clearInterval(intervalId);
	}, [targetDate]);
	
	return { timeRemaining };
};