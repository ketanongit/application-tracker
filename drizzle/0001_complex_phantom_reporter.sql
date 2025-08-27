ALTER TABLE "applications" ALTER COLUMN "status" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "applications" ALTER COLUMN "status" SET DEFAULT 'APPLIED'::text;--> statement-breakpoint
DROP TYPE "public"."application_status";--> statement-breakpoint
CREATE TYPE "public"."application_status" AS ENUM('APPLIED', 'REJECTED', 'PROCEEDED');--> statement-breakpoint
ALTER TABLE "applications" ALTER COLUMN "status" SET DEFAULT 'APPLIED'::"public"."application_status";--> statement-breakpoint
ALTER TABLE "applications" ALTER COLUMN "status" SET DATA TYPE "public"."application_status" USING "status"::"public"."application_status";