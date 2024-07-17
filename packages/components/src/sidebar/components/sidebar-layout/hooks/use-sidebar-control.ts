import {
	SIDEBAR_LAYOUT_QUERY_KEY,
	SidebarQuery,
	sidebarLayoutQuery, SidebarFormat
} from "../queries/sidebar-layout-query.ts";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocalStorage } from "@repo/lib/hooks/use-local-storage.ts";

export const SIDEBAR_FORMAT_KEY = 'layouts'
export const SIDEBAR_DEFAULT_SIZE = 12.1;

type SidebarMutation = {
	type: "width" | "format",
	values: SidebarQuery
}

export const useSidebarControl = () => {
	const qc = useQueryClient();
	const { data: sidebarState } = sidebarLayoutQuery()
	const [value, setValue] = useLocalStorage<{
		format: SidebarFormat
	}>(SIDEBAR_FORMAT_KEY, { format: "dynamic" })
	
	const isExpanded = sidebarState.width ? sidebarState.width > 11 : false;
	const isDynamic = value.format === 'dynamic';
	const isFull = value.format === 'full' && !isDynamic;
	const isCompact = value.format === 'compact' && !isFull && !isDynamic
	
	const updateSidebarPropertiesMutation = useMutation({
		mutationFn: async({ values, type }: SidebarMutation) => {
			if (!values || !type) return;
			
			if (type === 'format' && values.format) {
				qc.setQueryData(
					SIDEBAR_LAYOUT_QUERY_KEY, (prev: SidebarQuery) => {
						return { ...prev, format: values.format, width: SIDEBAR_DEFAULT_SIZE }
					}
				)
				
				setValue({ format: values.format })
			}
			
			if (type === 'width') {
				qc.setQueryData(SIDEBAR_LAYOUT_QUERY_KEY, (prev: SidebarQuery) => {
					return { ...prev, ...values }
				})
			}
		},
		onSuccess: async() => {
			await qc.invalidateQueries({ queryKey: SIDEBAR_LAYOUT_QUERY_KEY })
		},
		onError: (e) => { throw new Error(e.message) }
	})
	
	return { updateSidebarPropertiesMutation, isExpanded, isDynamic, isFull, isCompact }
}