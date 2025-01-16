import { useQuery } from "@tanstack/react-query";
import ky from 'ky';

export type Player = {
  uuid: string;
  name_raw: string;
};

type Status = {
  online: boolean;
  players: {
    online: number;
    max: number;
    list: Player[];
  };
};

async function getServerStatus(port: number) {
  const res = await ky(`https://api.mcstatus.io/v2/status/java/mc.fasberry.su:${port}`).json<Status>();

  return res;
}

export const serverStatusQuery = (port: number) => useQuery({
  queryKey: ["server-status", port],
  queryFn: () => getServerStatus(port),
  refetchInterval: 60000
});