"use client"

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "#/ui/accordion";
import { useCountdownTimer } from "#/lib/hooks/use-countdown-timer";

const UntilTimer = () => {
	const targetDate = new Date(Date.UTC(2024, 11, 1));
	const { timeRemaining } = useCountdownTimer(targetDate)
	
	return `${timeRemaining.days} дней ${timeRemaining.hours} часов`
}

export const SettingsWidget = () => {
	return (
		<div
			className="fixed right-[8px] top-32 z-[100] flex bg-black/50 backdrop-blur-lg backdrop-filter p-2 rounded-[4px] border-2 border-neutral-600 dark:border-netural-900">
			<Accordion type="single" collapsible>
				<AccordionItem value="widget">
					<AccordionTrigger
						withBook={false}
						className="flex data-[state=open]:hidden items-center justify-center w-4 !p-0 h-4"
					>
							<span className="text-white text-center">
								◆
							</span>
					</AccordionTrigger>
					<AccordionContent>
						<div className="flex flex-col">
							<span className="text-white">
								◆ До открытия:
							</span>
							&nbsp;&nbsp;<UntilTimer/>
						</div>
					</AccordionContent>
				</AccordionItem>
			</Accordion>
		</div>
	)
}