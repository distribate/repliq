import { useQuery } from "@tanstack/react-query";
import { getServerIp } from "./get-server-ip";

export const serverIpQuery = () => useQuery({
	queryKey: ["server-ip"],
	queryFn: () => getServerIp(),
	refetchOnWindowFocus: false,
	refetchOnMount: false
})