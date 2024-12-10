"use client"

import { toast } from "sonner";
import { Typography } from "#/ui/typography";

type CopyCryptoAddressProps = {
	title: string,
	value: string
}

export const CopyCryptoAddress = ({
	title, value
}: CopyCryptoAddressProps) => {
	const handleCopy = async () => {
		await navigator.clipboard.writeText(value);
		toast.info("Адрес кошелька скопирован в буфер обмена")
	}
	
	return (
		<Typography
			size="xl"
			text_color="adaptiveWhiteBlack"
			onClick={handleCopy}
			className="cursor-pointer"
		>
			<span className="text-sm">♦</span> {title} <span className="text-sm">♦</span>
		</Typography>
	)
}