import { ReactNode } from 'react';
import { PageWrapper } from '@repo/components/src/wrappers/page-wrapper.tsx';
import AuthBackground from '@repo/assets/images/auth_background.webp';
import { ImageWrapper } from '@repo/components/src/wrappers/image-wrapper.tsx';
import { permanentRedirect } from 'next/navigation';
import { AUTH_REDIRECT } from '@repo/shared/constants/routes.ts';
import { getRandomAuthBackground } from '@repo/components/src/forms/auth/queries/get-random-auth-background.ts';
import { getCurrentSession } from '@repo/lib/actions/get-current-session.ts';

type AuthLayoutProps = {
  children: ReactNode
  section: ReactNode
}

export default async function AuthLayout({
  children, section
}: AuthLayoutProps) {
  const { user: currentUser } = await getCurrentSession();
  const url = await getRandomAuthBackground();
	
  if (currentUser) {
    return permanentRedirect(AUTH_REDIRECT);
  }
  
  const authImage = url ? url : AuthBackground.src;
  
  return (
	  <PageWrapper
		  withBackground={{ src: authImage }}
		  className="flex flex-col bg-cover py-6 relative"
	  >
		  <div className="absolute inset-0 bg-black/40" />
		  <div className="flex relative max-w-[1024px] max-h-[256px] overflow-hidden">
			  <ImageWrapper
				  propSrc="/images/fasberry_logo.png"
				  propAlt="Fasberry"
				  width={956}
				  height={216}
				  loading="eager"
				  className="w-full h-full"
			  />
		  </div>
		  {section}
		  {children}
	  </PageWrapper>
  );
}