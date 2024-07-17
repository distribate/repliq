import { SignUpForm } from "@repo/components/src/forms/auth/components/sign-up.tsx";
import { PageConventionProps } from "@repo/types/config/page-types.ts"
import { redirect } from "next/navigation";
import { SignInForm } from "@repo/components/src/forms/auth/components/sign-in.tsx";

export default async function AuthSectionPage({
	searchParams
}: PageConventionProps) {
	const { type } = searchParams;

	const isSignIn = type === 'login';
	const isSignUp = type === 'register'
	
	if (!type || (!isSignIn && !isSignUp)) redirect("/auth?type=login");
	
	return (
		<div className="flex flex-col p-8 min-h-[320px] -mt-8 max-h-[540px] gap-y-6 min-w-[200px] max-w-[1020px] bg-shark-300 outline-none relative
				shadow-[inset_4px_-4px_1px_rgba(0,0,0,0.4),inset_-4px_4px_1px_rgba(255,255,255,0.4)] mb-6 *:font-[Minecraft] animate-fadein overflow-y-scroll"
		>
			{isSignIn && <SignInForm/>}
			{isSignUp && <SignUpForm/>}
		</div>
	)
}