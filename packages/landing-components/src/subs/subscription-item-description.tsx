import { Typography } from "@repo/landing-ui/src/typography.tsx";

type SubscriptionFormDescriptionProps = {
	name: string,
	rating: string,
	commands: string[],
	description: string
}

export const SubscriptionItemDescription = ({
	rating, name, commands, description
}: SubscriptionFormDescriptionProps) => {
	return (
		<div className="flex flex-col gap-y-2">
			<h1 className='text-black text-lg xl:text-2xl text-right -top-2 relative'>
				{name}
			</h1>
			<div className="flex items-center">
				<Typography size="xl" position="left" className="text-water-meadow">
					Рейтинг:&nbsp;
				</Typography>
				<Typography size="xl" className="text-black" position="left">
					{rating}
				</Typography>
			</div>
			<div className="flex flex-col items-start">
				<Typography size="xl" position="left" className="text-water-meadow">
					Описание:
				</Typography>
				<Typography size="lg" className="text-black" position="left">
					{description}
				</Typography>
			</div>
			<div className="flex flex-col items-start">
				<Typography size="xl" position="left" className="text-water-meadow">
					Команды:
				</Typography>
				{commands?.slice(0, 3).map((item, idx) => (
					<Typography key={idx} size="lg" className="text-black" position="left">
						{item}
					</Typography>
				))}
			</div>
		</div>
	)
}