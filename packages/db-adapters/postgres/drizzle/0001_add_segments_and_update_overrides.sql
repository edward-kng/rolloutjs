CREATE TABLE "rolloutjs"."segments" (
	"key" text PRIMARY KEY NOT NULL,
	"rules" json NOT NULL
);
--> statement-breakpoint
ALTER TABLE "rolloutjs"."overrides" DROP CONSTRAINT "overrides_targeting_key_flag_key_pk";--> statement-breakpoint
ALTER TABLE "rolloutjs"."overrides" ALTER COLUMN "flag_key" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "rolloutjs"."overrides" ALTER COLUMN "targeting_key" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "rolloutjs"."overrides" ADD COLUMN "segment_key" text;--> statement-breakpoint
ALTER TABLE "rolloutjs"."overrides" ADD CONSTRAINT "overrides_segment_key_segments_key_fk" FOREIGN KEY ("segment_key") REFERENCES "rolloutjs"."segments"("key") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "rolloutjs"."overrides" ADD CONSTRAINT "overrides_targeting_key_flag_key_unique" UNIQUE("targeting_key","flag_key");--> statement-breakpoint
ALTER TABLE "rolloutjs"."overrides" ADD CONSTRAINT "overrides_segment_key_flag_key_unique" UNIQUE("segment_key","flag_key");--> statement-breakpoint
ALTER TABLE "rolloutjs"."overrides" ADD CONSTRAINT "targeting_or_segment_key" CHECK ((targeting_key IS NOT NULL AND segment_key IS NULL) OR (targeting_key IS NULL AND segment_key IS NOT NULL));