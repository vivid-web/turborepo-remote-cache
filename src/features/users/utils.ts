import { formatDistance } from "date-fns";

function formatCreatedDate(date: Date) {
	return new Intl.DateTimeFormat(undefined, {
		year: "numeric",
		month: "long",
		day: "numeric",
	}).format(date);
}

function formatLastLoginDate(date: Date | null | undefined) {
	if (!date) {
		return "-";
	}

	return formatDistance(date, new Date(), { addSuffix: true });
}

function getAvatarFallback(name: string) {
	return name
		.split(" ")
		.map((n) => n[0])
		.join("");
}

export { formatCreatedDate, formatLastLoginDate, getAvatarFallback };
