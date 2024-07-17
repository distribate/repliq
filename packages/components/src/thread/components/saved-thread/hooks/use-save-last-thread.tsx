"use client"

import { useLocalStorage } from "@repo/lib/hooks/use-local-storage.ts";
import { useCallback } from "react";
import { SavedThreadType } from "../types/saved-thread-types.ts";
import {
	usePreferences
} from "../../../../cards/components/user-personal-card/components/advanced-settings/hooks/use-preferences.ts";

export const SAVED_LAST_THREADS_KEY = "last-threads";

export const useSaveLastThread = () => {
	const [value, setValue, removeValue] = useLocalStorage<
		SavedThreadType[]
	>(SAVED_LAST_THREADS_KEY, [])
	
	const { preferences } = usePreferences()
	
	const saveThread = useCallback(({
		id, nickname, title
	}: SavedThreadType) => {
		if (!preferences.autoSaveThreads) return;
		
		let threadObjects: SavedThreadType[];
		
		const exists = value.some(
			item => item.id === id
		);
		
		if (exists) return;
		
		if (value.length < 3) {
			threadObjects = [
				...value, { id, nickname, title }
			]
		} else {
			threadObjects = [
				...value.slice(1), { id, title, nickname }
			]
		}
		
		setValue(threadObjects);
	}, [ setValue, value, preferences.autoSaveThreads ])
	
	const deleteThread = ({ id }: Pick<SavedThreadType, "id">) => {
		const exists = value.some(
			item => item.id === id
		);
		
		if (!exists) return;
		
		const threadObjects = value.filter(
			item => item.id !== id
		);
		
		setValue(threadObjects)
	}
	
	return { saveThread, deleteThread, savedTopics: value  }
}