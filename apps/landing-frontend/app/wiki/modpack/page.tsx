import { MainLayoutPage } from '@repo/landing-components/src/layout/main-layout';
import { Typography } from '@repo/landing-ui/src/typography';
import { ModpackList } from '@repo/landing-components/src/modpacks/modpack-list.tsx';

export const metadata = {
  title: 'Модпак',
};

export default async function WikiModpackPage() {
  return (
    <MainLayoutPage variant="with_section">
      <div className="min-h-screen w-[90%] mx-auto py-36">
        <div className="flex flex-col justify-center items-center mb-6">
          <Typography variant="block_title">
            Сборки модов
          </Typography>
        </div>
        <ModpackList />
      </div>
    </MainLayoutPage>
  );
}