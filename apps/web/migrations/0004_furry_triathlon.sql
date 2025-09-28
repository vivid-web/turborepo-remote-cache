CREATE TABLE "artifact_team" (
	"artifact_id" text NOT NULL,
	"team_id" text NOT NULL,
	CONSTRAINT "artifact_team_artifact_id_team_id_pk" PRIMARY KEY("artifact_id","team_id")
);
--> statement-breakpoint
ALTER TABLE "artifact" DROP CONSTRAINT "artifact_team_id_team_id_fk";
--> statement-breakpoint
ALTER TABLE "artifact_team" ADD CONSTRAINT "artifact_team_artifact_id_artifact_id_fk" FOREIGN KEY ("artifact_id") REFERENCES "public"."artifact"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "artifact_team" ADD CONSTRAINT "artifact_team_team_id_team_id_fk" FOREIGN KEY ("team_id") REFERENCES "public"."team"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "artifact" DROP COLUMN "team_id";