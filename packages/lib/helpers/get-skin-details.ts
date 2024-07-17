import { SKIN_GET_HEAD, SKIN_GET_SKIN } from "@repo/shared/constants/routes.ts"

type SkinDetails = {
	type: "skin" | "head",
	nickname: string
}

export function getSkinDetails({
	type, nickname
}: SkinDetails): string {
	switch (type) {
		case "skin":
			return SKIN_GET_SKIN + nickname;
		case "head":
			return SKIN_GET_HEAD + nickname.toLowerCase();
		default:
			throw new Error(`Invalid type: ${type}`);
	}
}