import { createId as cuid } from "@paralleldrive/cuid2";
import { relations } from "drizzle-orm";
import {
	boolean,
	pgTable,
	primaryKey,
	text,
	timestamp,
} from "drizzle-orm/pg-core";

export const user = pgTable("user", {
	id: text().primaryKey(),
	name: text().notNull(),
	email: text().notNull().unique(),
	emailVerified: boolean()
		.$defaultFn(() => false)
		.notNull(),
	image: text(),
	createdAt: timestamp()
		.$defaultFn(() => /* @__PURE__ */ new Date())
		.notNull(),
	updatedAt: timestamp()
		.$defaultFn(() => /* @__PURE__ */ new Date())
		.notNull(),
});

export const artifact = pgTable("artifact", {
	id: text()
		.primaryKey()
		.$defaultFn(() => cuid()),
	createdAt: timestamp()
		.$defaultFn(() => /* @__PURE__ */ new Date())
		.notNull(),
	updatedAt: timestamp()
		.$defaultFn(() => /* @__PURE__ */ new Date())
		.notNull(),
	teamId: text()
		.notNull()
		.references(() => team.id, { onDelete: "cascade" }),
});

export const session = pgTable("session", {
	id: text().primaryKey(),
	expiresAt: timestamp().notNull(),
	token: text().notNull().unique(),
	createdAt: timestamp().notNull(),
	updatedAt: timestamp().notNull(),
	ipAddress: text(),
	userAgent: text(),
	userId: text()
		.notNull()
		.references(() => user.id, { onDelete: "cascade" }),
});

export const account = pgTable("account", {
	id: text().primaryKey(),
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
	createdAt: timestamp().notNull(),
	updatedAt: timestamp().notNull(),
});

export const verification = pgTable("verification", {
	id: text().primaryKey(),
	identifier: text().notNull(),
	value: text().notNull(),
	expiresAt: timestamp().notNull(),
	createdAt: timestamp().$defaultFn(() => /* @__PURE__ */ new Date()),
	updatedAt: timestamp().$defaultFn(() => /* @__PURE__ */ new Date()),
});

export const team = pgTable("team", {
	id: text()
		.primaryKey()
		.$defaultFn(() => cuid()),
	name: text().notNull(),
	description: text(),
	createdAt: timestamp()
		.$defaultFn(() => /* @__PURE__ */ new Date())
		.notNull(),
	updatedAt: timestamp()
		.$defaultFn(() => /* @__PURE__ */ new Date())
		.notNull(),
});

export const teamUser = pgTable(
	"team_user",
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

// Relations

export const usersRelations = relations(user, ({ many }) => ({
	teams: many(teamUser),
}));

export const artifactRelations = relations(artifact, ({ one }) => ({
	team: one(team, {
		fields: [artifact.teamId],
		references: [team.id],
	}),
}));

export const teamRelations = relations(team, ({ many }) => ({
	artifacts: many(artifact),
	users: many(teamUser),
}));

export const teamUserRelations = relations(teamUser, ({ one }) => ({
	team: one(team, {
		fields: [teamUser.teamId],
		references: [team.id],
	}),
	user: one(user, {
		fields: [teamUser.userId],
		references: [user.id],
	}),
}));
