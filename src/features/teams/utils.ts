function formatCreatedDate(date: Date) {
	return new Intl.DateTimeFormat(undefined, {
		year: "numeric",
		month: "long",
		day: "numeric",
	}).format(date);
}

function getAvatarFallback(name: string) {
	return name
		.split(" ")
		.map((n) => n[0])
		.join("");
}

export { formatCreatedDate, getAvatarFallback };
