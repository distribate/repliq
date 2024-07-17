import { useLocalStorage } from "@repo/lib/hooks/use-local-storage.ts";
import { useCallback } from "react";

const PREFERENCES_KEY = "preferences";

type Preferences = {
	autoSaveThreads: boolean,
}

export const usePreferences = () => {
	const [value, setValue] = useLocalStorage<
		Preferences
	>(PREFERENCES_KEY, {
		autoSaveThreads: true
	});
	
	const setAutoSaveThreads = useCallback(() => {
		setValue({
			...value,
			autoSaveThreads: !value.autoSaveThreads
		})
	}, [])
	
	
	
	return { preferences: value, setAutoSaveThreads }
}