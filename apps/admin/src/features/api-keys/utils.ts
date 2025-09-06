import { formatDistance } from "date-fns";

export function formatCreatedDate(date: Date) {
	return new Intl.DateTimeFormat(undefined, {
		year: "numeric",
		month: "long",
		day: "numeric",
	}).format(date);
}

export function formatLastUsedDate(date: Date | null) {
	if (!date) {
		return "Never";
	}

	return formatDistance(date, new Date(), { addSuffix: true });
}

export function formatExpiresDate(date: Date | null) {
	if (!date) {
		return "Never";
	}

	return formatDistance(date, new Date(), { addSuffix: true });
}

type MaskOptions = {
	maskChar?: string;
	revealLength?: number;
};

export function maskSecret(
	secret: string,
	{ revealLength = 12, maskChar = "•" }: MaskOptions = {},
) {
	const revealed = secret.substring(0, revealLength);
	const hidden = maskChar.repeat(secret.length - revealLength);

	return `${revealed}${hidden}`;
}
