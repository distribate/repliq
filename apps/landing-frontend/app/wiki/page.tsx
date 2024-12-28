import { MainLayoutPage } from "@repo/landing-components/src/layout/main-layout";
import { WikiContent } from "@repo/landing-components/src/wiki/content/wiki-content";
import { Suspense } from "react";

export const metadata = {
	title: "Справочник"
}

export default async function WikiPage() {
	return (
		<MainLayoutPage>
			<Suspense>
				<WikiContent/>
			</Suspense>
		</MainLayoutPage>
	)
}