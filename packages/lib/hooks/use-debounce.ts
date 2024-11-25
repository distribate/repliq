import { useCallback, useRef } from 'react';

export function useDebounce<T extends (...args: any[]) => void>(
	func: T, delay: number
): (...args: Parameters<T>) => void {
	const timeoutRef = useRef<NodeJS.Timeout | null>(null);
	
	return useCallback((...args: Parameters<T>) => {
		if (timeoutRef.current) {
			clearTimeout(timeoutRef.current);
		}
		
		// @ts-ignore
		timeoutRef.current = setTimeout(() => {
			func(...args);
		}, delay);
	}, [ func, delay ]);
}