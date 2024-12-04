import { Typography } from "@repo/ui/src/components/typography.tsx";
import { ImageWrapper } from "#wrappers/image-wrapper.tsx";
import { cva, VariantProps } from "class-variance-authority";
import { forwardRef, HTMLAttributes } from "react";
import { useUpdateCurrentUser } from "@repo/lib/hooks/use-update-current-user.ts";
import { MinecraftItemEntity } from "@repo/types/entities/entities-type.ts";
import { getUser } from "@repo/lib/helpers/get-user.ts";

type FavoriteItem = MinecraftItemEntity;

const minecraftItemVariants = cva(
  "flex group relative max-w-[256px] max-h-[112px] overflow-hidden items-center justify-center",
  {
    variants: {
      variant: {
        default: "border-none rounded-md",
        selected: "border-[2px] border-black/50 rounded-none",
      },
    },
  },
);

interface MinecraftItemProps
  extends HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof minecraftItemVariants> {}

const MinecraftItem = forwardRef<HTMLDivElement, MinecraftItemProps>(
  ({ className, variant, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={minecraftItemVariants({ variant, className })}
        {...props}
      />
    );
  },
);

export const FavoriteItem = ({ id, title, image }: FavoriteItem) => {
  const currentUser = getUser();
  const { updateFieldMutation } = useUpdateCurrentUser();

  const handleFavoriteItem = (value: string) => {
    return updateFieldMutation.mutate({ value, field: "favorite_item" });
  };

  const currentFavoriteItem = currentUser.favorite_item
    ? currentUser.favorite_item === id
    : false;

  return (
    <MinecraftItem variant={currentFavoriteItem ? "selected" : "default"}>
      <ImageWrapper
        propSrc={image}
        propAlt={title}
        loading="lazy"
        width={112}
        height={112}
      />
      <div className="flex flex-col items-end p-2 absolute transition-all ease-in w-full h-full bg-black/50 group-hover:opacity-100 opacity-0 bottom-0 left-0">
        <Typography
          className="font-[Minecraft]"
          textColor="shark_white"
          textSize="small"
        >
          {title}
        </Typography>
        {currentFavoriteItem ? (
          <Typography
            className="text-gold-500 font-[Minecraft]"
            textSize="small"
          >
            выбрано
          </Typography>
        ) : (
          <Typography
            onClick={() => handleFavoriteItem(id.toString())}
            className="text-shark-300 hover:text-shark-50 cursor-pointer font-[Minecraft]"
            textSize="small"
          >
            выбрать
          </Typography>
        )}
      </div>
    </MinecraftItem>
  );
};
