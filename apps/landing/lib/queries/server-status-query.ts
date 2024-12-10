import { useQuery } from "@tanstack/react-query";

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

async function getServerStatus(port?: string): Promise<Status> {
	return await fetch(`${process.env.MONITORING_API_URL}:` + port)
	.then((res: Response): Promise<Status> => res.json())
	.catch(err => err.message);
}

export const serverStatusQuery = (port?: string) => useQuery({
	queryKey: SERVER_STATUS_QUERY_KEY,
	queryFn: async() => getServerStatus(port),
	refetchInterval: 120000, // 2 minutes
  enabled: !!port
})