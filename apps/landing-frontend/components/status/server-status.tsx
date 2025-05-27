import Image from 'next/image';
import { forumSharedClient } from "@repo/shared/api/forum-client";
import { useQuery } from "@tanstack/react-query";

export type Player = {
  uuid: string;
  name_raw: string;
};

async function getServerStatus() {
  const res = await forumSharedClient.shared["get-status"].$get({
    query: { type: "servers" }
  })

  const data = await res.json()

  if (!data || "error" in data) return null;

  return data.data;
}

export const SERVER_STATUS_QUERY_KEY = ["server-status", "global"];

export const serverStatusQuery = () => useQuery({
  queryKey: SERVER_STATUS_QUERY_KEY,
  queryFn: getServerStatus,
  refetchInterval: 60000,
  refetchOnWindowFocus: false,
  retry: 1
});

export const ServerStatus = () => {
  const { data, isLoading } = serverStatusQuery()

  return (
    <div className="rounded-xl p-1 block-item">
      <div className="flex flex-col rounded-xl bg-black/80">
        <div className="flex h-[48px] items-center p-3 rounded-t-xl bg-neutral-950/80">
          <p className="text-bisquite-server-color text-2xl">
            Bisquite Survival
          </p>
        </div>
        <div className="flex flex-col rounded-b-xl overflow-y-auto w-[350px] h-[496px] max-h-[496px] bg-black/80">
          <div className="flex flex-row items-center gap-x-1 py-2 px-3">
            <Image
              alt=""
              width={26}
              height={26}
              className="w-[26px] h-[26px]"
              src="/images/minecraft/icons/search.webp"
              title="Список игроков"
            />
            <p className="text-green-server-color text-xl text-shadow-xl">
              Сейчас играют:
            </p>
          </div>
          <div className="flex flex-col gap-y-1">
            {isLoading ? (
              <p className="py-2 px-4 text-lg md:text-xl">...</p>
            ) : (
              data?.proxy.players?.map((nickname) => (
                <div key={nickname} className="text-white text-xl 
                cursor-pointer rounded-none hover:duration-200 duration-200 hover:bg-neutral-900 py-2 px-4">
                  {nickname}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}