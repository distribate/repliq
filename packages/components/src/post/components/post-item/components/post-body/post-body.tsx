import { Typography } from '@repo/ui/src/components/typography.tsx';

type PostItemBodyProps = {
	content: string | null;
}

export const PostItemBody = ({
	content
}: PostItemBodyProps) => {
	if (!content) return null;
	return (
		<div className="flex w-full">
			<Typography>{content}</Typography>
		</div>
	)
}