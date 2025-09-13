import * as React from "react";

import { Badge } from "@/components/ui/badge";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";

import { formatCreatedDate } from "../utils";

type Team = {
	slug: string;
};

type Artifact = {
	artifactId: string;
	createdAt: Date;
	hash: string;
	teams: Array<Team>;
};

function FilledRow({ hash, createdAt, teams }: Artifact) {
	return (
		<TableRow>
			<TableCell className="max-w-[200px] truncate font-mono text-sm">
				{hash}
			</TableCell>
			<TableCell className="flex gap-2">
				{teams.map((team) => (
					<Badge key={team.slug} variant="outline">
						{team.slug}
					</Badge>
				))}
			</TableCell>
			<TableCell className="text-muted-foreground">
				{formatCreatedDate(createdAt)}
			</TableCell>
		</TableRow>
	);
}

function EmptyRow() {
	return (
		<TableRow>
			<TableCell colSpan={3}>No artifacts found...</TableCell>
		</TableRow>
	);
}

function Layout({ children }: React.PropsWithChildren) {
	return (
		<Table>
			<TableHeader>
				<TableRow>
					<TableHead>Hash</TableHead>
					<TableHead>Teams</TableHead>
					<TableHead>Created</TableHead>
				</TableRow>
			</TableHeader>
			<TableBody>{children}</TableBody>
		</Table>
	);
}

function ArtifactsTable({ artifacts }: { artifacts: Array<Artifact> }) {
	if (artifacts.length === 0) {
		return (
			<Layout>
				<EmptyRow />
			</Layout>
		);
	}

	return (
		<Layout>
			{artifacts.map((artifact) => (
				<FilledRow {...artifact} key={artifact.artifactId} />
			))}
		</Layout>
	);
}

export { ArtifactsTable };
