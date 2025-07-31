class InvariantError extends Error {
	constructor(message: string) {
		super(message);

		Object.setPrototypeOf(this, InvariantError.prototype);
	}
}

function invariant(
	condition: unknown,
	message: (() => string) | string,
): asserts condition {
	if (condition) {
		return;
	}

	const derivedMessage = typeof message === "function" ? message() : message;

	throw new InvariantError(derivedMessage);
}

export { invariant, InvariantError };
