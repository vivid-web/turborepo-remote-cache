import { CheckIcon, CopyIcon, EyeIcon, EyeOffIcon } from "lucide-react";
import * as React from "react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";

import {
	formatCreatedDate,
	formatExpiresDate,
	formatLastUsedDate,
	maskSecret,
	wait,
} from "../utils";

type ApiKey = {
	apiKeyId: string;
	createdAt: Date;
	expiresAt: Date | null;
	lastUsedAt: Date | null;
	name: string;
	revokedAt: Date | null;
	secret: string;
};

function FilledRow({
	name,
	secret,
	createdAt,
	lastUsedAt,
	expiresAt,
	revokedAt,
}: ApiKey) {
	const [isCopied, setIsCopied] = React.useState(false);
	const [isSecretVisible, setIsSecretVisible] = React.useState(false);

	const status = React.useMemo(() => {
		const now = new Date();

		if (revokedAt && revokedAt <= now) {
			return "revoked";
		}

		if (expiresAt && expiresAt <= now) {
			return "expired";
		}

		return "active";
	}, [expiresAt, revokedAt]);

	const copySecret = async () => {
		await navigator.clipboard.writeText(secret);

		toast.success("API key copied");

		setIsCopied(true);

		await wait(1500);

		setIsCopied(false);
	};

	const toggleSecretVisibility = () => {
		setIsSecretVisible((prev) => !prev);
	};

	return (
		<TableRow>
			<TableCell>{name}</TableCell>
			<TableCell>
				<div className="flex items-center gap-x-2">
					<code className="rounded bg-muted px-2 py-1 text-sm">
						{isSecretVisible ? secret : maskSecret(secret)}
					</code>
					<Button variant="ghost" size="sm" onClick={toggleSecretVisibility}>
						{isSecretVisible ? <EyeOffIcon /> : <EyeIcon />}
					</Button>
					<Button variant="ghost" size="sm" onClick={() => void copySecret()}>
						{isCopied ? <CheckIcon /> : <CopyIcon />}
					</Button>
				</div>
			</TableCell>
			<TableCell>
				<Badge variant={status === "active" ? "default" : "secondary"}>
					{status}
				</Badge>
			</TableCell>
			<TableCell>{formatCreatedDate(createdAt)}</TableCell>
			<TableCell>{formatLastUsedDate(lastUsedAt)}</TableCell>
			<TableCell>{formatExpiresDate(expiresAt)}</TableCell>
		</TableRow>
	);
}

function EmptyRow() {
	return (
		<TableRow>
			<TableCell colSpan={6}>No API keys found...</TableCell>
		</TableRow>
	);
}

function Layout({ children }: React.PropsWithChildren) {
	return (
		<Table>
			<TableHeader>
				<TableRow>
					<TableHead>Name</TableHead>
					<TableHead>API key</TableHead>
					<TableHead>Status</TableHead>
					<TableHead>Created</TableHead>
					<TableHead>Last Used</TableHead>
					<TableHead>Expires</TableHead>
				</TableRow>
			</TableHeader>
			<TableBody>{children}</TableBody>
		</Table>
	);
}

function ApiKeysTable({ apiKeys }: { apiKeys: Array<ApiKey> }) {
	if (apiKeys.length === 0) {
		return (
			<Layout>
				<EmptyRow />
			</Layout>
		);
	}

	return (
		<Layout>
			{apiKeys.map((apiKey) => (
				<FilledRow {...apiKey} key={apiKey.apiKeyId} />
			))}
		</Layout>
	);
}

export { ApiKeysTable };
