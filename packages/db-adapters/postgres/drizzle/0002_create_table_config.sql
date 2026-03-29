CREATE TABLE "libreflag"."config" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "libreflag"."config_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"version" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
INSERT INTO "libreflag"."config" ("version") VALUES (0);
