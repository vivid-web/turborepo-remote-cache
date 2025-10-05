import * as React from "react";

type Props<T> = React.PropsWithChildren<{
	fallback?: React.ReactNode;
	when: false | null | T | undefined;
}>;

function Show<T>({ when, fallback, children }: Props<T>) {
	if (when) {
		return children;
	}

	return fallback;
}

export { Show };
