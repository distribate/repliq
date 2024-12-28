import { MainLayoutPage } from '@repo/landing-components/src/layout/main-layout';
import { PlayerStatus } from '@repo/landing-components/src/status/player-status';
import { Typography } from '@repo/landing-ui/src/typography';
import ky from 'ky';

export const metadata = {
  title: 'Статус',
};

type ServerStatusType = {
  online: boolean,
  host: string,
  port: number,
  ip_address: string,
  eula_blocked: boolean,
  retrieved_at: number,
  expires_at: number,
  version?: {
    name_raw: string,
    name_clean: string,
    name_html: string,
    protocol: number
  }
  players?: {
    online: number,
    max: number,
    list: Array<{
      uuid: string,
      name_raw: string,
      name_clean: string,
      name_html: string
    }>
  }
  motd?: {
    raw: string,
    clean: string,
    html: string
  },
  icon?: string,
  mods?: Array<{
    name: string,
    version: string
  }>,
  software?: string,
  plugins?: Array<{
    name: string,
    version: string
  }>,
  srv_record: {
    host: string,
    port: number
  } | null
}

const url = `https://api.mcstatus.io/v2/status/java/play.fasberry.su`

export const revalidate = 60

export default async function StatusPage() {
  const serverStatus = await ky.get(url).json<ServerStatusType>()
  
  const isServerOnline = serverStatus.online

  const playersOnline = serverStatus.players?.online
  const playersMax = serverStatus.players?.max
  const playersList = serverStatus.players?.list

  return (
    <MainLayoutPage variant="with_section">
      <div className="full-screen-section flex items-center justify-center">
        <div className="flex max-h-[500px] flex-col lg:flex-row justify-start overflow-hidden items-start gap-6 h-full responsive">
          <iframe
            src="https://discord.com/widget?id=958086036393689098&theme=dark"
            width="350"
            height="500"
            // @ts-ignore
            allowtransparency={true.toString()}
            className="!rounded-[12px] w-full lg:w-1/4"
            sandbox="allow-popups allow-popups-to-escape-sandbox allow-same-origin allow-scripts"
          />
          <div className="w-full lg:w-3/4 h-full">
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
                {(isServerOnline && playersList) && (
                  <>
                    <Typography className="text-xl px-6 lg:text-2xl">
                      Все игроки: {playersOnline}/{playersMax}
                    </Typography>
                    <div className="flex flex-col px-4 gap-2 h-full">
                      {playersList.length === 0 && (
                        <Typography className="px-2">
                          тишина...
                        </Typography>
                      )}
                      {playersList.map(({ name_raw, uuid }) =>
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