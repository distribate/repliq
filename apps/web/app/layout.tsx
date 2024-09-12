import { Rubik } from 'next/font/google';
import { ReactNode } from 'react';
import { QueryProvider } from '@repo/lib/providers/query-provider';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Toaster } from '@repo/ui/src/components/toaster.tsx';
import { MainPageLoader } from '@repo/ui/src/components/main-page-loader.tsx';
import '@repo/ui/globals.css';

// const font = Rubik({
//   subsets: [ 'latin', 'cyrillic' ],
//   weight: '400'
// })

export async function generateMetadata() {
  return {
    title: {
      template: '%s | Fasberry',
      default: 'Форум | Fasberry',
    },
  };
}

type RootLayoutProps = Readonly<{
  children: ReactNode
}>

export default function RootLayout({
  children,
}: RootLayoutProps) {
  return (
    <html lang="ru">
    <body>
    <MainPageLoader />
    <QueryProvider>
      {children}
        <ReactQueryDevtools />
      <Toaster />
    </QueryProvider>
    </body>
    </html>
  );
}