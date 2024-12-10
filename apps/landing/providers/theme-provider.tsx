"use client"

import { ReactNode } from "react";
import { ThemeProvider } from "next-themes";

export const NextThemeProvider = ({
	children
}: {
	children: ReactNode
}) => {
	return (
		<ThemeProvider attribute="class" defaultTheme="dark" disableTransitionOnChange enableSystem>
			{children}
		</ThemeProvider>
	)
}