import { PT_Sans } from "next/font/google";
import { ReactNode } from "react";
import { QueryProvider } from "@repo/lib/providers/query-provider";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Toaster } from "sonner";
import { MainPageLoader } from "@repo/ui/src/components/main-page-loader.tsx";
import "../globals.css";
import "@repo/ui/ui.css";
import { Metadata } from "next";
import { InfoIcon, WarningIcon, ErrorIcon, SuccessIcon } from "@repo/ui/src/components/toast-icons.tsx";

const font = PT_Sans({
  subsets: ["latin", "cyrillic"],
  weight: ["400", "700"],
});

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: {
      template: "%s | Fasberry",
      default: "Главная | Fasberry",
    },
  };
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ru">
      {/* <head>
        <script src="https://unpkg.com/react-scan/dist/auto.global.js" async />
      </head> */}
      <body className={font.className}>
        <MainPageLoader />
        <QueryProvider>
          {children}
          <ReactQueryDevtools />
          <Toaster
            expand={false}
            position="top-left"
            icons={{
              info: <InfoIcon />,
              success: <SuccessIcon />,
              warning: <WarningIcon />,
              error: <ErrorIcon />,
            }}
            toastOptions={{
              classNames: {
                error: "bg-black/80 text-shark-50 backdrop-blur-lg border-2 border-shark-800 rounded-lg",
                success:
                  "bg-black/80 backdrop-blur-lg text-shark-50 border-2 border-shark-800 rounded-lg",
                warning:
                  "bg-black/80 backdrop-blur-lg text-shark-50 border-2 border-shark-800 rounded-lg",
                info: "bg-black/80 backdrop-blur-lg text-shark-50 border-2 border-shark-800 rounded-lg",
              },
            }}
          />
        </QueryProvider>
      </body>
    </html>
  );
}