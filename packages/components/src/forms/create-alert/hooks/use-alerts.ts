import { useMutation } from '@tanstack/react-query';
import { createAlert, CreateAlert } from '../queries/create-alert.ts';
import { toast } from '@repo/ui/src/hooks/use-toast.ts';
import { useRouter } from 'next/navigation';
import { deleteAlert } from '../queries/delete-alert.ts';
import { UpdateAlert, updateAlert } from '../queries/update-alert.ts';

export const ALERT_UPDATE_MUTATION_KEY = ["alert-update"]
export const ALERT_CREATE_MUTATION_KEY = ["alert-create"]

export const useAlerts = () => {
  const { refresh } = useRouter()
  
  const addAlertMutation = useMutation({
    mutationKey: ALERT_CREATE_MUTATION_KEY,
    mutationFn: async (values: CreateAlert) => createAlert(values),
    onSuccess: async (data, variables, context) => {
      if (!data) return toast({
        title: "Произошла ошибка при создании объявления",
        variant: "negative"
      })
      
      toast({
        title: "Объявление создано",
        variant: "positive"
      })
      
      return refresh()
    },
    onError: (e) => {
      throw new Error(e.message)
    }
  })
  
  const deleteAlertMutation = useMutation({
    mutationFn: async (alertId: number) => deleteAlert(alertId),
    onSuccess: async (data, variables, context) => {
      if (!data) return toast({
        title: "Произошла ошибка при удалении объявления",
        variant: "negative"
      })
      
      return refresh()
    },
    onError: (e) => {
      throw new Error(e.message)
    }
  })
  
  const updateAlertMutation = useMutation({
    mutationKey: ALERT_UPDATE_MUTATION_KEY,
    mutationFn: async (values: UpdateAlert) => updateAlert(values),
    onSuccess: async (data, variables, context) => {
      if (!data) return toast({
        title: "Произошла ошибка при обновлении",
        variant: "negative"
      })
      
      toast({
        title: "Объявление обновлено",
        variant: "positive"
      })
      
      return refresh()
    },
    onError: (e) => {
      throw new Error(e.message)
    }
  })
  
  return { addAlertMutation, deleteAlertMutation, updateAlertMutation }
}