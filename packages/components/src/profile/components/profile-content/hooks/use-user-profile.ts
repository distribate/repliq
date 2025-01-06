import { getUser } from "@repo/lib/helpers/get-user";
import { useMutation } from "@tanstack/react-query";
import { createProfileView } from "@repo/lib/queries/create-profile-view";
import { toast } from "sonner";

export const useUserProfile = () => {
  const currentUser = getUser();

  const createProfileViewMutation = useMutation({
    mutationFn: async (requestedUserNickname: string) => {
      if (currentUser.nickname === requestedUserNickname) return;

      return createProfileView(currentUser.nickname, requestedUserNickname)
    },
    onSuccess: async (data) => {
      if (!data) return;

      return toast.success("Профиль просмотрен")
    }
  });

  return { createProfileViewMutation };
}