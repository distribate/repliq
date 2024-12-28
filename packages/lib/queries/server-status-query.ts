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
    try {
        return await ky(`https://api.mcstatus.io/v2/status/java/play.fasberry.su:${port}`).json<Status>()
    } catch (e) {
        throw e
    }
}

export const serverStatusQuery = (
    port: number
) => useQuery({
    queryKey: [ "server-status", port ],
    queryFn: async() => getServerStatus(port),
    retry: 1,
    refetchInterval: 60000
})