import { PT_Sans } from 'next/font/google';
import { ReactNode } from 'react';
import { QueryProvider } from '@repo/lib/providers/query-provider';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Toaster } from 'sonner';
import { MainPageLoader } from '@repo/ui/src/components/main-page-loader.tsx';
import '../globals.css';
import '@repo/ui/ui.css';
import { Metadata } from 'next';

const font = PT_Sans({
  subsets: [ 'latin', 'cyrillic' ],
  weight: [ '400', '700' ],
});

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: {
      template: '%s | Fasberry',
      default: 'Форум | Fasberry',
    }
  };
}

export default function RootLayout({
  children,
}: { children: ReactNode }) {
  return (
    <html lang="ru">
    {/*<head>*/}
    {/*  <script src="https://unpkg.com/react-scan/dist/auto.global.js" async />*/}
    {/*</head>*/}
    <body className={font.className}>
    <MainPageLoader />
    <QueryProvider>
      {children}
      <ReactQueryDevtools />
      <Toaster
        expand={false}
        position="bottom-center"
        toastOptions={{
          classNames: {
            error: 'bg-red-400/80 backdrop-blur-lg border-none',
            success: 'bg-emerald-500/80 backdrop-blur-lg text-shark-50 border-none',
            warning: 'bg-shark-900/80 backdrop-blur-lg text-yellow-400 border-none',
            info: 'bg-blue-400/80 backdrop-blur-lg border-none',
          },
        }}
      />
    </QueryProvider>
    </body>
    </html>
  );
}