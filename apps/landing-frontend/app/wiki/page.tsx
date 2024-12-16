import { MainLayoutPage } from "#/components/layout/main-layout";
import { WikiContent } from "#/components/wiki/content/wiki-content";
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