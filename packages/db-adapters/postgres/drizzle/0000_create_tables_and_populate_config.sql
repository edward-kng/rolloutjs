CREATE SCHEMA IF NOT EXISTS "libreflag";
--> statement-breakpoint
CREATE TABLE "libreflag"."config" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "libreflag"."config_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"version" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "libreflag"."flags" (
	"key" text PRIMARY KEY NOT NULL,
	"default_value" json NOT NULL
);
--> statement-breakpoint
CREATE TABLE "libreflag"."overrides" (
	"flag_key" text,
	"targeting_key" text NOT NULL,
	"value" json NOT NULL,
	CONSTRAINT "overrides_targeting_key_flag_key_pk" PRIMARY KEY("targeting_key","flag_key")
);
--> statement-breakpoint
ALTER TABLE "libreflag"."overrides" ADD CONSTRAINT "overrides_flag_key_flags_key_fk" FOREIGN KEY ("flag_key") REFERENCES "libreflag"."flags"("key") ON DELETE no action ON UPDATE no action;
--> statement-breakpoint
INSERT INTO "libreflag"."config" ("version") VALUES (0);