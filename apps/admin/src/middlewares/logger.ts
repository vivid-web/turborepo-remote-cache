import { createMiddleware } from "@tanstack/react-start";
import chalk from "chalk";

import { SECOND_IN_MILLISECONDS } from "@/lib/constants";

const INCOMING_PREFIX = "-->";
const OUTGOING_PREFIX = "<--";

function time(start: number) {
	const delta = Date.now() - start;
	const isLessThanOneSecond = delta < SECOND_IN_MILLISECONDS;

	if (isLessThanOneSecond) {
		return `${delta}ms`;
	}

	return `${Math.round(delta / SECOND_IN_MILLISECONDS)}s`;
}

function coloredStatus(status: number) {
	if (status >= 200 && status <= 299) {
		return chalk.green(status);
	}

	if (status >= 300 && status <= 399) {
		return chalk.cyan(status);
	}

	if (status >= 400 && status <= 499) {
		return chalk.yellow(status);
	}

	if (status >= 500 && status <= 599) {
		return chalk.red(status);
	}

	return `${status}`;
}

function logIncoming(method: string, path: string) {
	const out = [INCOMING_PREFIX, method, path].join(" ");

	console.log(out);
}

function logOutgoing(
	method: string,
	path: string,
	status: number,
	elapsed: string,
) {
	const out = [
		OUTGOING_PREFIX,
		method,
		path,
		coloredStatus(status),
		elapsed,
	].join(" ");

	console.log(out);
}

const logger = createMiddleware({ type: "request" }).server(
	async ({ next, request }) => {
		const { method, url } = request;

		const start = Date.now();

		logIncoming(method, url);

		const result = await next();

		const status = result.response.status;

		logOutgoing(method, url, status, time(start));

		return result;
	},
);

export { logger };
