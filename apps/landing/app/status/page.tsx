import { MainLayoutPage } from '#/components/layout/main-layout';
import { Block } from '#/ui/block';
import { PlayerStatus } from '#/components/status/player-status';
import { Typography } from '#/ui/typography';
import ky from 'ky';

export const metadata = {
  title: 'Статус',
};

const mockServerStatus: ServerStatusType = {
  online: true,
  host: "mc.example.com",
  port: 25565,
  ip_address: "192.168.1.100",
  eula_blocked: false,
  retrieved_at: Date.now(),
  expires_at: Date.now() + 60000,
  version: {
    name_raw: "1.20.1",
    name_clean: "1.20.1",
    name_html: "1.20.1",
    protocol: 763
  },
  players: {
    online: 5,
    max: 20,
    list: Array.from({ length: 50 }, (_, index) => ({
      uuid: `uuid-${index + 1}`,
      name_raw: `Player${index + 1}`,
      name_clean: `Player${index + 1}`,
      name_html: `<b>Player${index + 1}</b>`
    }))
  },
  motd: {
    raw: "Welcome to the best Minecraft server!",
    clean: "Welcome to the best Minecraft server!",
    html: "<span>Welcome to the <b>best</b> Minecraft server!</span>"
  },
  icon: "data:image/png;base64,<base64_encoded_image_here>",
  mods: [
    {
      name: "ModA",
      version: "1.0.0"
    },
    {
      name: "ModB",
      version: "2.1.3"
    }
  ],
  software: "Paper",
  plugins: [
    {
      name: "PluginA",
      version: "3.2.1"
    },
    {
      name: "PluginB",
      version: "4.0.0"
    }
  ],
  srv_record: {
    host: "srv.mc.example.com",
    port: 25565
  }
};

type ServerStatusType = {
  online: boolean,
  host: string,
  port: number,
  ip_address: string,
  eula_blocked: boolean,
  retrieved_at: number,
  expires_at: number,
  version: {
    name_raw: string,
    name_clean: string,
    name_html: string,
    protocol: number
  }
  players: {
    online: number,
    max: number,
    list: Array<{
      uuid: string,
      name_raw: string,
      name_clean: string,
      name_html: string
    }>
  }
  motd: {
    raw: string,
    clean: string,
    html: string
  },
  icon: string,
  mods: Array<{
    name: string,
    version: string
  }>,
  software: string,
  plugins: Array<{
    name: string,
    version: string
  }>,
  srv_record: {
    host: string,
    port: number
  }
}

export default async function StatusPage() {
  const serverStatus = mockServerStatus
  //   await ky
  // .get('https://api.mcstatus.io/v2/status/java/89.23.177.1:25565')
  // .json<ServerStatusType>()
  
  const isServerOnline = serverStatus.online
  const { list, max: playerMax, online: playerOnline } = serverStatus.players
  
  return (
    <MainLayoutPage variant="with_section">
      <div className="full-screen-section flex items-center justify-center">
        <div className="flex max-h-[500px] justify-start overflow-hidden items-start gap-6 h-full responsive">
          <iframe
            src="https://discord.com/widget?id=958086036393689098&theme=dark"
            width="350"
            height="500"
            // @ts-ignore
            allowtransparency={true.toString()}
            className="!rounded-[12px] w-1/4"
            sandbox="allow-popups allow-popups-to-escape-sandbox allow-same-origin allow-scripts"
          />
          <div className="w-3/4 h-full">
            <div className="rounded-xl max-h-[500px] overflow-hidden block-item p-[2px] w-full">
              <div
                className="flex flex-col max-h-[496px] overflow-y-scroll border-none
                gap-6 p-[2px] rounded-[16px] py-4 bg-background-light dark:bg-background-dark"
              >
                {!isServerOnline && (
                  <Typography className="text-xl px-6 lg:text-2xl">
                    Список игроков недоступен
                  </Typography>
                )}
                {isServerOnline && (
                  <>
                    <Typography className="text-xl px-6 lg:text-2xl">
                      Все игроки: {playerOnline}/{playerMax}
                    </Typography>
                    <div className="flex flex-col px-4 gap-2 h-full">
                      {list.map(({ name_raw, uuid }) =>
                        <PlayerStatus key={uuid} nickname={name_raw} />
                      )}
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayoutPage>
  );
}