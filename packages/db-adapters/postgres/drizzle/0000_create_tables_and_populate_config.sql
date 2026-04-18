CREATE SCHEMA IF NOT EXISTS "rolloutjs";
--> statement-breakpoint
CREATE TABLE "rolloutjs"."config" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "rolloutjs"."config_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"version" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "rolloutjs"."flags" (
	"key" text PRIMARY KEY NOT NULL,
	"default_value" json NOT NULL
);
--> statement-breakpoint
CREATE TABLE "rolloutjs"."overrides" (
	"flag_key" text,
	"targeting_key" text NOT NULL,
	"value" json NOT NULL,
	CONSTRAINT "overrides_targeting_key_flag_key_pk" PRIMARY KEY("targeting_key","flag_key")
);
--> statement-breakpoint
ALTER TABLE "rolloutjs"."overrides" ADD CONSTRAINT "overrides_flag_key_flags_key_fk" FOREIGN KEY ("flag_key") REFERENCES "rolloutjs"."flags"("key") ON DELETE no action ON UPDATE no action;
--> statement-breakpoint
INSERT INTO "rolloutjs"."config" ("version") VALUES (0);