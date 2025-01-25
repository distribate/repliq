import { PlayerStatusProps } from "../status/player-status";
import { useQuery } from "@tanstack/react-query";
import { getSkinDetails } from "@repo/lib/queries/get-skin-details";

type PlayerStatusImageProps = {
	type?: "small" | "full"
} & PlayerStatusProps

const playerAvatarQuery = (nickname: string) => useQuery({
	queryKey: ['player-avatar', nickname],
	queryFn: () => getSkinDetails({ type: "head", nickname }),
	refetchOnWindowFocus: false
})

export const PlayerStatusImage = ({
	nickname, type = "small"
}: PlayerStatusImageProps) => {
	const { data: avatarUrl } = playerAvatarQuery(nickname)

	return (
		<img
			height={800}
			width={800}
			className={`${type === 'small'
				? 'max-w-[16px] max-h-[16px]'
				: 'max-w-[164px] max-h-[164px]'}`
			}
			alt={nickname}
			src={avatarUrl}
		/>
	)
}