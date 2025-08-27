CREATE TYPE "public"."reachout_method" AS ENUM('LINKEDIN_INMAIL', 'EMAIL', 'OTHER');--> statement-breakpoint
CREATE TABLE "reachout_methods" (
	"id" serial PRIMARY KEY NOT NULL,
	"application_id" integer NOT NULL,
	"method" "reachout_method" NOT NULL,
	"person_contacted" varchar(255),
	"contact_info" varchar(255)
);
--> statement-breakpoint
ALTER TABLE "applications" ALTER COLUMN "company_type" SET DATA TYPE text;--> statement-breakpoint
DROP TYPE "public"."company_type";--> statement-breakpoint
CREATE TYPE "public"."company_type" AS ENUM('MNC', 'YC_STARTUP', 'INDIAN_UNICORN', 'WELL_FUNDED_STARTUP', 'EARLY_STAGE_STARTUP', 'PUBLIC_COMPANY', 'OTHER');--> statement-breakpoint
ALTER TABLE "applications" ALTER COLUMN "company_type" SET DATA TYPE "public"."company_type" USING "company_type"::"public"."company_type";--> statement-breakpoint
ALTER TABLE "reachout_methods" ADD CONSTRAINT "reachout_methods_application_id_applications_id_fk" FOREIGN KEY ("application_id") REFERENCES "public"."applications"("id") ON DELETE cascade ON UPDATE no action;