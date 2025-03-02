import { Typography } from "@repo/ui/src/components/typography.tsx";
import { MinecraftItemsAddButton } from "./minecraft-items-add-button.tsx";
import { MinecraftItemsDeleteButton } from "./minecraft-items-delete-button.tsx";
import { forumLandingClient } from "@repo/shared/api/forum-client.ts";
import { useQuery } from "@tanstack/react-query";
import { createQueryKey } from "@repo/lib/helpers/query-key-builder.ts";

async function getAvailableMinecraftItems() {
  const res = await forumLandingClient["get-minecraft-items"].$get();

  const data = await res.json();

  if ("error" in data) {
    return null;
  }

  return data.data;
}

const availableMinecraftItemsQuery = () => useQuery({
  queryKey: createQueryKey("ui", ["available-minecraft-items"]),
  queryFn: () => getAvailableMinecraftItems(),
  refetchOnWindowFocus: false
})

export const MinecraftItemsList = () => {
  const { data: availableMinecraftItems } = availableMinecraftItemsQuery();

  return (
    <div
      id="minecraft-items-list"
      className="grid grid-cols-8 auto-rows-auto gap-2 justify-items-stretch w-full h-full"
    >
      {availableMinecraftItems?.map((item) => (
        <div
          key={item.title}
          title={item.description || ""}
          className="relative group w-full max-h-[96px] rounded-md overflow-hidden"
        >
          <img
            key={item.id}
            src={item.image}
            alt={item.title}
            width={96}
            loading="lazy"
            height={96}
            className="w-full h-full"
          />
          <div className="flex justify-start items-end p-2 absolute transition-all ease-in w-full h-full bg-black/50 group-hover:opacity-100 opacity-0 bottom-0 left-0">
            <Typography
              className="font-[Minecraft]"
              textColor="shark_white"
              textSize="small"
            >
              {item.title}
            </Typography>
          </div>
          <MinecraftItemsDeleteButton image={item.image} id={Number(item.id)} />
        </div>
      ))}
      <MinecraftItemsAddButton />
    </div>
  );
};