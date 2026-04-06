CREATE TYPE "public"."resource_kind" AS ENUM('aed', 'hospital', 'first_aid', 'other');--> statement-breakpoint
CREATE TABLE "resources" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"kind" "resource_kind" NOT NULL,
	"name" text NOT NULL,
	"lat" double precision NOT NULL,
	"lng" double precision NOT NULL,
	"source" text,
	"verified_at" timestamp with time zone,
	"photo_url" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_by" uuid
);
--> statement-breakpoint
CREATE INDEX "resources_lat_idx" ON "resources" USING btree ("lat");--> statement-breakpoint
CREATE INDEX "resources_lng_idx" ON "resources" USING btree ("lng");