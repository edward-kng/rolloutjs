CREATE SCHEMA IF NOT EXISTS "libreflag";
--> statement-breakpoint
CREATE TABLE "libreflag"."flags" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "libreflag"."flags_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"key" text NOT NULL,
	"default_value" json DEFAULT 'false',
	CONSTRAINT "flags_key_unique" UNIQUE("key")
);
