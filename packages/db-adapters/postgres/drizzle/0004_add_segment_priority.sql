ALTER TABLE "libreflag"."segments" ADD COLUMN "priority" integer;--> statement-breakpoint
UPDATE "libreflag"."segments" SET "priority" = sub."priority" FROM (
  SELECT "key", (ROW_NUMBER() OVER (ORDER BY "key" ASC) - 1) * 1000 AS "priority"
  FROM "libreflag"."segments"
) AS sub WHERE "libreflag"."segments"."key" = sub."key";--> statement-breakpoint
ALTER TABLE "libreflag"."segments" ALTER COLUMN "priority" SET NOT NULL;