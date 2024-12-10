import { useEffect, useState } from "react";
import Image from "next/image";

type NewsImageProps = {
	src: string,
	className?: string
}

export const NewsImage = ({
	src, className
}: NewsImageProps) => {
	const [error, setError] = useState(null);
	
	useEffect(() => { setError(null) }, [src])
	
	return (
		<Image
			loading="lazy"
			width={1920}
			height={1080}
			src={(error || !src ) ? "/images/news/news-placeholder.png" : src}
			// @ts-expect-error
			onError={setError}
			alt={`${src} image`}
			className={`${className}`}
		/>
	)
}