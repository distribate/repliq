import {
  FriendsSearchingCardActionAdd,
  FriendsSearchingCardActionDeny,
} from "./friends-searching-card-buttons.tsx";
import { FriendsSearchingCardProps } from "./friends-searching-card.tsx";

export const FriendsSearchingCardAction = ({
  nickname: reqUserNickname,
}: Pick<FriendsSearchingCardProps, "nickname">) => {
  return (
    <div
      onClick={(e) => e.stopPropagation()}
      className="opacity-0 absolute -bottom-2 -right-2 flex items-center justify-end w-full
        translate-y-[6px] transition-all ease-in-out duration-300
        group-hover:translate-y-0 group-hover:opacity-100"
    >
      {/* {reqStatus === "default" && (
        <FriendsSearchingCardActionAdd recipient={reqUserNickname} />
      )}
      {reqStatus === "deny" && (
        <FriendsSearchingCardActionDeny recipient={reqUserNickname} />
      )} */}
    </div>
  );
};
