import { Metadata } from 'next';
import { Typography } from '@repo/ui/src/components/typography.tsx';
import { getRandomMinecraftFact } from '@repo/components/src/forms/auth/queries/get-random-minecraft-fact.ts';
import { MetadataType } from '@repo/types/global';

export const generateMetadata = ({
  searchParams,
}: MetadataType): Metadata => {
  const { type } = searchParams;
  const title = type === 'login'
    ? 'Вход' : type === 'register'
      ? 'Регистрация' : 'Вход';
  
  return { title: title };
};

export default async function AuthPage() {
  const fact = await getRandomMinecraftFact();
  
  return (
    fact && (
      <div
        className="flex gap-1 relative minecraft-panel w-full items-start py-2 px-10 overflow-x-scroll max-w-[1020px]"
      >
        <Typography font="minecraft" className="text-shark-800 text-base font-semibold">
          Факт:
        </Typography>
        <Typography font="minecraft" className="text-shark-800 text-base font-medium whitespace-normal">
          {fact.fact.toString()}
        </Typography>
      </div>
    )
  );
}