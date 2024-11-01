import { PT_Sans } from 'next/font/google';
import { ReactNode } from 'react';
import { QueryProvider } from '@repo/lib/providers/query-provider';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Toaster } from 'sonner';
import { MainPageLoader } from '@repo/ui/src/components/main-page-loader.tsx';
import '../globals.css';
import '@repo/ui/ui.css';

const font = PT_Sans({
  subsets: [ 'latin', 'cyrillic' ],
  weight: [ '400', '700' ],
});

export async function generateMetadata() {
  return {
    title: {
      template: '%s | Fasberry',
      default: 'Форум | Fasberry',
    },
  };
}

type RootLayoutProps = Readonly<{ children: ReactNode }>

export default function RootLayout({
  children,
}: RootLayoutProps) {
  return (
    <html lang="ru">
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
            error: 'bg-red-400 border-none',
            success: 'bg-emerald-500 text-shark-50 border-none',
            warning: 'text-yellow-400 border-none',
            info: 'bg-blue-400 border-none',
          },
        }}
      />
    </QueryProvider>
    </body>
    </html>
  );
}