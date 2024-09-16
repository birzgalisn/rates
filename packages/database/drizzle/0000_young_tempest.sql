CREATE TABLE IF NOT EXISTS "exchange_rates" (
	"id" serial PRIMARY KEY NOT NULL,
	"aud_rate" numeric NOT NULL,
	"gbp_rate" numeric NOT NULL,
	"usd_rate" numeric NOT NULL,
	"created_updated" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "id_index" ON "exchange_rates" USING btree ("id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "created_at_index" ON "exchange_rates" USING btree ("created_updated");