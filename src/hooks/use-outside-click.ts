// @ts-nocheck

import { useEffect, RefObject } from "react";

interface UseOutsideClickProps {
	ref: RefObject<HTMLElement>;
	callback: () => void;
	excludedRef?: RefObject<HTMLElement>;
}

export const useOutsideClick = ({
	ref,
	callback,
	excludedRef,
}: UseOutsideClickProps) => {
	useEffect(() => {
		function handleClickOutside(event: MouseEvent) {
			if (
				ref.current &&
				!ref.current.contains(event.target as Node) &&
				!(
					excludedRef &&
					excludedRef.current?.contains(event.target as Node)
				)
			) {
				callback();
			}
		}

		document.addEventListener("mousedown", handleClickOutside);
		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, [ref, callback, excludedRef]);
};
