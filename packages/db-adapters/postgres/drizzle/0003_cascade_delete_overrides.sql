ALTER TABLE "rolloutjs"."overrides" DROP CONSTRAINT "overrides_flag_key_flags_key_fk";
--> statement-breakpoint
ALTER TABLE "rolloutjs"."overrides" DROP CONSTRAINT "overrides_segment_key_segments_key_fk";
--> statement-breakpoint
ALTER TABLE "rolloutjs"."overrides" ADD CONSTRAINT "overrides_flag_key_flags_key_fk" FOREIGN KEY ("flag_key") REFERENCES "rolloutjs"."flags"("key") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "rolloutjs"."overrides" ADD CONSTRAINT "overrides_segment_key_segments_key_fk" FOREIGN KEY ("segment_key") REFERENCES "rolloutjs"."segments"("key") ON DELETE cascade ON UPDATE no action;