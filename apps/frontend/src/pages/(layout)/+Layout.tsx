import { MainLayout } from "#components/layout/components/default/layout";
import { PropsWithChildren } from "react";

export default function Layout({ children }: PropsWithChildren) {
  return (
    <MainLayout>
      {children}
    </MainLayout>
  )
}