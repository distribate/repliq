import { useMutation } from "@tanstack/react-query";
import { createAlert, CreateAlert } from "../queries/create-alert.ts";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { deleteAlert } from "../queries/delete-alert.ts";
import { UpdateAlert, updateAlert } from "../queries/update-alert.ts";

export const ALERT_UPDATE_MUTATION_KEY = ["alert-update"];
export const ALERT_CREATE_MUTATION_KEY = ["alert-create"];

export const useAlerts = () => {
  const { refresh } = useRouter();

  const addAlertMutation = useMutation({
    mutationKey: ALERT_CREATE_MUTATION_KEY,
    mutationFn: async (values: CreateAlert) => createAlert(values),
    onSuccess: async (data) => {
      if (!data) return toast.error("Произошла ошибка при создании объявления");

      toast.success("Объявление создано");

      return refresh();
    },
    onError: (e) => {
      throw new Error(e.message);
    },
  });

  const deleteAlertMutation = useMutation({
    mutationFn: async (alertId: number) => deleteAlert(alertId),
    onSuccess: async (data) => {
      if (!data) return toast.error("Произошла ошибка при удалении объявления");

      return refresh();
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

      return refresh();
    },
    onError: (e) => {
      throw new Error(e.message);
    },
  });

  return { addAlertMutation, deleteAlertMutation, updateAlertMutation };
};
