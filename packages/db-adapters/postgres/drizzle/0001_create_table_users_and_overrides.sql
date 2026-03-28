CREATE TABLE "libreflag"."user_overrides" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "libreflag"."user_overrides_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"user_key" text NOT NULL,
	"flag_key" text NOT NULL,
	"value" json NOT NULL,
	CONSTRAINT "user_overrides_user_key_flag_key_unique" UNIQUE("user_key","flag_key")
);
--> statement-breakpoint
CREATE TABLE "libreflag"."users" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "libreflag"."users_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"key" text NOT NULL,
	"attributes" json DEFAULT '{}'::json,
	CONSTRAINT "users_key_unique" UNIQUE("key")
);
--> statement-breakpoint
ALTER TABLE "libreflag"."user_overrides" ADD CONSTRAINT "user_overrides_user_key_users_key_fk" FOREIGN KEY ("user_key") REFERENCES "libreflag"."users"("key") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "libreflag"."user_overrides" ADD CONSTRAINT "user_overrides_flag_key_flags_key_fk" FOREIGN KEY ("flag_key") REFERENCES "libreflag"."flags"("key") ON DELETE cascade ON UPDATE no action;