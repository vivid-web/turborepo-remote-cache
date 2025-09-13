export class InvariantError extends Error {
	constructor(message: string) {
		super(message);

		Object.setPrototypeOf(this, InvariantError.prototype);
	}
}
