import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "@repo/ui/src/hooks/use-toast.ts";
import {
	deleteImageFromBucket, uploadImageToBucket
} from "@repo/lib/utils/storage/upload-image-to-bucket.ts";
import { updateValueOfUploadedImage } from "@repo/lib/utils/storage/update-value-uploaded-image.ts";
import { IMAGE_COVER_QUERY_KEY } from "../queries/image-cover-query.ts";
import { nanoid } from "nanoid"
import { CURRENT_USER_QUERY_KEY, currentUserQuery } from "@repo/lib/queries/current-user-query.ts";
import { REQUESTED_USER_QUERY_KEY } from "@repo/lib/queries/requested-user-query.ts";
import { USER_IMAGES_BUCKET } from "@repo/shared/constants/buckets.ts"
import { createTask, registerTaskQueue } from "@repo/lib/helpers/create-task-delay.ts";
import { useDialog } from "@repo/lib/hooks/use-dialog.ts";
import { deletePrevImageFromUsers } from "./delete-prev-image.ts";

type BackgroundImage = {
	file: File | null
} & Partial<{
	customFilename: string
}>

export const useControlCoverImage = () => {
	const qc = useQueryClient()
	const { removeDialogMutation } = useDialog();
	const { data: currentUser } = currentUserQuery()
	
	const handleSuccess = async() => {
		if (currentUser) {
			await Promise.all([
				qc.invalidateQueries({
					queryKey: REQUESTED_USER_QUERY_KEY(currentUser.nickname)
				}),
				qc.invalidateQueries({
					queryKey: CURRENT_USER_QUERY_KEY
				})
			])
			
			const tasks = [
				createTask(async() => {
					await qc.invalidateQueries({
						queryKey: IMAGE_COVER_QUERY_KEY(currentUser.nickname)
					});
				}, 1000)
			];
			
			registerTaskQueue(tasks);
		}
	}
	
	const deleteBackgroundImageMutation = useMutation({
		onMutate: () => {
			removeDialogMutation.mutate({
				dialogName: "profile-background-update"
			})
		},
		mutationFn: async() => {
			if (!currentUser) return null;
			
			const data = await deletePrevImageFromUsers({
				userId: currentUser.id
			});
			
			if (data) {
				const result = await deleteImageFromBucket({
					bucket: USER_IMAGES_BUCKET, userId: currentUser.id
				})
				
				if (!result) {
					toast({
						title: "Произошла ошибка при удалении фона. Попробуй позже!", variant: "negative"
					})
					
					return result;
				}
				
				toast({
					title: "Фон удалён.", variant: "positive"
				})
				
				return result;
			}
			
			toast({
				title: "Произошла ошибка при удалении фона. Попробуй позже!", variant: "negative"
			})
			
			return false;
		}, onSuccess: async(data) => {
			if (data) {
				return handleSuccess()
			}
		}, onError: (e) => {
			console.log(e);
			throw e;
		}
	})
	
	const uploadBackgroundImageMutation = useMutation({
		onMutate: () => {
			removeDialogMutation.mutate({
				dialogName: "profile-background-update"
			})
		},
		mutationFn: async({
			file, customFilename
		}: BackgroundImage) => {
			if (!currentUser) return;
			
			// if upload to existing image from storage (static)
			if (customFilename) {
				const success = await updateValueOfUploadedImage({
					table: "users",
					field: { "cover_image": customFilename },
					equals: { column: "id", value: currentUser.id }
				})
				
				if (!success) {
					toast({
						title: "Произошла ошибка при обновлении фона. Попробуйте позже!", variant: "negative"
					});
				}
				
				toast({
					title: "Фон успешно обновлен!"
				});
				
				return { success };
			}
			
			// if custom image from user
			if (!file) {
				toast({
					title: "Выберите файл для фона!", variant: "negative"
				})
				
				return;
			}
			
			const uniqueId = nanoid()
			const fileName = currentUser.id + uniqueId;
			
			if (!fileName) return;
			
			const [ deletedPrev, data ] = await Promise.all(
				[
					deleteImageFromBucket({
						bucket: USER_IMAGES_BUCKET, userId: currentUser.id
					}),
					uploadImageToBucket({
						bucket: USER_IMAGES_BUCKET, folder: "cover",
						file: file, fileName: fileName
					})
				])
			
			if (!deletedPrev) {
				toast({
					title: "Произошла ошибка при обновлении фона. Попробуйте позже!", variant: "negative"
				});
				
				return;
			}
			
			if (data.error) {
				toast({
					title: "Произошла ошибка при обновлении фона. Попробуйте позже!",
					variant: "negative",
					description: <p>{data.error.message}</p>
				});
				
				return;
			}
			
			if (data.path) {
				const success = await updateValueOfUploadedImage({
					table: "users",
					field: { "cover_image": data.path },
					equals: { column: "id", value: currentUser.id }
				})
				
				if (!success) {
					toast({
						title: "Произошла ошибка при обновлении фона. Попробуйте позже!"
					});
					
					return;
				}
				
				toast({
					title: "Фон успешно обновлен!"
				});
				
				return { success, path: data.path }
			}
		},
		onSuccess: async(data) => {
			if (data) {
				return handleSuccess()
			}
		},
		onError: (e) => {
			throw new Error(e.message);
		}
	})
	
	return { uploadBackgroundImageMutation, deleteBackgroundImageMutation }
}