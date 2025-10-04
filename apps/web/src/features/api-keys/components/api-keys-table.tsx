import {
	CheckIcon,
	CopyIcon,
	EyeIcon,
	EyeOffIcon,
	MoreHorizontalIcon,
} from "lucide-react";
import * as React from "react";
import { lazily } from "react-lazily";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Spinner } from "@/components/ui/spinner";
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

const { RerollApiKeyForAccountDialog } = lazily(
	() => import("./reroll-api-key-for-account-dialog"),
);

const { RevokeApiKeyForAccountAlertDialog } = lazily(
	() => import("./revoke-api-key-for-account-alert-dialog"),
);

const { RemoveApiKeyForAccountAlertDialog } = lazily(
	() => import("./remove-api-key-for-account-alert-dialog"),
);

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
	apiKeyId,
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
			<TableCell>
				<React.Suspense
					fallback={
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Button variant="ghost" size="sm" disabled>
									<Spinner />
								</Button>
							</DropdownMenuTrigger>
						</DropdownMenu>
					}
				>
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button variant="ghost" size="sm">
								<MoreHorizontalIcon className="h-4 w-4" />
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end">
							<RerollApiKeyForAccountDialog apiKeyId={apiKeyId}>
								<DropdownMenuItem
									variant="destructive"
									onSelect={(e) => {
										e.preventDefault();
									}}
								>
									Reroll
								</DropdownMenuItem>
							</RerollApiKeyForAccountDialog>
							{status === "active" && (
								<RevokeApiKeyForAccountAlertDialog apiKeyId={apiKeyId}>
									<DropdownMenuItem
										variant="destructive"
										onSelect={(e) => {
											e.preventDefault();
										}}
									>
										Revoke
									</DropdownMenuItem>
								</RevokeApiKeyForAccountAlertDialog>
							)}
							{status !== "active" && (
								<RemoveApiKeyForAccountAlertDialog apiKeyId={apiKeyId}>
									<DropdownMenuItem
										variant="destructive"
										onSelect={(e) => {
											e.preventDefault();
										}}
									>
										Delete
									</DropdownMenuItem>
								</RemoveApiKeyForAccountAlertDialog>
							)}
						</DropdownMenuContent>
					</DropdownMenu>
				</React.Suspense>
			</TableCell>
		</TableRow>
	);
}

function EmptyRow() {
	return (
		<TableRow>
			<TableCell colSpan={7}>No API keys found...</TableCell>
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
					<TableHead className="w-[50px]" />
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
