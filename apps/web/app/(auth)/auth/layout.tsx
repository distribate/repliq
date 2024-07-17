import { ReactNode } from "react";
import { PageWrapper } from "@repo/components/src/wrappers/page-wrapper.tsx";
import { getRandomBackground } from "@repo/components/src/forms/auth/queries/get-random-background.ts";
import AuthBackground from "@repo/assets/images/auth_background.webp"
import Link from "next/link";
import { ImageWrapper } from "@repo/components/src/wrappers/image-wrapper.tsx";
import { getCurrentUser } from "@repo/lib/actions/get-current-user.ts";
import { permanentRedirect } from "next/navigation";

type AuthLayoutProps = {
	children: ReactNode
	section: ReactNode
}

const Logotype = () => {
	return (
		<Link href="/" className="relative">
			<div className="flex max-w-[1024px] max-h-[256px] overflow-hidden">
				<ImageWrapper
					propSrc="/images/fasberry_logo.png"
					propAlt="Fasberry"
					width={956}
					height={216}
					loading="eager"
					className="w-full h-full"
				/>
			</div>
		</Link>
	)
}

export default async function AuthLayout({
	children, section
}: AuthLayoutProps) {
	const currentUser = await getCurrentUser();

	const url = await getRandomBackground()
	
	if (currentUser) return permanentRedirect("/auth?type=login");
	
	return (
		<PageWrapper
			withBackground={{ src: url ? url : AuthBackground.src }}
			className="flex flex-col bg-cover py-6 relative"
		>
			<div className="absolute inset-0 bg-black/40"/>
			<Logotype/>
			{section}
			{children}
		</PageWrapper>
	)
}