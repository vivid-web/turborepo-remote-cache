function formatCreatedDate(date: Date) {
	return new Intl.DateTimeFormat(undefined, {
		year: "numeric",
		month: "long",
		day: "numeric",
	}).format(date);
}

export { formatCreatedDate };
