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
			const target = event.target as HTMLElement;

			// 1. If clicking inside a portalled Radix select dropdown/content, ignore
			if (
				target &&
				(target.closest('[data-slot="select-content"]') ||
					target.closest('[data-radix-select-viewport]'))
			) {
				return;
			}

			// 2. If the clicked element is disconnected/unmounted from the DOM, ignore it
			if (target && !target.isConnected) {
				return;
			}

			// 3. Coordinate-based check: if the click is physically inside the modal container, ignore it
			if (ref.current) {
				const rect = ref.current.getBoundingClientRect();
				const isInsideModal =
					event.clientX >= rect.left &&
					event.clientX <= rect.right &&
					event.clientY >= rect.top &&
					event.clientY <= rect.bottom;

				if (isInsideModal) {
					return;
				}
			}

			// 4. Containment-based check fallback
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
