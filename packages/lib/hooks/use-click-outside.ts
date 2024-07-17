import { useEffect, useRef } from "react";

export default function useOutsideClick(
	handler: () => void
) {
	const ref = useRef(null);
	
	const handleClickOutside = (event: MouseEvent) => {
		if (ref.current) {
			const target = event.target as Node;
			
			// @ts-ignore
			if (ref.current.contains(target)) return;
			
			handler();
		}
	};
	
	useEffect(() => {
		document.addEventListener("click", handleClickOutside, true);
		
		return () => {
			document.removeEventListener("click", handleClickOutside, true);
		};
	}, []);
	
	return { ref };
}