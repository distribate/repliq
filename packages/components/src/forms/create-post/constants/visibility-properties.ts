import { VisibilityPost } from "../queries/post-form-query.ts";

export const visibilityProperties: VisibilityOption[] = [ {
	label: "Видно всем",
	value: "all",
}, {
	label: "Видно только мне",
	value: "only"
}, {
	label: "Только друзьям",
	value: "friends"
} ]

type VisibilityOption = {
	label: string;
	value: VisibilityPost;
};