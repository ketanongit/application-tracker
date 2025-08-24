CREATE TYPE "public"."application_status" AS ENUM('APPLIED', 'PENDING', 'REJECTED', 'PROCEEDED');--> statement-breakpoint
CREATE TYPE "public"."company_type" AS ENUM('MNC', 'YC_STARTUP', 'INDIAN_UNICORN', 'WELLFOUND_STARTUP', 'EARLY_STAGE_STARTUP', 'SERIES_A', 'SERIES_B', 'SERIES_C', 'PUBLIC_COMPANY', 'OTHER');--> statement-breakpoint
CREATE TABLE "applications" (
	"id" serial PRIMARY KEY NOT NULL,
	"company_name" varchar(255) NOT NULL,
	"position" varchar(255) NOT NULL,
	"company_type" "company_type" NOT NULL,
	"job_description" text,
	"application_url" text,
	"status" "application_status" DEFAULT 'APPLIED' NOT NULL,
	"applied_date" timestamp DEFAULT now() NOT NULL,
	"notes" text,
	"current_round" varchar(100),
	"final_verdict" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "daily_applications" (
	"id" serial PRIMARY KEY NOT NULL,
	"date" timestamp DEFAULT now() NOT NULL,
	"planned_count" integer NOT NULL,
	"actual_count" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
