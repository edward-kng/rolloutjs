ALTER TABLE "rolloutjs"."segments" ADD COLUMN "priority" integer;--> statement-breakpoint
UPDATE "rolloutjs"."segments" SET "priority" = sub."priority" FROM (
  SELECT "key", (ROW_NUMBER() OVER (ORDER BY "key" ASC) - 1) * 1000 AS "priority"
  FROM "rolloutjs"."segments"
) AS sub WHERE "rolloutjs"."segments"."key" = sub."key";--> statement-breakpoint
ALTER TABLE "rolloutjs"."segments" ALTER COLUMN "priority" SET NOT NULL;