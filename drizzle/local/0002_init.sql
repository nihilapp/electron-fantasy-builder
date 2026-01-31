CREATE TABLE `char_group_relations` (
	`rel_no` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`char_no` integer NOT NULL,
	`trgt_ref_type` text NOT NULL,
	`trgt_ref_no` integer NOT NULL,
	`rel_type` text NOT NULL,
	`rel_desc` text,
	`use_yn` text DEFAULT 'Y',
	`shrn_yn` text DEFAULT 'N',
	`del_yn` text DEFAULT 'N',
	`crt_no` integer,
	`crt_dt` text,
	`updt_no` integer,
	`updt_dt` text,
	`del_no` integer,
	`del_dt` text,
	FOREIGN KEY (`char_no`) REFERENCES `characters`(`char_no`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `char_item_maps` (
	`own_no` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`char_no` integer NOT NULL,
	`item_no` integer NOT NULL,
	`item_cnt` integer NOT NULL,
	`equip_yn` text,
	`rmk` text,
	`use_yn` text DEFAULT 'Y',
	`shrn_yn` text DEFAULT 'N',
	`del_yn` text DEFAULT 'N',
	`crt_no` integer,
	`crt_dt` text,
	`updt_no` integer,
	`updt_dt` text,
	`del_no` integer,
	`del_dt` text,
	FOREIGN KEY (`char_no`) REFERENCES `characters`(`char_no`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`item_no`) REFERENCES `items`(`item_no`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `char_relations` (
	`rel_no` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`src_char_no` integer NOT NULL,
	`trgt_char_no` integer NOT NULL,
	`rel_type` text NOT NULL,
	`rel_desc` text,
	`intimacy_lvl` integer,
	`use_yn` text DEFAULT 'Y',
	`shrn_yn` text DEFAULT 'N',
	`del_yn` text DEFAULT 'N',
	`crt_no` integer,
	`crt_dt` text,
	`updt_no` integer,
	`updt_dt` text,
	`del_no` integer,
	`del_dt` text,
	FOREIGN KEY (`src_char_no`) REFERENCES `characters`(`char_no`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`trgt_char_no`) REFERENCES `characters`(`char_no`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `event_entries` (
	`entry_no` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`event_no` integer NOT NULL,
	`entry_type` text NOT NULL,
	`entry_trgt_no` integer NOT NULL,
	`entry_side` text,
	`role_desc` text,
	`use_yn` text DEFAULT 'Y',
	`shrn_yn` text DEFAULT 'N',
	`del_yn` text DEFAULT 'N',
	`crt_no` integer,
	`crt_dt` text,
	`updt_no` integer,
	`updt_dt` text,
	`del_no` integer,
	`del_dt` text,
	FOREIGN KEY (`event_no`) REFERENCES `events`(`event_no`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `group_relations` (
	`rel_no` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`prj_no` integer NOT NULL,
	`src_type` text NOT NULL,
	`src_no` integer NOT NULL,
	`trgt_type` text NOT NULL,
	`trgt_no` integer NOT NULL,
	`rel_type` text NOT NULL,
	`rel_desc` text,
	`use_yn` text DEFAULT 'Y',
	`shrn_yn` text DEFAULT 'N',
	`del_yn` text DEFAULT 'N',
	`crt_no` integer,
	`crt_dt` text,
	`updt_no` integer,
	`updt_dt` text,
	`del_no` integer,
	`del_dt` text,
	FOREIGN KEY (`prj_no`) REFERENCES `projects`(`prj_no`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `item_ability_maps` (
	`map_no` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`item_no` integer NOT NULL,
	`ability_no` integer NOT NULL,
	`ability_type` text NOT NULL,
	`prof_lvl` integer,
	`ability_rmk` text,
	FOREIGN KEY (`item_no`) REFERENCES `items`(`item_no`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `item_trait_maps` (
	`map_no` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`item_no` integer NOT NULL,
	`trait_no` integer NOT NULL,
	`trait_type` text NOT NULL,
	`trait_rmk` text,
	FOREIGN KEY (`item_no`) REFERENCES `items`(`item_no`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `lore_char_maps` (
	`map_no` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`lore_no` integer NOT NULL,
	`char_no` integer NOT NULL,
	`role_desc` text,
	FOREIGN KEY (`lore_no`) REFERENCES `lores`(`lore_no`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`char_no`) REFERENCES `characters`(`char_no`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `lore_item_maps` (
	`map_no` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`lore_no` integer NOT NULL,
	`item_no` integer NOT NULL,
	`role_desc` text,
	FOREIGN KEY (`lore_no`) REFERENCES `lores`(`lore_no`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`item_no`) REFERENCES `items`(`item_no`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `ntn_trait_maps` (
	`map_no` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`ntn_no` integer NOT NULL,
	`trait_no` integer NOT NULL,
	`trait_type` text NOT NULL,
	`trait_rmk` text,
	FOREIGN KEY (`ntn_no`) REFERENCES `nations`(`ntn_no`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `org_trait_maps` (
	`map_no` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`org_no` integer NOT NULL,
	`trait_no` integer NOT NULL,
	`trait_type` text NOT NULL,
	`trait_rmk` text,
	FOREIGN KEY (`org_no`) REFERENCES `organizations`(`org_no`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `region_trait_maps` (
	`map_no` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`region_no` integer NOT NULL,
	`trait_no` integer NOT NULL,
	`trait_type` text NOT NULL,
	`trait_rmk` text,
	FOREIGN KEY (`region_no`) REFERENCES `regions`(`region_no`) ON UPDATE no action ON DELETE no action
);
