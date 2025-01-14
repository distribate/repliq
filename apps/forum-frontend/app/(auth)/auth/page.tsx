import { Metadata } from "next";
import { MetadataType } from "@repo/types/global";
import { FactSection } from "@repo/components/src/forms/auth/components/fact-section.tsx";

export const generateMetadata = ({ searchParams }: MetadataType): Metadata => {
  const { type } = searchParams;
  const title =
    type === "login" ? "Вход" : type === "register" ? "Регистрация" : "Вход";

  return { title: title };
};

export default async function AuthPage() {
  return <FactSection />;
}