import * as React from "react";

export function useClickOutside<T extends HTMLElement = HTMLElement>(
	ref: React.RefObject<null | T>,
	handler: () => void,
) {
	const handleClick = (event: MouseEvent) => {
		const target = event.target as Node;

		if (!target.isConnected || ref.current?.contains(target)) {
			return;
		}

		handler();
	};

	React.useEffect(() => {
		document.addEventListener("click", handleClick);

		return () => {
			document.removeEventListener("click", handleClick);
		};
	});
}
