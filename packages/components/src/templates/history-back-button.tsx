"use client";

import { useNavigate } from "@tanstack/react-router";
import Spyglass from "@repo/assets/images/minecraft/spyglass.webp";

export const HistoryBackButton = () => {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate({ to: "." })}
      className="flex px-3 gap-1 cursor-pointer items-center hover:bg-secondary-color transition-all duration-150 ease-in max-h-[42px]"
    >
      <img
        src={Spyglass}
        width={48}
        height={48}
        alt="Compass"
        loading="lazy"
        className="max-w-[26px] max-h-[26px]"
      />
      <p className="text-md font-semibold text-shark-200">вернуться</p>
    </div>
  );
};
