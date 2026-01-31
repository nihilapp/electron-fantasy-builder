DROP TABLE `users`;--> statement-breakpoint
PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_projects` (
	`prj_no` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`prj_nm` text NOT NULL,
	`genre_type` text,
	`prj_desc` text,
	`cvr_img_url` text,
	`prj_expln` text,
	`prj_ver` text,
	`use_yn` text DEFAULT 'Y',
	`shrn_yn` text DEFAULT 'N',
	`del_yn` text DEFAULT 'N',
	`crt_no` integer,
	`crt_dt` text,
	`updt_no` integer,
	`updt_dt` text,
	`del_no` integer,
	`del_dt` text
);
--> statement-breakpoint
INSERT INTO `__new_projects`("prj_no", "prj_nm", "genre_type", "prj_desc", "cvr_img_url", "prj_expln", "prj_ver", "use_yn", "shrn_yn", "del_yn", "crt_no", "crt_dt", "updt_no", "updt_dt", "del_no", "del_dt") SELECT "prj_no", "prj_nm", "genre_type", "prj_desc", "cvr_img_url", "prj_expln", "prj_ver", "use_yn", "shrn_yn", "del_yn", "crt_no", "crt_dt", "updt_no", "updt_dt", "del_no", "del_dt" FROM `projects`;--> statement-breakpoint
DROP TABLE `projects`;--> statement-breakpoint
ALTER TABLE `__new_projects` RENAME TO `projects`;--> statement-breakpoint
PRAGMA foreign_keys=ON;