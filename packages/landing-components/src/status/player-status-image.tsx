import { useEffect, useState } from "react";
import Image from "next/image";
import { PlayerStatusProps } from "../status/player-status";

type PlayerStatusImageProps = {
	type?: "small" | "full"
} & PlayerStatusProps

const ELY_BY_HEAD_URL = "https://ely.by/services/skins-renderer?url=http://skinsystem.ely.by/skins"

export const PlayerStatusImage = ({
	nickname, type = "small"
}: PlayerStatusImageProps) => {
	const [error, setError] = useState(null)
	
	useEffect(() => {
		setError(null)
	}, [nickname])
	
	return (
		<Image
			height={800}
			width={800}
			className={`${type === 'small'
				? 'max-w-[16px] max-h-[16px]'
				: 'max-w-[164px] max-h-[164px]'}`
			}
			alt={nickname}
			// @ts-ignore
			onError={setError}
			src={error
				? '/images/steve.png'
				: `${ELY_BY_HEAD_URL}/${nickname}.png&scale=18.9&renderFace=1`
			}
		/>
	)
}