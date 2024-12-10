import { MainLayoutPage } from "#/components/layout/main-layout";
import { Typography } from "#/ui/typography";
import { Block } from "#/ui/block";
import Link from "next/link";

const modsList = [
	{
		client: "Fabric",
		version: "1.20.1",
		content: "Plasmovoice, EmoteCraft, Sodium, IrisShaders, CIT Resewn",
		image: "https://cdn.discordapp.com/attachments/815672776433074196/1188865198270980207/2023-12-25_15.13.02.png?ex=65c0fdff&is=65ae88ff&hm=8591a2151cfece5de77d81b8b8309a7e351780b52477b917515ebdb4845906db&",
		download_link: "https://www.dropbox.com/scl/fi/f92tbs1gffavp2lmdg4sq/Fasberry-1.20.1-PV-Emotes-CIT.zip?rlkey=wh4m26g40gos6q3hnzrf2nwp5&dl=0"
	},
	{
		client: "Fabric",
		version: "1.20.4",
		content: "Plasmovoice, Sodium, IrisShaders, CIT RESEWN",
		image: "https://cdn.discordapp.com/attachments/815672776433074196/1195538381959090216/hell_ye.png?ex=65bd9562&is=65ab2062&hm=3d506787c04ec6ec05ab64927fa329967f221cccac469b2899e20431d14a5587&",
		download_link: "https://www.dropbox.com/scl/fi/sm634rno9g5a43g5cvxpl/Fasberry_1.20.4-PlasmoVoice-Sodium.zip?rlkey=2rw4g8hs9t7py54n8i7ra0oq6&dl=0"
	}
]

export const metadata = {
	title: "Модпак"
}

export default async function WikiModpackPage() {
	return (
		<MainLayoutPage variant="with_section">
			<div className="min-h-screen w-[90%] mx-auto py-36">
				<div className="flex flex-col justify-center items-center mb-6">
					<Typography variant="block_title">
						Сборки модов
					</Typography>
					<Typography size="xl" position="center" className="text-dark-red dark:text-gold">
						Это пока не актуальный список. Следите за новостями!
					</Typography>
				</div>
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 grid-rows-2">
					{modsList.map((item, idx) => (
						<Block key={idx} rounded="big" blockItem size="none" type="column" className="relative gap-y-2">
							<div className="flex flex-col gap-y-2 last:pt-4 justify-between p-2">
								<Typography className="text-xl lg:text-3xl text-[#00cdb0]">
									{item.client}
								</Typography>
								<Typography size="lg">
									Версия: {item.version}
								</Typography>
								<Link href={item.download_link} className="mt-4">
									<Typography size="xl" className="text-wool-light-blue">
										Скачать
									</Typography>
								</Link>
							</div>
							<div className="h-[232px] group bg-cover rounded-xl cursor-pointer"
									 style={{
										 backgroundImage: `url("${item.image}")`
									 }}>
								<div className="group-hover:flex flex-col hidden p-2 absolute bottom-0 right-0 left-0 bg-black/70 rounded-xl h-[232px]">
									<Typography className="text-xl lg:text-2xl text-[#fabbfb]">
										Содержимое:
									</Typography>
									<Typography size="lg">
										{item.content}
									</Typography>
								</div>
							</div>
						</Block>
					))}
				</div>
			</div>
		</MainLayoutPage>
	)
}