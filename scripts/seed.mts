// eslint-disable-next-line @typescript-eslint/require-await
async function run() {
	console.log("🌱 Seeding...");
	console.time(`🌱 Database has been seeded`);

	console.time("🧹 Cleaned up the database...");

	// Nothing to migrate...

	console.timeEnd("🧹 Cleaned up the database...");

	console.timeEnd(`🌱 Database has been seeded`);
}

try {
	await run();
} catch (e) {
	console.error(e);
	process.exit(1);
}
