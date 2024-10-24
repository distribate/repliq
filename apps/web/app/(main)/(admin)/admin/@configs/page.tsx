import { Typography } from '@repo/ui/src/components/typography.tsx';
import { PageConventionProps } from '@repo/types/config/page-types.ts';
import {
  AuthBackgroundImages
} from '@repo/components/src/admin/components/configs/auth-background/components/auth-bg-images.tsx';

export const dynamic = 'force-dynamic'

export default async function AdminConfigsPage({
  searchParams
}: PageConventionProps) {
  const { section } = searchParams;
  
  if (!section) return null;
  if (section !== 'configs') return null;
  
  return (
    <div className="flex flex-col gap-4 p-2 w-full h-full">
      <Typography className="p-2" textSize="very_big">
        Конфиги
      </Typography>
      <div className="flex h-full w-full gap-4">
        <AuthBackgroundImages/>
      </div>
    </div>
  )
}