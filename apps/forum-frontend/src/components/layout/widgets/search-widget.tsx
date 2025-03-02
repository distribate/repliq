import { Link } from "@tanstack/react-router";
import Inspector from "@repo/assets/images/minecraft/block_inspect.webp";
import { Typography } from '@repo/ui/src/components/typography';

type SearchWidgetProps = {
  title: string;
  imageSrc: string;
  link: string;
}

export const SearchWidget = ({
  imageSrc, link, title
}: SearchWidgetProps) => {
  return (
    <Link
      to={link}
      className="flex items-center bg-shark-900/60 group overflow-hidden relative rounded-lg"
    >
      <img
        src={imageSrc}
        alt=""
        width={1920}
        height={3413}
        className="w-full h-full group-hover:scale-[1.04] transition-all duration-300 ease-in-out object-cover absolute brightness-75"
      />
      <div className="flex items-center justify-start relative w-full self-end p-4">
        <Typography className="font-semibold font-[Minecraft]" textSize="large">
          {title}
        </Typography>
      </div>
      <img
        src={Inspector}
        alt=""
        className="w-[32px] h-[32px] absolute bottom-4 right-4"
        width={32}
        height={32}
        loading="lazy"
      />
    </Link>
  )
}