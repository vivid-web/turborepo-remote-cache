import { InvariantError } from "./invariant-error.js";

export function invariant(
	condition: unknown,
	message: (() => string) | string,
): asserts condition {
	if (condition) {
		return;
	}

	const derivedMessage = typeof message === "function" ? message() : message;

	throw new InvariantError(derivedMessage);
}
