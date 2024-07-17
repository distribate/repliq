import { useMutation, useQueryClient } from "@tanstack/react-query";
import { REPORT_QUERY_KEY, ReportQuery } from "../../../../../report/queries/report-query.ts";
import { postReport } from "../../../../../report/queries/post-report.ts";
import { toast } from "@repo/ui/src/hooks/use-toast.ts";

export const useCreateReport = () => {
	const qc = useQueryClient();
	
	const updateReportValuesMutation = useMutation({
		mutationFn: async(
			values: ReportQuery
		) => {
			if (!values) return;
			
			const {
				type,
				reason,
				reportedItem
			} = values;
			
			if (!type) return;
			
			qc.setQueryData(
				REPORT_QUERY_KEY(type),
				(prev: ReportQuery) => {
					return {
						...prev,
						reason: reason ?? prev.reason,
						type: type ?? prev.type,
						reportedItem: reportedItem ?? prev.reportedItem
					}
				}
			)
		},
		onSuccess: async (data, variables) => {
			if (!variables || !variables.type) return;
			
			await qc.invalidateQueries({
				queryKey: REPORT_QUERY_KEY(variables.type)
			})
		},
		onError: (e) => {
			console.error(e.message)
			throw new Error(e.message)
		}
	})
	
	const createReportMutation = useMutation({
		mutationFn: async(
			values: Pick<ReportQuery, "type">
		) => {
			if (!values) return;
			
			if (!values.type) return;
			
			const reportState = qc.getQueryData<ReportQuery>(
				REPORT_QUERY_KEY(values.type)
			);
			
			if (!reportState) return;
			
			const {
				reportedItem,
				type,
				reason
			} = reportState
			
			if (!type || !reportedItem || !reason) return;
			
			const data = await postReport({
				report_type: type,
				target_content: reportedItem.target_content,
				target_id: reportedItem.target_id,
				target_nickname: reportedItem.target_nickname,
				target_user_nickname: reportedItem.target_nickname,
				reason: reason
			})
			
			if (!data) {
				toast({
					title: "Что-то пошло не так",
					variant: "negative"
				})
			}
			
			return data;
		},
		onSuccess: async (data, variables, context) => {
			if (!variables || !variables.type) return;
			
			if (data) {
				toast({
					title: "Заявка создана",
					variant: "positive"
				})
			}
			
			await qc.resetQueries({
				queryKey: REPORT_QUERY_KEY(variables.type)
			})
		},
		onError: (e) => {
			console.error(e.message)
			throw new Error(e.message)
		}
	})
	
	return {
		updateReportValuesMutation,
		createReportMutation
	}
}