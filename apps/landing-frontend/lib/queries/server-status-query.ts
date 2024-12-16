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

const SERVER_STATUS_QUERY_KEY = [ "server-status" ]

async function getServerStatus(port: string) {
	try {
		return await ky(`${process.env.MONITORING_API_URL}:${port}`).json<Status>()
	} catch (e) {
		throw e;
	}
}

export const serverStatusQuery = (port: string) => useQuery({
	queryKey: SERVER_STATUS_QUERY_KEY,
	queryFn: async() => getServerStatus(port),
	retry: 1,
	refetchInterval: 120000, // 2 minutes
})