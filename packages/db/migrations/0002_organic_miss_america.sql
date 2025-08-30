CREATE TABLE "artifact" (
	"id" text PRIMARY KEY NOT NULL,
	"team_id" text NOT NULL,
	"hash" text NOT NULL,
	"created_at" timestamp NOT NULL,
	CONSTRAINT "artifact_hash_unique" UNIQUE("hash")
);
--> statement-breakpoint
ALTER TABLE "artifact" ADD CONSTRAINT "artifact_team_id_team_id_fk" FOREIGN KEY ("team_id") REFERENCES "public"."team"("id") ON DELETE cascade ON UPDATE no action;