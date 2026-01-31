CREATE TABLE "abilities" (
	"ability_no" serial PRIMARY KEY NOT NULL,
	"ability_nm" text NOT NULL,
	"ability_type" text,
	"ability_lcls" text,
	"ability_expln" text,
	"trgt_type" text,
	"dmg_type" text,
	"stat_eff_type" text,
	"use_cost" text,
	"cool_time" integer,
	"cast_time" integer,
	"use_cnd" text,
	"use_yn" varchar(1) DEFAULT 'Y',
	"shrn_yn" varchar(1) DEFAULT 'N',
	"del_yn" varchar(1) DEFAULT 'N',
	"crt_no" bigint,
	"crt_dt" timestamp,
	"updt_no" bigint,
	"updt_dt" timestamp,
	"del_no" bigint,
	"del_dt" timestamp
);
--> statement-breakpoint
CREATE TABLE "char_ability_maps" (
	"char_no" integer NOT NULL,
	"ability_no" integer NOT NULL,
	"ability_type" varchar(20) NOT NULL,
	"prof_lvl" integer,
	"ability_rmk" text,
	CONSTRAINT "char_ability_maps_char_no_ability_no_ability_type_pk" PRIMARY KEY("char_no","ability_no","ability_type")
);
--> statement-breakpoint
CREATE TABLE "char_trait_maps" (
	"char_no" integer NOT NULL,
	"trait_no" integer NOT NULL,
	"trait_type" varchar(20) NOT NULL,
	"trait_rmk" text,
	CONSTRAINT "char_trait_maps_char_no_trait_no_trait_type_pk" PRIMARY KEY("char_no","trait_no","trait_type")
);
--> statement-breakpoint
CREATE TABLE "characters" (
	"char_no" serial PRIMARY KEY NOT NULL,
	"prj_no" integer NOT NULL,
	"char_nm" text NOT NULL,
	"alias_nm" text,
	"role_type" text,
	"logline" text,
	"narr_func" text,
	"race_no" integer,
	"ntn_no" integer,
	"org_no" integer,
	"org_rank" text,
	"use_yn" varchar(1) DEFAULT 'Y',
	"shrn_yn" varchar(1) DEFAULT 'N',
	"del_yn" varchar(1) DEFAULT 'N',
	"crt_no" bigint,
	"crt_dt" timestamp,
	"updt_no" bigint,
	"updt_dt" timestamp,
	"del_no" bigint,
	"del_dt" timestamp
);
--> statement-breakpoint
CREATE TABLE "core_rules" (
	"core_no" serial PRIMARY KEY NOT NULL,
	"prj_no" integer NOT NULL,
	"core_nm" text NOT NULL,
	"def_desc" text,
	"aply_scope" text,
	"strc_elem" text,
	"mech_desc" text,
	"narr_aply" text,
	"keywords" text,
	"link_docs" text,
	"rmk" text,
	"use_yn" varchar(1) DEFAULT 'Y',
	"shrn_yn" varchar(1) DEFAULT 'N',
	"del_yn" varchar(1) DEFAULT 'N',
	"crt_no" bigint,
	"crt_dt" timestamp,
	"updt_no" bigint,
	"updt_dt" timestamp,
	"del_no" bigint,
	"del_dt" timestamp
);
--> statement-breakpoint
CREATE TABLE "creature_ability_maps" (
	"map_no" serial PRIMARY KEY NOT NULL,
	"creature_no" integer NOT NULL,
	"ability_no" integer NOT NULL,
	"ability_type" varchar(20) NOT NULL,
	"prof_lvl" integer,
	"ability_rmk" text
);
--> statement-breakpoint
CREATE TABLE "creature_trait_maps" (
	"map_no" serial PRIMARY KEY NOT NULL,
	"creature_no" integer NOT NULL,
	"trait_no" integer NOT NULL,
	"trait_type" varchar(20) NOT NULL,
	"trait_rmk" text
);
--> statement-breakpoint
CREATE TABLE "creatures" (
	"creature_no" serial PRIMARY KEY NOT NULL,
	"prj_no" integer NOT NULL,
	"creature_nm" text NOT NULL,
	"creature_type" text,
	"danger_grd" text,
	"ident_stat" text,
	"creature_expln" text,
	"use_yn" varchar(1) DEFAULT 'Y',
	"shrn_yn" varchar(1) DEFAULT 'N',
	"del_yn" varchar(1) DEFAULT 'N',
	"crt_no" bigint,
	"crt_dt" timestamp,
	"updt_no" bigint,
	"updt_dt" timestamp,
	"del_no" bigint,
	"del_dt" timestamp
);
--> statement-breakpoint
CREATE TABLE "events" (
	"event_no" serial PRIMARY KEY NOT NULL,
	"prj_no" integer NOT NULL,
	"event_nm" text NOT NULL,
	"occur_time" text,
	"occur_loc" text,
	"smry" text,
	"cause_pub" text,
	"cause_real" text,
	"side_a_char" text,
	"side_a_org" text,
	"side_a_ntn" text,
	"side_b_char" text,
	"side_b_org" text,
	"side_b_ntn" text,
	"side_c_char" text,
	"side_c_org" text,
	"side_c_ntn" text,
	"flow_trgr" text,
	"flow_crisis" text,
	"flow_climax" text,
	"flow_concl" text,
	"dmg_rslt" text,
	"soc_chng" text,
	"curr_conn" text,
	"rec_official" text,
	"truth_hid" text,
	"rmk" text,
	"use_yn" varchar(1) DEFAULT 'Y',
	"shrn_yn" varchar(1) DEFAULT 'N',
	"del_yn" varchar(1) DEFAULT 'N',
	"crt_no" bigint,
	"crt_dt" timestamp,
	"updt_no" bigint,
	"updt_dt" timestamp,
	"del_no" bigint,
	"del_dt" timestamp
);
--> statement-breakpoint
CREATE TABLE "items" (
	"item_no" serial PRIMARY KEY NOT NULL,
	"prj_no" integer NOT NULL,
	"item_nm" text NOT NULL,
	"cls_main" text,
	"cls_sub" text,
	"item_grd" text,
	"logline" text,
	"app_desc" text,
	"visual_feat" text,
	"attr_type" text,
	"dmg_type" text,
	"main_func" text,
	"use_yn" varchar(1) DEFAULT 'Y',
	"shrn_yn" varchar(1) DEFAULT 'N',
	"del_yn" varchar(1) DEFAULT 'N',
	"crt_no" bigint,
	"crt_dt" timestamp,
	"updt_no" bigint,
	"updt_dt" timestamp,
	"del_no" bigint,
	"del_dt" timestamp
);
--> statement-breakpoint
CREATE TABLE "lores" (
	"lore_no" serial PRIMARY KEY NOT NULL,
	"prj_no" integer NOT NULL,
	"lore_nm" text NOT NULL,
	"lore_type" text,
	"main_subj" text,
	"smry" text,
	"trans_mthd" text,
	"pub_perc" text,
	"lore_plot" text,
	"real_fact" text,
	"dist_rsn" text,
	"diff_desc" text,
	"cltr_impact" text,
	"plot_conn" text,
	"rmk" text,
	"use_yn" varchar(1) DEFAULT 'Y',
	"shrn_yn" varchar(1) DEFAULT 'N',
	"del_yn" varchar(1) DEFAULT 'N',
	"crt_no" bigint,
	"crt_dt" timestamp,
	"updt_no" bigint,
	"updt_dt" timestamp,
	"del_no" bigint,
	"del_dt" timestamp
);
--> statement-breakpoint
CREATE TABLE "nations" (
	"ntn_no" serial PRIMARY KEY NOT NULL,
	"prj_no" integer NOT NULL,
	"ntn_nm" text NOT NULL,
	"ntn_type" text,
	"logline" text,
	"capital_nm" text,
	"ruler_txt" text,
	"pol_sys" text,
	"admin_law" text,
	"state_rlgn" text,
	"rlgn_desc" text,
	"nat_idlg" text,
	"main_plcy" text,
	"taboo_act" text,
	"dipl_plcy" text,
	"intr_cnfl" text,
	"hidden_fact" text,
	"econ_struct" text,
	"soc_cltr" text,
	"mil_pwr" text,
	"hist_desc" text,
	"curr_issue" text,
	"use_yn" varchar(1) DEFAULT 'Y',
	"shrn_yn" varchar(1) DEFAULT 'N',
	"del_yn" varchar(1) DEFAULT 'N',
	"crt_no" bigint,
	"crt_dt" timestamp,
	"updt_no" bigint,
	"updt_dt" timestamp,
	"del_no" bigint,
	"del_dt" timestamp
);
--> statement-breakpoint
CREATE TABLE "organizations" (
	"org_no" serial PRIMARY KEY NOT NULL,
	"prj_no" integer NOT NULL,
	"org_nm" text NOT NULL,
	"org_type" text,
	"logline" text,
	"org_theme" text,
	"purp_pub" text,
	"purp_hid" text,
	"fnd_bg" text,
	"org_strc" text,
	"org_scale" text,
	"join_cond" text,
	"exit_rule" text,
	"main_act" text,
	"act_area" text,
	"act_mthd" text,
	"fund_src" text,
	"key_fig" text,
	"hist_desc" text,
	"curr_stat" text,
	"use_yn" varchar(1) DEFAULT 'Y',
	"shrn_yn" varchar(1) DEFAULT 'N',
	"del_yn" varchar(1) DEFAULT 'N',
	"crt_no" bigint,
	"crt_dt" timestamp,
	"updt_no" bigint,
	"updt_dt" timestamp,
	"del_no" bigint,
	"del_dt" timestamp
);
--> statement-breakpoint
CREATE TABLE "project_abilities" (
	"ability_no" serial PRIMARY KEY NOT NULL,
	"prj_no" integer NOT NULL,
	"ability_nm" text NOT NULL,
	"ability_type" text,
	"ability_lcls" text,
	"ability_expln" text,
	"trgt_type" text,
	"dmg_type" text,
	"stat_eff_type" text,
	"use_cost" text,
	"cool_time" integer,
	"cast_time" integer,
	"use_cnd" text,
	"use_yn" varchar(1) DEFAULT 'Y',
	"shrn_yn" varchar(1) DEFAULT 'N',
	"del_yn" varchar(1) DEFAULT 'N',
	"crt_no" bigint,
	"crt_dt" timestamp,
	"updt_no" bigint,
	"updt_dt" timestamp,
	"del_no" bigint,
	"del_dt" timestamp
);
--> statement-breakpoint
CREATE TABLE "project_traits" (
	"trait_no" serial PRIMARY KEY NOT NULL,
	"prj_no" integer NOT NULL,
	"trait_nm" text NOT NULL,
	"trait_expln" text,
	"trait_lcls" text,
	"trait_mcls" text,
	"aply_trgt" text,
	"cnfl_trait_no" integer,
	"cnfl_trait_type" varchar(20),
	"use_yn" varchar(1) DEFAULT 'Y',
	"shrn_yn" varchar(1) DEFAULT 'N',
	"del_yn" varchar(1) DEFAULT 'N',
	"crt_no" bigint,
	"crt_dt" timestamp,
	"updt_no" bigint,
	"updt_dt" timestamp,
	"del_no" bigint,
	"del_dt" timestamp
);
--> statement-breakpoint
CREATE TABLE "projects" (
	"prj_no" serial PRIMARY KEY NOT NULL,
	"user_no" integer NOT NULL,
	"prj_nm" text NOT NULL,
	"genre_type" text,
	"prj_desc" text,
	"cvr_img_url" text,
	"prj_expln" text,
	"prj_ver" text,
	"use_yn" varchar(1) DEFAULT 'Y',
	"shrn_yn" varchar(1) DEFAULT 'N',
	"del_yn" varchar(1) DEFAULT 'N',
	"crt_no" bigint,
	"crt_dt" timestamp,
	"updt_no" bigint,
	"updt_dt" timestamp,
	"del_no" bigint,
	"del_dt" timestamp
);
--> statement-breakpoint
CREATE TABLE "regions" (
	"region_no" serial PRIMARY KEY NOT NULL,
	"prj_no" integer NOT NULL,
	"up_region_no" integer,
	"region_nm" text NOT NULL,
	"region_type" text,
	"explor_stat" text,
	"region_expln" text,
	"loc_desc" text,
	"climate_env" text,
	"terrain_feat" text,
	"env_spec" text,
	"func_feat" text,
	"danger_lvl" text,
	"danger_fctr" text,
	"inhabit_info" text,
	"unknown_entity" text,
	"main_fclty" text,
	"rsrc_list" text,
	"ntn_no" integer,
	"use_yn" varchar(1) DEFAULT 'Y',
	"shrn_yn" varchar(1) DEFAULT 'N',
	"del_yn" varchar(1) DEFAULT 'N',
	"crt_no" bigint,
	"crt_dt" timestamp,
	"updt_no" bigint,
	"updt_dt" timestamp,
	"del_no" bigint,
	"del_dt" timestamp
);
--> statement-breakpoint
CREATE TABLE "traits" (
	"trait_no" serial PRIMARY KEY NOT NULL,
	"trait_nm" text NOT NULL,
	"trait_expln" text,
	"trait_lcls" text,
	"trait_mcls" text,
	"aply_trgt" varchar(20),
	"cnfl_trait_no" integer,
	"use_yn" varchar(1) DEFAULT 'Y',
	"shrn_yn" varchar(1) DEFAULT 'N',
	"del_yn" varchar(1) DEFAULT 'N',
	"crt_no" bigint,
	"crt_dt" timestamp,
	"updt_no" bigint,
	"updt_dt" timestamp,
	"del_no" bigint,
	"del_dt" timestamp
);
--> statement-breakpoint
CREATE TABLE "users" (
	"user_no" serial PRIMARY KEY NOT NULL,
	"user_eml" text NOT NULL,
	"user_nm" text,
	"user_role" varchar(20),
	"profl_img_url" text,
	"biogp" text,
	"enpswd" text,
	"resh_token" text,
	"acnt_lck_yn" varchar(1),
	"lgn_fail_nmtm" bigint,
	"last_lgn_dt" timestamp,
	"last_lgn_ip" text,
	"last_pswd_chg_dt" timestamp,
	"eml_auth_yn" varchar(1),
	"mkt_recp_agre_yn" varchar(1),
	"use_yn" varchar(1) DEFAULT 'Y',
	"shrn_yn" varchar(1) DEFAULT 'N',
	"del_yn" varchar(1) DEFAULT 'N',
	"crt_no" bigint,
	"crt_dt" timestamp,
	"updt_no" bigint,
	"updt_dt" timestamp,
	"del_no" bigint,
	"del_dt" timestamp
);
--> statement-breakpoint
ALTER TABLE "char_ability_maps" ADD CONSTRAINT "char_ability_maps_char_no_characters_char_no_fk" FOREIGN KEY ("char_no") REFERENCES "public"."characters"("char_no") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "char_trait_maps" ADD CONSTRAINT "char_trait_maps_char_no_characters_char_no_fk" FOREIGN KEY ("char_no") REFERENCES "public"."characters"("char_no") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "characters" ADD CONSTRAINT "characters_prj_no_projects_prj_no_fk" FOREIGN KEY ("prj_no") REFERENCES "public"."projects"("prj_no") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "characters" ADD CONSTRAINT "characters_race_no_creatures_creature_no_fk" FOREIGN KEY ("race_no") REFERENCES "public"."creatures"("creature_no") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "characters" ADD CONSTRAINT "characters_ntn_no_nations_ntn_no_fk" FOREIGN KEY ("ntn_no") REFERENCES "public"."nations"("ntn_no") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "characters" ADD CONSTRAINT "characters_org_no_organizations_org_no_fk" FOREIGN KEY ("org_no") REFERENCES "public"."organizations"("org_no") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "core_rules" ADD CONSTRAINT "core_rules_prj_no_projects_prj_no_fk" FOREIGN KEY ("prj_no") REFERENCES "public"."projects"("prj_no") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "creature_ability_maps" ADD CONSTRAINT "creature_ability_maps_creature_no_creatures_creature_no_fk" FOREIGN KEY ("creature_no") REFERENCES "public"."creatures"("creature_no") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "creature_trait_maps" ADD CONSTRAINT "creature_trait_maps_creature_no_creatures_creature_no_fk" FOREIGN KEY ("creature_no") REFERENCES "public"."creatures"("creature_no") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "creatures" ADD CONSTRAINT "creatures_prj_no_projects_prj_no_fk" FOREIGN KEY ("prj_no") REFERENCES "public"."projects"("prj_no") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "events" ADD CONSTRAINT "events_prj_no_projects_prj_no_fk" FOREIGN KEY ("prj_no") REFERENCES "public"."projects"("prj_no") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "items" ADD CONSTRAINT "items_prj_no_projects_prj_no_fk" FOREIGN KEY ("prj_no") REFERENCES "public"."projects"("prj_no") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lores" ADD CONSTRAINT "lores_prj_no_projects_prj_no_fk" FOREIGN KEY ("prj_no") REFERENCES "public"."projects"("prj_no") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "nations" ADD CONSTRAINT "nations_prj_no_projects_prj_no_fk" FOREIGN KEY ("prj_no") REFERENCES "public"."projects"("prj_no") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "organizations" ADD CONSTRAINT "organizations_prj_no_projects_prj_no_fk" FOREIGN KEY ("prj_no") REFERENCES "public"."projects"("prj_no") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_abilities" ADD CONSTRAINT "project_abilities_prj_no_projects_prj_no_fk" FOREIGN KEY ("prj_no") REFERENCES "public"."projects"("prj_no") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_traits" ADD CONSTRAINT "project_traits_prj_no_projects_prj_no_fk" FOREIGN KEY ("prj_no") REFERENCES "public"."projects"("prj_no") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "projects" ADD CONSTRAINT "projects_user_no_users_user_no_fk" FOREIGN KEY ("user_no") REFERENCES "public"."users"("user_no") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "regions" ADD CONSTRAINT "regions_prj_no_projects_prj_no_fk" FOREIGN KEY ("prj_no") REFERENCES "public"."projects"("prj_no") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "regions" ADD CONSTRAINT "regions_up_region_no_regions_region_no_fk" FOREIGN KEY ("up_region_no") REFERENCES "public"."regions"("region_no") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "regions" ADD CONSTRAINT "regions_ntn_no_nations_ntn_no_fk" FOREIGN KEY ("ntn_no") REFERENCES "public"."nations"("ntn_no") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "traits" ADD CONSTRAINT "traits_cnfl_trait_no_traits_trait_no_fk" FOREIGN KEY ("cnfl_trait_no") REFERENCES "public"."traits"("trait_no") ON DELETE no action ON UPDATE no action;