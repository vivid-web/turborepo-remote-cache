import * as React from "react";

export function useSafeContext<T>(
	context: React.Context<T | undefined>,
	options?: {
		errorMessage?: string;
	},
) {
	const value = React.useContext(context);

	const errorMessage = React.useMemo(() => {
		if (options?.errorMessage) {
			return options.errorMessage;
		}

		return "Context is not available. Make sure your component is wrapped correctly.";
	}, [options]);

	if (value === undefined) {
		throw new Error(errorMessage);
	}

	return value;
}
