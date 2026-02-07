CREATE TABLE "char_group_relations" (
	"rel_no" serial PRIMARY KEY NOT NULL,
	"char_no" integer NOT NULL,
	"trgt_ref_type" varchar(50) NOT NULL,
	"trgt_ref_no" integer NOT NULL,
	"rel_type" varchar(50) NOT NULL,
	"rel_desc" text,
	"use_yn" varchar(1) DEFAULT 'Y',
	"shrn_yn" varchar(1) DEFAULT 'N',
	"del_yn" varchar(1) DEFAULT 'N',
	"tags" text,
	"crt_no" bigint,
	"crt_dt" timestamp,
	"updt_no" bigint,
	"updt_dt" timestamp,
	"del_no" bigint,
	"del_dt" timestamp
);
--> statement-breakpoint
CREATE TABLE "char_item_maps" (
	"own_no" serial PRIMARY KEY NOT NULL,
	"char_no" integer NOT NULL,
	"item_no" integer NOT NULL,
	"item_cnt" integer NOT NULL,
	"equip_yn" varchar(1),
	"rmk" text,
	"use_yn" varchar(1) DEFAULT 'Y',
	"shrn_yn" varchar(1) DEFAULT 'N',
	"del_yn" varchar(1) DEFAULT 'N',
	"tags" text,
	"crt_no" bigint,
	"crt_dt" timestamp,
	"updt_no" bigint,
	"updt_dt" timestamp,
	"del_no" bigint,
	"del_dt" timestamp
);
--> statement-breakpoint
CREATE TABLE "char_relations" (
	"rel_no" serial PRIMARY KEY NOT NULL,
	"src_char_no" integer NOT NULL,
	"trgt_char_no" integer NOT NULL,
	"rel_type" varchar(50) NOT NULL,
	"rel_desc" text,
	"intimacy_lvl" integer,
	"use_yn" varchar(1) DEFAULT 'Y',
	"shrn_yn" varchar(1) DEFAULT 'N',
	"del_yn" varchar(1) DEFAULT 'N',
	"tags" text,
	"crt_no" bigint,
	"crt_dt" timestamp,
	"updt_no" bigint,
	"updt_dt" timestamp,
	"del_no" bigint,
	"del_dt" timestamp
);
--> statement-breakpoint
CREATE TABLE "event_entries" (
	"entry_no" serial PRIMARY KEY NOT NULL,
	"event_no" integer NOT NULL,
	"entry_type" varchar(50) NOT NULL,
	"entry_trgt_no" integer NOT NULL,
	"entry_side" varchar(20),
	"role_desc" text,
	"use_yn" varchar(1) DEFAULT 'Y',
	"shrn_yn" varchar(1) DEFAULT 'N',
	"del_yn" varchar(1) DEFAULT 'N',
	"tags" text,
	"crt_no" bigint,
	"crt_dt" timestamp,
	"updt_no" bigint,
	"updt_dt" timestamp,
	"del_no" bigint,
	"del_dt" timestamp
);
--> statement-breakpoint
CREATE TABLE "group_relations" (
	"rel_no" serial PRIMARY KEY NOT NULL,
	"prj_no" integer NOT NULL,
	"src_type" varchar(50) NOT NULL,
	"src_no" integer NOT NULL,
	"trgt_type" varchar(50) NOT NULL,
	"trgt_no" integer NOT NULL,
	"rel_type" varchar(50) NOT NULL,
	"rel_desc" text,
	"use_yn" varchar(1) DEFAULT 'Y',
	"shrn_yn" varchar(1) DEFAULT 'N',
	"del_yn" varchar(1) DEFAULT 'N',
	"tags" text,
	"crt_no" bigint,
	"crt_dt" timestamp,
	"updt_no" bigint,
	"updt_dt" timestamp,
	"del_no" bigint,
	"del_dt" timestamp
);
--> statement-breakpoint
CREATE TABLE "item_ability_maps" (
	"map_no" serial PRIMARY KEY NOT NULL,
	"item_no" integer NOT NULL,
	"ability_no" integer NOT NULL,
	"ability_type" varchar(20) NOT NULL,
	"prof_lvl" integer,
	"ability_rmk" text
);
--> statement-breakpoint
CREATE TABLE "item_trait_maps" (
	"map_no" serial PRIMARY KEY NOT NULL,
	"item_no" integer NOT NULL,
	"trait_no" integer NOT NULL,
	"trait_type" varchar(20) NOT NULL,
	"trait_rmk" text
);
--> statement-breakpoint
CREATE TABLE "lore_char_maps" (
	"map_no" serial PRIMARY KEY NOT NULL,
	"lore_no" integer NOT NULL,
	"char_no" integer NOT NULL,
	"role_desc" text
);
--> statement-breakpoint
CREATE TABLE "lore_item_maps" (
	"map_no" serial PRIMARY KEY NOT NULL,
	"lore_no" integer NOT NULL,
	"item_no" integer NOT NULL,
	"role_desc" text
);
--> statement-breakpoint
CREATE TABLE "ntn_trait_maps" (
	"map_no" serial PRIMARY KEY NOT NULL,
	"ntn_no" integer NOT NULL,
	"trait_no" integer NOT NULL,
	"trait_type" varchar(20) NOT NULL,
	"trait_rmk" text
);
--> statement-breakpoint
CREATE TABLE "org_trait_maps" (
	"map_no" serial PRIMARY KEY NOT NULL,
	"org_no" integer NOT NULL,
	"trait_no" integer NOT NULL,
	"trait_type" varchar(20) NOT NULL,
	"trait_rmk" text
);
--> statement-breakpoint
CREATE TABLE "region_trait_maps" (
	"map_no" serial PRIMARY KEY NOT NULL,
	"region_no" integer NOT NULL,
	"trait_no" integer NOT NULL,
	"trait_type" varchar(20) NOT NULL,
	"trait_rmk" text
);
--> statement-breakpoint
ALTER TABLE "abilities" ADD COLUMN "tags" text;--> statement-breakpoint
ALTER TABLE "characters" ADD COLUMN "tags" text;--> statement-breakpoint
ALTER TABLE "core_rules" ADD COLUMN "tags" text;--> statement-breakpoint
ALTER TABLE "creatures" ADD COLUMN "tags" text;--> statement-breakpoint
ALTER TABLE "events" ADD COLUMN "tags" text;--> statement-breakpoint
ALTER TABLE "items" ADD COLUMN "tags" text;--> statement-breakpoint
ALTER TABLE "lores" ADD COLUMN "tags" text;--> statement-breakpoint
ALTER TABLE "nations" ADD COLUMN "tags" text;--> statement-breakpoint
ALTER TABLE "organizations" ADD COLUMN "tags" text;--> statement-breakpoint
ALTER TABLE "project_abilities" ADD COLUMN "tags" text;--> statement-breakpoint
ALTER TABLE "project_traits" ADD COLUMN "tags" text;--> statement-breakpoint
ALTER TABLE "projects" ADD COLUMN "tags" text;--> statement-breakpoint
ALTER TABLE "regions" ADD COLUMN "tags" text;--> statement-breakpoint
ALTER TABLE "traits" ADD COLUMN "tags" text;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "tags" text;--> statement-breakpoint
ALTER TABLE "char_group_relations" ADD CONSTRAINT "char_group_relations_char_no_characters_char_no_fk" FOREIGN KEY ("char_no") REFERENCES "public"."characters"("char_no") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "char_item_maps" ADD CONSTRAINT "char_item_maps_char_no_characters_char_no_fk" FOREIGN KEY ("char_no") REFERENCES "public"."characters"("char_no") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "char_item_maps" ADD CONSTRAINT "char_item_maps_item_no_items_item_no_fk" FOREIGN KEY ("item_no") REFERENCES "public"."items"("item_no") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "char_relations" ADD CONSTRAINT "char_relations_src_char_no_characters_char_no_fk" FOREIGN KEY ("src_char_no") REFERENCES "public"."characters"("char_no") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "char_relations" ADD CONSTRAINT "char_relations_trgt_char_no_characters_char_no_fk" FOREIGN KEY ("trgt_char_no") REFERENCES "public"."characters"("char_no") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "event_entries" ADD CONSTRAINT "event_entries_event_no_events_event_no_fk" FOREIGN KEY ("event_no") REFERENCES "public"."events"("event_no") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "group_relations" ADD CONSTRAINT "group_relations_prj_no_projects_prj_no_fk" FOREIGN KEY ("prj_no") REFERENCES "public"."projects"("prj_no") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "item_ability_maps" ADD CONSTRAINT "item_ability_maps_item_no_items_item_no_fk" FOREIGN KEY ("item_no") REFERENCES "public"."items"("item_no") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "item_trait_maps" ADD CONSTRAINT "item_trait_maps_item_no_items_item_no_fk" FOREIGN KEY ("item_no") REFERENCES "public"."items"("item_no") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lore_char_maps" ADD CONSTRAINT "lore_char_maps_lore_no_lores_lore_no_fk" FOREIGN KEY ("lore_no") REFERENCES "public"."lores"("lore_no") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lore_char_maps" ADD CONSTRAINT "lore_char_maps_char_no_characters_char_no_fk" FOREIGN KEY ("char_no") REFERENCES "public"."characters"("char_no") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lore_item_maps" ADD CONSTRAINT "lore_item_maps_lore_no_lores_lore_no_fk" FOREIGN KEY ("lore_no") REFERENCES "public"."lores"("lore_no") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lore_item_maps" ADD CONSTRAINT "lore_item_maps_item_no_items_item_no_fk" FOREIGN KEY ("item_no") REFERENCES "public"."items"("item_no") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ntn_trait_maps" ADD CONSTRAINT "ntn_trait_maps_ntn_no_nations_ntn_no_fk" FOREIGN KEY ("ntn_no") REFERENCES "public"."nations"("ntn_no") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "org_trait_maps" ADD CONSTRAINT "org_trait_maps_org_no_organizations_org_no_fk" FOREIGN KEY ("org_no") REFERENCES "public"."organizations"("org_no") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "region_trait_maps" ADD CONSTRAINT "region_trait_maps_region_no_regions_region_no_fk" FOREIGN KEY ("region_no") REFERENCES "public"."regions"("region_no") ON DELETE no action ON UPDATE no action;