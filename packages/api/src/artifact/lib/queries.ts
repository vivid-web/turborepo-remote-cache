import {
	and,
	type Database,
	eq,
	gt,
	isNull,
	or,
	SQL,
	type SQLWrapper,
} from "@remote-cache/db";
import {
	apiKey,
	artifact,
	artifactTeam,
	team,
	teamMember,
	user,
} from "@remote-cache/db/schema";
import * as R from "remeda";

type TeamIdOrSlug = {
	slug?: string;
	teamId?: string;
};

export function getTeamForUserWithTeamIdOrSlug(db: Database) {
	return async (userId: string, { teamId, slug }: TeamIdOrSlug) => {
		const filters: Array<SQL> = [];

		if (!teamId && !slug) {
			return undefined;
		}

		filters.push(eq(user.id, userId));

		if (teamId) {
			filters.push(eq(team.id, teamId));
		}

		if (slug) {
			filters.push(eq(team.slug, slug));
		}

		const [result] = await db
			.select({ id: team.id })
			.from(team)
			.innerJoin(teamMember, eq(team.id, teamMember.teamId))
			.innerJoin(user, eq(teamMember.userId, user.id))
			.where(and(...filters))
			.limit(1);

		return result;
	};
}

export function getArtifactForTeam(db: Database) {
	return async (teamId: string, hash: string) => {
		const filters: Array<SQL> = [];

		filters.push(eq(team.id, teamId));
		filters.push(eq(artifact.hash, hash));

		return db
			.select({ id: artifact.id })
			.from(artifact)
			.innerJoin(artifactTeam, eq(artifact.id, artifactTeam.artifactId))
			.innerJoin(team, eq(artifactTeam.teamId, team.id))
			.where(and(...filters))
			.limit(1)
			.then(R.first());
	};
}

export const isActiveDate = (column: SQLWrapper) => {
	const filters: Array<SQL> = [];

	filters.push(isNull(column));
	filters.push(gt(column, new Date()));

	return or(...filters);
};

export function getUserForToken(db: Database) {
	return async (token: string) => {
		const filters: Array<SQL | undefined> = [];

		filters.push(eq(apiKey.secret, token));
		filters.push(isActiveDate(apiKey.revokedAt));
		filters.push(isActiveDate(apiKey.expiresAt));

		return db
			.select({ id: user.id })
			.from(user)
			.innerJoin(apiKey, eq(apiKey.userId, user.id))
			.where(and(...filters))
			.then(R.first());
	};
}
