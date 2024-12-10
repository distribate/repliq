import { Typography } from "#/ui/typography";
import Image from "next/image"
import Link from "next/link"

export const Footer = () => {
	return (
		<footer
			className="sticky flex-col flex justify-center items-center gap-6 pt-10 pb-6 bg-[url('/images/static/bedrock.png')]"
			style={{ backgroundSize: '160px' }}
		>
			<div className="flex flex-col lg:flex-row justify-between gap-y-6 items-center w-[85%] mx-auto">
				<Link href="/" className="overflow-hidden">
					<Image
						width={316}
						height={128}
						alt="Fasberry Project Logo"
						src="/images/fasberry_logo.png"
						className="relative right-10 top-2 cursor-pointer"
						loading="lazy"
					/>
				</Link>
				<div className="flex flex-col gap-2">
					<Typography size="md">
						Все права защищены. Оригинальные права принадлежат Mojang AB.
					</Typography>
					<a href="https://pureawake-studio.su" target='_blank' className="self-center lg:self-end">
						<div
							className="flex items-center gap-x-2">
							<img
								src="https://i.ibb.co/c8sVb5j/favicon-transparent.png"
								alt=" "
								width="20"
								height="20"
							/>
							<p className="text-sm text-white">
								dev by
							</p>
						</div>
					</a>
				</div>
			</div>
			<div className="flex flex-col justify-center items-center lg:flex-row gap-4 w-full">
				<Link href="/info/privacy">
					<Typography className="cursor-pointer text-white text-md decoration-bisquite-server-color">
						Политика конфиденциальности
					</Typography>
				</Link>
				<span className="text-white hidden lg:block">/</span>
				<Link href="/info/terms">
					<Typography className="cursor-pointer text-white text-md decoration-bisquite-server-color">
						Пользовательское соглашение
					</Typography>
				</Link>
				<span className="text-white hidden lg:block">/</span>
				<Link href="/info/contacts">
					<Typography className="cursor-pointer text-white text-md decoration-bisquite-server-color">
						Контакты
					</Typography>
				</Link>
			</div>
		</footer>
	)
}