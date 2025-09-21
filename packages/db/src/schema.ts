import { createId as cuid } from "@paralleldrive/cuid2";
import { relations } from "drizzle-orm";
import {
	boolean,
	pgTable,
	primaryKey,
	text,
	timestamp,
} from "drizzle-orm/pg-core";

// Schema definitions
const user = pgTable("user", {
	id: text()
		.primaryKey()
		.$defaultFn(() => cuid()),
	name: text().notNull(),
	email: text().notNull().unique(),
	emailVerified: boolean()
		.$defaultFn(() => false)
		.notNull(),
	image: text(),
	createdAt: timestamp().notNull().defaultNow(),
	updatedAt: timestamp()
		.notNull()
		.defaultNow()
		.$onUpdateFn(() => /* @__PURE__ */ new Date()),
});

const session = pgTable("session", {
	id: text()
		.primaryKey()
		.$defaultFn(() => cuid()),
	expiresAt: timestamp().notNull(),
	token: text().notNull().unique(),
	createdAt: timestamp().notNull().defaultNow(),
	updatedAt: timestamp()
		.notNull()
		.defaultNow()
		.$onUpdateFn(() => /* @__PURE__ */ new Date()),
	ipAddress: text(),
	userAgent: text(),
	userId: text()
		.notNull()
		.references(() => user.id, { onDelete: "cascade" }),
});

const account = pgTable("account", {
	id: text()
		.primaryKey()
		.$defaultFn(() => cuid()),
	accountId: text().notNull(),
	providerId: text().notNull(),
	userId: text()
		.notNull()
		.references(() => user.id, { onDelete: "cascade" }),
	accessToken: text(),
	refreshToken: text(),
	idToken: text(),
	accessTokenExpiresAt: timestamp(),
	refreshTokenExpiresAt: timestamp(),
	scope: text(),
	password: text(),
	createdAt: timestamp().notNull().defaultNow(),
	updatedAt: timestamp()
		.notNull()
		.defaultNow()
		.$onUpdateFn(() => /* @__PURE__ */ new Date()),
});

const verification = pgTable("verification", {
	id: text()
		.primaryKey()
		.$defaultFn(() => cuid()),
	identifier: text().notNull(),
	value: text().notNull(),
	expiresAt: timestamp().notNull(),
	createdAt: timestamp().notNull().defaultNow(),
	updatedAt: timestamp()
		.notNull()
		.defaultNow()
		.$onUpdateFn(() => /* @__PURE__ */ new Date()),
});

const team = pgTable("team", {
	id: text()
		.primaryKey()
		.$defaultFn(() => cuid()),
	name: text().notNull(),
	slug: text().notNull().unique(),
	description: text(),
	createdAt: timestamp().notNull().defaultNow(),
	updatedAt: timestamp()
		.notNull()
		.defaultNow()
		.$onUpdateFn(() => /* @__PURE__ */ new Date()),
});

const teamMember = pgTable(
	"team_member",
	{
		teamId: text()
			.notNull()
			.references(() => team.id, { onDelete: "cascade" }),
		userId: text()
			.notNull()
			.references(() => user.id, { onDelete: "cascade" }),
	},
	(t) => [primaryKey({ columns: [t.teamId, t.userId] })],
);

const artifact = pgTable("artifact", {
	id: text()
		.primaryKey()
		.$defaultFn(() => cuid()),
	hash: text().notNull().unique(),
	createdAt: timestamp().notNull().defaultNow(),
	updatedAt: timestamp()
		.notNull()
		.defaultNow()
		.$onUpdateFn(() => /* @__PURE__ */ new Date()),
});

const artifactTeam = pgTable(
	"artifact_team",
	{
		artifactId: text()
			.notNull()
			.references(() => artifact.id, { onDelete: "cascade" }),
		teamId: text()
			.notNull()
			.references(() => team.id, { onDelete: "cascade" }),
	},
	(t) => [primaryKey({ columns: [t.artifactId, t.teamId] })],
);

const apiKey = pgTable("api_key", {
	id: text()
		.primaryKey()
		.$defaultFn(() => cuid()),
	userId: text()
		.notNull()
		.references(() => user.id, { onDelete: "cascade" }),
	name: text().notNull(),
	secret: text().notNull().unique(),
	createdAt: timestamp().notNull().defaultNow(),
	expiresAt: timestamp(),
	lastUsedAt: timestamp(),
	revokedAt: timestamp(),
});

// Relation definitions
const userRelations = relations(user, ({ many }) => ({
	sessions: many(session),
	accounts: many(account),
	teamMembers: many(teamMember),
	apiKeys: many(apiKey),
}));

const accountRelations = relations(account, ({ one }) => ({
	user: one(user, {
		fields: [account.userId],
		references: [user.id],
	}),
}));

const sessionRelations = relations(session, ({ one }) => ({
	user: one(user, {
		fields: [session.userId],
		references: [user.id],
	}),
}));

const teamRelations = relations(team, ({ many }) => ({
	teamMembers: many(teamMember),
	artifactTeams: many(artifactTeam),
}));

const teamMemberRelations = relations(teamMember, ({ one }) => ({
	team: one(team, {
		fields: [teamMember.teamId],
		references: [team.id],
	}),
	user: one(user, {
		fields: [teamMember.userId],
		references: [user.id],
	}),
}));

const artifactRelations = relations(artifact, ({ many }) => ({
	artifactTeams: many(artifactTeam),
}));

const artifactTeamRelations = relations(artifactTeam, ({ one }) => ({
	artifact: one(artifact, {
		fields: [artifactTeam.artifactId],
		references: [artifact.id],
	}),
	team: one(team, {
		fields: [artifactTeam.teamId],
		references: [team.id],
	}),
}));

const apiKeyRelations = relations(apiKey, ({ one }) => ({
	user: one(user, {
		fields: [apiKey.userId],
		references: [user.id],
	}),
}));

export {
	account,
	apiKey,
	artifact,
	artifactTeam,
	session,
	team,
	teamMember,
	user,
	verification,
};

export {
	accountRelations,
	apiKeyRelations,
	artifactRelations,
	artifactTeamRelations,
	sessionRelations,
	teamMemberRelations,
	teamRelations,
	userRelations,
};
