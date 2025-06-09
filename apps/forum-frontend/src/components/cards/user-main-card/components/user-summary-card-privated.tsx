import { Typography } from "@repo/ui/src/components/typography"
// import MissingTexture from "@repo/assets/images/minecraft/missing_texture.webp";

export const UserSummaryCardPrivated = () => {
  return (
    <div className="flex w-full items-center justify-center h-full relative z-[4]">
      <div className="flex flex-col items-center gap-6 p-6">
        {/* <img
          src={MissingTexture}
          alt=""
          width={96}
          draggable={false}
          height={96}
        /> */}
        <div className="flex flex-col items-center gap-y-2">
          <Typography className="text-xl text-center font-bold text-shark-50">
            Пользователь предпочел скрыть свою информацию.
          </Typography>
          <Typography className="text-shark-200 text-center text-base">
            Добавьте в друзья, чтобы увидеть содержимое профиля
          </Typography>
        </div>
      </div>
    </div>
  )
}