ALTER TABLE "rolloutjs"."flags" ADD COLUMN "name" text;--> statement-breakpoint
ALTER TABLE "rolloutjs"."flags" ADD COLUMN "description" text;--> statement-breakpoint
ALTER TABLE "rolloutjs"."segments" ADD COLUMN "name" text;--> statement-breakpoint
ALTER TABLE "rolloutjs"."segments" ADD COLUMN "description" text;