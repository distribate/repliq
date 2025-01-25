import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { useRouter } from "@tanstack/react-router";
import { deleteAlert } from "../queries/delete-alert.ts";
import { UpdateAlert, updateAlert } from "../queries/update-alert.ts";
import { AlertEntity } from "@repo/types/entities/entities-type.ts";

export type CreateAlert = Omit<AlertEntity, "id" | "created_at" | "creator">;

export const ALERT_UPDATE_MUTATION_KEY = ["alert-update"];
export const ALERT_CREATE_MUTATION_KEY = ["alert-create"];

export const useAlerts = () => {
  const { invalidate } = useRouter();

  const addAlertMutation = useMutation({
    mutationKey: ALERT_CREATE_MUTATION_KEY,
    mutationFn: async (values: CreateAlert) => null,
    onSuccess: async (data) => {
      // if (!data) return toast.error("Произошла ошибка при создании объявления");

      // toast.success("Объявление создано");

      // return invalidate();
    },
    onError: (e) => {
      throw new Error(e.message);
    },
  });

  const deleteAlertMutation = useMutation({
    mutationFn: async (alertId: number) => deleteAlert(alertId),
    onSuccess: async (data) => {
      if (!data) return toast.error("Произошла ошибка при удалении объявления");

      return invalidate();
    },
    onError: (e) => {
      throw new Error(e.message);
    },
  });

  const updateAlertMutation = useMutation({
    mutationKey: ALERT_UPDATE_MUTATION_KEY,
    mutationFn: async (values: UpdateAlert) => updateAlert(values),
    onSuccess: async (data) => {
      if (!data) return toast.error("Произошла ошибка при обновлении");

      toast.success("Объявление обновлено");

      return invalidate();
    },
    onError: (e) => {
      throw new Error(e.message);
    },
  });

  return { addAlertMutation, deleteAlertMutation, updateAlertMutation };
};
