import { ReactNode } from "react";
import { PageWrapper } from "@repo/components/src/wrappers/page-wrapper.tsx";
import { permanentRedirect } from "next/navigation";
import { getCurrentSession } from "@repo/lib/actions/get-current-session.ts";
import Image from "next/image";
import { AuthImage } from "@repo/components/src/forms/auth/components/auth-image.tsx";

type AuthLayoutProps = {
  children: ReactNode;
  section: ReactNode;
};

export default async function AuthLayout({
  children,
  section,
}: AuthLayoutProps) {
  const { user: currentUser } = await getCurrentSession();

  if (currentUser) {
    return permanentRedirect("/");
  }

  return (
    <PageWrapper className="flex flex-col bg-cover py-6 relative">
      <AuthImage/>
      <div className="absolute inset-0 bg-black/40" />
      <div className="flex relative max-w-[1024px] max-h-[256px] overflow-hidden">
        <Image
          src="/images/fasberry_logo.png"
          alt="Fasberry"
          width={956}
          height={216}
          loading="lazy"
          className="w-full h-full"
        />
      </div>
      {section}
      {children}
    </PageWrapper>
  );
}