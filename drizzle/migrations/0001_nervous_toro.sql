CREATE TABLE "team" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"slug" text NOT NULL,
	"description" text,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL,
	CONSTRAINT "team_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "team_member" (
	"team_id" text NOT NULL,
	"user_id" text NOT NULL,
	CONSTRAINT "team_member_team_id_user_id_pk" PRIMARY KEY("team_id","user_id")
);
--> statement-breakpoint
ALTER TABLE "team_member" ADD CONSTRAINT "team_member_team_id_team_id_fk" FOREIGN KEY ("team_id") REFERENCES "public"."team"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "team_member" ADD CONSTRAINT "team_member_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;