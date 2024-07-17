import { Star } from "lucide-react";

export const UserWalletStats = () => {
	return (
		<div className="flex gap-1 items-center">
			<Star className="text-yellow-500" size={16}/>
			<span className="text-md text-white">0</span>
		</div>
	)
}