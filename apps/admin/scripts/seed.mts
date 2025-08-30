import { auth } from "@/lib/auth";

async function run() {
	console.log("🌱 Seeding...");
	console.time(`🌱 Auth has been seeded`);

	console.time("👤 Created admin user...");

	await auth.api.signUpEmail({
		body: {
			name: "John Doe",
			email: "admin@example.com",
			password: "Test@1234",
		},
	});

	console.timeEnd("👤 Created admin user...");

	console.timeEnd(`🌱 Auth has been seeded`);
}

try {
	await run();
} catch (e) {
	console.error(e);
	process.exit(1);
}
