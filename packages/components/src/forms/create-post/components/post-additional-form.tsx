import { Select, SelectContent, SelectItem, SelectTrigger } from "@repo/ui/src/components/select.tsx";
import { Typography } from "@repo/ui/src/components/typography.tsx";
import { usePostFormControl } from "../hooks/use-post-form-control.ts";
import { postFormQuery, VisibilityPost } from "../queries/post-form-query.ts";
import { visibilityProperties } from "../constants/visibility-properties.ts";

export const PostAdditionalForm = () => {
	const { postFormFieldsMutation } = usePostFormControl()
	const { data: fieldQuery } = postFormQuery()
	
	const handleVisiblityOption = (type: VisibilityPost) => {
		return postFormFieldsMutation.mutate({ visibility: type })
	}
	
	const visibilityCurrent = fieldQuery.visibility || "all";
	
	const currentVisibilityOption = visibilityProperties.find(
		option => option.value === visibilityCurrent
	);
	
	return (
		<Select
			defaultValue={visibilityCurrent}
			onValueChange={(value: VisibilityPost) => handleVisiblityOption(value)}
		>
			<SelectTrigger className="w-fit">
				<Typography textShadow="small" className="text-md text-shark-50">
					{currentVisibilityOption ? currentVisibilityOption.label : ''}
				</Typography>
			</SelectTrigger>
			<SelectContent className="max-w-[420px]">
				{visibilityProperties.map((property, i) => (
					<SelectItem key={i} value={property.value}>
						{property.label}
					</SelectItem>
				))}
			</SelectContent>
		</Select>
	)
}