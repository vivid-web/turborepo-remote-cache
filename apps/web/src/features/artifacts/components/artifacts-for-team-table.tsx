import { formatDistance } from "date-fns";
import * as React from "react";

import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";

type Artifact = {
	artifactId: string;
	createdAt: Date;
	hash: string;
};

function FilledRow({ hash, createdAt }: Artifact) {
	return (
		<TableRow>
			<TableCell className="max-w-[200px] truncate font-mono text-sm">
				{hash}
			</TableCell>
			<TableCell className="text-muted-foreground">
				{formatDistance(createdAt, new Date(), { addSuffix: true })}
			</TableCell>
		</TableRow>
	);
}

function EmptyRow() {
	return (
		<TableRow>
			<TableCell colSpan={2}>No artifacts found...</TableCell>
		</TableRow>
	);
}

function Layout({ children }: React.PropsWithChildren) {
	return (
		<Table>
			<TableHeader>
				<TableRow>
					<TableHead>Hash</TableHead>
					<TableHead>Created</TableHead>
				</TableRow>
			</TableHeader>
			<TableBody>{children}</TableBody>
		</Table>
	);
}

function ArtifactsForTeamTable({ artifacts }: { artifacts: Array<Artifact> }) {
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

export { ArtifactsForTeamTable };
