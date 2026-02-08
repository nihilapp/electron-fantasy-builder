-- DROP SCHEMA public;

CREATE SCHEMA public AUTHORIZATION pg_database_owner;

COMMENT ON SCHEMA public IS 'standard public schema';

-- DROP SEQUENCE public.abilities_ability_no_seq;

CREATE SEQUENCE public.abilities_ability_no_seq INCREMENT BY 1 MINVALUE 1 MAXVALUE 9223372036854775807 START 1 CACHE 1 NO CYCLE;

-- Permissions

ALTER SEQUENCE public.abilities_ability_no_seq OWNER TO neondb_owner;

GRANT ALL ON SEQUENCE public.abilities_ability_no_seq TO neondb_owner;

-- DROP SEQUENCE public.char_group_relations_rel_no_seq;

CREATE SEQUENCE public.char_group_relations_rel_no_seq INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START 1 CACHE 1 NO CYCLE;

-- Permissions

ALTER SEQUENCE public.char_group_relations_rel_no_seq OWNER TO neondb_owner;

GRANT ALL ON SEQUENCE public.char_group_relations_rel_no_seq TO neondb_owner;

-- DROP SEQUENCE public.char_item_maps_own_no_seq;

CREATE SEQUENCE public.char_item_maps_own_no_seq INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START 1 CACHE 1 NO CYCLE;

-- Permissions

ALTER SEQUENCE public.char_item_maps_own_no_seq OWNER TO neondb_owner;

GRANT ALL ON SEQUENCE public.char_item_maps_own_no_seq TO neondb_owner;

-- DROP SEQUENCE public.char_relations_rel_no_seq;

CREATE SEQUENCE public.char_relations_rel_no_seq INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START 1 CACHE 1 NO CYCLE;

-- Permissions

ALTER SEQUENCE public.char_relations_rel_no_seq OWNER TO neondb_owner;

GRANT ALL ON SEQUENCE public.char_relations_rel_no_seq TO neondb_owner;

-- DROP SEQUENCE public.characters_char_no_seq;

CREATE SEQUENCE public.characters_char_no_seq INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START 1 CACHE 1 NO CYCLE;

-- Permissions

ALTER SEQUENCE public.characters_char_no_seq OWNER TO neondb_owner;

GRANT ALL ON SEQUENCE public.characters_char_no_seq TO neondb_owner;

-- DROP SEQUENCE public.core_rules_core_no_seq;

CREATE SEQUENCE public.core_rules_core_no_seq INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START 1 CACHE 1 NO CYCLE;

-- Permissions

ALTER SEQUENCE public.core_rules_core_no_seq OWNER TO neondb_owner;

GRANT ALL ON SEQUENCE public.core_rules_core_no_seq TO neondb_owner;

-- DROP SEQUENCE public.creature_skill_maps_map_no_seq;

CREATE SEQUENCE public.creature_skill_maps_map_no_seq INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START 1 CACHE 1 NO CYCLE;

-- Permissions

ALTER SEQUENCE public.creature_skill_maps_map_no_seq OWNER TO neondb_owner;

GRANT ALL ON SEQUENCE public.creature_skill_maps_map_no_seq TO neondb_owner;

-- DROP SEQUENCE public.creature_trait_maps_map_no_seq;

CREATE SEQUENCE public.creature_trait_maps_map_no_seq INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START 1 CACHE 1 NO CYCLE;

-- Permissions

ALTER SEQUENCE public.creature_trait_maps_map_no_seq OWNER TO neondb_owner;

GRANT ALL ON SEQUENCE public.creature_trait_maps_map_no_seq TO neondb_owner;

-- DROP SEQUENCE public.creatures_creature_no_seq;

CREATE SEQUENCE public.creatures_creature_no_seq INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START 1 CACHE 1 NO CYCLE;

-- Permissions

ALTER SEQUENCE public.creatures_creature_no_seq OWNER TO neondb_owner;

GRANT ALL ON SEQUENCE public.creatures_creature_no_seq TO neondb_owner;

-- DROP SEQUENCE public.event_entries_entry_no_seq;

CREATE SEQUENCE public.event_entries_entry_no_seq INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START 1 CACHE 1 NO CYCLE;

-- Permissions

ALTER SEQUENCE public.event_entries_entry_no_seq OWNER TO neondb_owner;

GRANT ALL ON SEQUENCE public.event_entries_entry_no_seq TO neondb_owner;

-- DROP SEQUENCE public.events_event_no_seq;

CREATE SEQUENCE public.events_event_no_seq INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START 1 CACHE 1 NO CYCLE;

-- Permissions

ALTER SEQUENCE public.events_event_no_seq OWNER TO neondb_owner;

GRANT ALL ON SEQUENCE public.events_event_no_seq TO neondb_owner;

-- DROP SEQUENCE public.group_relations_rel_no_seq;

CREATE SEQUENCE public.group_relations_rel_no_seq INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START 1 CACHE 1 NO CYCLE;

-- Permissions

ALTER SEQUENCE public.group_relations_rel_no_seq OWNER TO neondb_owner;

GRANT ALL ON SEQUENCE public.group_relations_rel_no_seq TO neondb_owner;

-- DROP SEQUENCE public.item_skill_maps_map_no_seq;

CREATE SEQUENCE public.item_skill_maps_map_no_seq INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START 1 CACHE 1 NO CYCLE;

-- Permissions

ALTER SEQUENCE public.item_skill_maps_map_no_seq OWNER TO neondb_owner;

GRANT ALL ON SEQUENCE public.item_skill_maps_map_no_seq TO neondb_owner;

-- DROP SEQUENCE public.item_trait_maps_map_no_seq;

CREATE SEQUENCE public.item_trait_maps_map_no_seq INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START 1 CACHE 1 NO CYCLE;

-- Permissions

ALTER SEQUENCE public.item_trait_maps_map_no_seq OWNER TO neondb_owner;

GRANT ALL ON SEQUENCE public.item_trait_maps_map_no_seq TO neondb_owner;

-- DROP SEQUENCE public.items_item_no_seq;

CREATE SEQUENCE public.items_item_no_seq INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START 1 CACHE 1 NO CYCLE;

-- Permissions

ALTER SEQUENCE public.items_item_no_seq OWNER TO neondb_owner;

GRANT ALL ON SEQUENCE public.items_item_no_seq TO neondb_owner;

-- DROP SEQUENCE public.lore_char_maps_map_no_seq;

CREATE SEQUENCE public.lore_char_maps_map_no_seq INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START 1 CACHE 1 NO CYCLE;

-- Permissions

ALTER SEQUENCE public.lore_char_maps_map_no_seq OWNER TO neondb_owner;

GRANT ALL ON SEQUENCE public.lore_char_maps_map_no_seq TO neondb_owner;

-- DROP SEQUENCE public.lore_item_maps_map_no_seq;

CREATE SEQUENCE public.lore_item_maps_map_no_seq INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START 1 CACHE 1 NO CYCLE;

-- Permissions

ALTER SEQUENCE public.lore_item_maps_map_no_seq OWNER TO neondb_owner;

GRANT ALL ON SEQUENCE public.lore_item_maps_map_no_seq TO neondb_owner;

-- DROP SEQUENCE public.lores_lore_no_seq;

CREATE SEQUENCE public.lores_lore_no_seq INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START 1 CACHE 1 NO CYCLE;

-- Permissions

ALTER SEQUENCE public.lores_lore_no_seq OWNER TO neondb_owner;

GRANT ALL ON SEQUENCE public.lores_lore_no_seq TO neondb_owner;

-- DROP SEQUENCE public.nations_ntn_no_seq;

CREATE SEQUENCE public.nations_ntn_no_seq INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START 1 CACHE 1 NO CYCLE;

-- Permissions

ALTER SEQUENCE public.nations_ntn_no_seq OWNER TO neondb_owner;

GRANT ALL ON SEQUENCE public.nations_ntn_no_seq TO neondb_owner;

-- DROP SEQUENCE public.ntn_trait_maps_map_no_seq;

CREATE SEQUENCE public.ntn_trait_maps_map_no_seq INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START 1 CACHE 1 NO CYCLE;

-- Permissions

ALTER SEQUENCE public.ntn_trait_maps_map_no_seq OWNER TO neondb_owner;

GRANT ALL ON SEQUENCE public.ntn_trait_maps_map_no_seq TO neondb_owner;

-- DROP SEQUENCE public.org_trait_maps_map_no_seq;

CREATE SEQUENCE public.org_trait_maps_map_no_seq INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START 1 CACHE 1 NO CYCLE;

-- Permissions

ALTER SEQUENCE public.org_trait_maps_map_no_seq OWNER TO neondb_owner;

GRANT ALL ON SEQUENCE public.org_trait_maps_map_no_seq TO neondb_owner;

-- DROP SEQUENCE public.organizations_org_no_seq;

CREATE SEQUENCE public.organizations_org_no_seq INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START 1 CACHE 1 NO CYCLE;

-- Permissions

ALTER SEQUENCE public.organizations_org_no_seq OWNER TO neondb_owner;

GRANT ALL ON SEQUENCE public.organizations_org_no_seq TO neondb_owner;

-- DROP SEQUENCE public.project_abilities_ability_no_seq;

CREATE SEQUENCE public.project_abilities_ability_no_seq INCREMENT BY 1 MINVALUE 1 MAXVALUE 9223372036854775807 START 1 CACHE 1 NO CYCLE;

-- Permissions

ALTER SEQUENCE public.project_abilities_ability_no_seq OWNER TO neondb_owner;

GRANT ALL ON SEQUENCE public.project_abilities_ability_no_seq TO neondb_owner;

-- DROP SEQUENCE public.project_skills_skill_no_seq;

CREATE SEQUENCE public.project_skills_skill_no_seq INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START 1 CACHE 1 NO CYCLE;

-- Permissions

ALTER SEQUENCE public.project_skills_skill_no_seq OWNER TO neondb_owner;

GRANT ALL ON SEQUENCE public.project_skills_skill_no_seq TO neondb_owner;

-- DROP SEQUENCE public.project_traits_trait_no_seq;

CREATE SEQUENCE public.project_traits_trait_no_seq INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START 1 CACHE 1 NO CYCLE;

-- Permissions

ALTER SEQUENCE public.project_traits_trait_no_seq OWNER TO neondb_owner;

GRANT ALL ON SEQUENCE public.project_traits_trait_no_seq TO neondb_owner;

-- DROP SEQUENCE public.projects_prj_no_seq;

CREATE SEQUENCE public.projects_prj_no_seq INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START 1 CACHE 1 NO CYCLE;

-- Permissions

ALTER SEQUENCE public.projects_prj_no_seq OWNER TO neondb_owner;

GRANT ALL ON SEQUENCE public.projects_prj_no_seq TO neondb_owner;

-- DROP SEQUENCE public.region_trait_maps_map_no_seq;

CREATE SEQUENCE public.region_trait_maps_map_no_seq INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START 1 CACHE 1 NO CYCLE;

-- Permissions

ALTER SEQUENCE public.region_trait_maps_map_no_seq OWNER TO neondb_owner;

GRANT ALL ON SEQUENCE public.region_trait_maps_map_no_seq TO neondb_owner;

-- DROP SEQUENCE public.regions_region_no_seq;

CREATE SEQUENCE public.regions_region_no_seq INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START 1 CACHE 1 NO CYCLE;

-- Permissions

ALTER SEQUENCE public.regions_region_no_seq OWNER TO neondb_owner;

GRANT ALL ON SEQUENCE public.regions_region_no_seq TO neondb_owner;

-- DROP SEQUENCE public.skills_skill_no_seq;

CREATE SEQUENCE public.skills_skill_no_seq INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START 1 CACHE 1 NO CYCLE;

-- Permissions

ALTER SEQUENCE public.skills_skill_no_seq OWNER TO neondb_owner;

GRANT ALL ON SEQUENCE public.skills_skill_no_seq TO neondb_owner;

-- DROP SEQUENCE public.traits_trait_no_seq;

CREATE SEQUENCE public.traits_trait_no_seq INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START 1 CACHE 1 NO CYCLE;

-- Permissions

ALTER SEQUENCE public.traits_trait_no_seq OWNER TO neondb_owner;

GRANT ALL ON SEQUENCE public.traits_trait_no_seq TO neondb_owner;

-- DROP SEQUENCE public.users_user_no_seq;

CREATE SEQUENCE public.users_user_no_seq INCREMENT BY 1 MINVALUE 1 MAXVALUE 9223372036854775807 START 1 CACHE 1 NO CYCLE;

-- Permissions

ALTER SEQUENCE public.users_user_no_seq OWNER TO neondb_owner;

GRANT ALL ON SEQUENCE public.users_user_no_seq TO neondb_owner;
-- public.abilities definition

-- Drop table

-- DROP TABLE public.abilities;

CREATE TABLE public.abilities (
    ability_no int8 GENERATED BY DEFAULT AS IDENTITY (
        INCREMENT BY 1 MINVALUE 1 MAXVALUE 9223372036854775807 START 1 CACHE 1 NO CYCLE
    ) NOT NULL,
    crt_dt timestamp(6) NULL,
    crt_no int8 NULL,
    del_dt timestamp(6) NULL,
    del_no int8 NULL,
    del_yn varchar(1) DEFAULT 'N'::character varying NULL,
    shrn_yn varchar(1) DEFAULT 'N'::character varying NULL,
    updt_dt timestamp(6) NULL,
    updt_no int8 NULL,
    use_yn varchar(1) DEFAULT 'Y'::character varying NULL,
    ability_nm text NOT NULL,
    ability_domain text NOT NULL,
    ability_source text NOT NULL,
    ability_lineage text NOT NULL,
    ability_form text NOT NULL,
    tags text NULL,
    ability_expln text NULL,
    cast_time int4 NULL,
    cool_time int4 NULL,
    dmg_type text NULL,
    stat_eff_type text NULL,
    trgt_type text NULL,
    use_cnd text NULL,
    use_cost text NULL,
    CONSTRAINT abilities_pkey PRIMARY KEY (ability_no)
);

CREATE INDEX idx_abilities_ability_nm ON public.abilities USING btree (ability_nm);

-- Permissions

ALTER TABLE public.abilities OWNER TO neondb_owner;

GRANT ALL ON TABLE public.abilities TO neondb_owner;

-- public.users definition

-- Drop table

-- DROP TABLE public.users;

CREATE TABLE public.users (
    user_no bigserial NOT NULL,
    user_eml varchar(255) NULL,
    user_nm varchar(255) NULL,
    user_role varchar(255) NULL,
    profl_img_url varchar(255) NULL,
    biogp varchar(255) NULL,
    enpswd varchar(255) NULL,
    resh_token varchar(255) NULL,
    acnt_lck_yn varchar(1) NULL,
    lgn_fail_nmtm int4 NULL,
    last_lgn_dt timestamp NULL,
    last_lgn_ip varchar(255) NULL,
    last_pswd_chg_dt timestamp NULL,
    eml_auth_yn varchar(1) NULL,
    mkt_recp_agre_yn varchar(1) NULL,
    use_yn varchar(1) NULL,
    shrn_yn varchar(1) NULL,
    del_yn varchar(1) NULL,
    crt_no int8 NULL,
    crt_dt timestamp DEFAULT CURRENT_TIMESTAMP NULL,
    updt_no int8 NULL,
    updt_dt timestamp DEFAULT CURRENT_TIMESTAMP NULL,
    del_no int8 NULL,
    del_dt timestamp NULL,
    CONSTRAINT users_pkey PRIMARY KEY (user_no),
    CONSTRAINT users_crt_no_fkey FOREIGN KEY (crt_no) REFERENCES public.users (user_no),
    CONSTRAINT users_del_no_fkey FOREIGN KEY (del_no) REFERENCES public.users (user_no),
    CONSTRAINT users_updt_no_fkey FOREIGN KEY (updt_no) REFERENCES public.users (user_no)
);

CREATE INDEX idx_users_user_eml ON public.users USING btree (user_eml);

CREATE INDEX ix_users_user_eml ON public.users USING btree (user_eml);

-- Permissions

ALTER TABLE public.users OWNER TO neondb_owner;

GRANT ALL ON TABLE public.users TO neondb_owner;

-- public.projects definition

-- Drop table

-- DROP TABLE public.projects;

CREATE TABLE public.projects (
    prj_no bigserial NOT NULL,
    user_no int8 NULL,
    prj_nm varchar(255) NOT NULL,
    genre_type varchar(255) NULL,
    prj_desc text NULL,
    cvr_img_url varchar(255) NULL,
    prj_expln varchar NULL,
    prj_ver varchar(255) NULL,
    use_yn varchar(1) DEFAULT 'Y'::character varying NULL,
    shrn_yn varchar(1) DEFAULT 'Y'::character varying NULL,
    del_yn varchar(1) DEFAULT 'N'::character varying NULL,
    crt_no int8 NULL,
    crt_dt timestamp DEFAULT CURRENT_TIMESTAMP NULL,
    updt_no int8 NULL,
    updt_dt timestamp DEFAULT CURRENT_TIMESTAMP NULL,
    del_no int8 NULL,
    del_dt timestamp NULL,
    CONSTRAINT projects_pkey PRIMARY KEY (prj_no),
    CONSTRAINT projects_crt_no_fkey FOREIGN KEY (crt_no) REFERENCES public.users (user_no),
    CONSTRAINT projects_del_no_fkey FOREIGN KEY (del_no) REFERENCES public.users (user_no),
    CONSTRAINT projects_updt_no_fkey FOREIGN KEY (updt_no) REFERENCES public.users (user_no),
    CONSTRAINT projects_user_no_fkey FOREIGN KEY (user_no) REFERENCES public.users (user_no)
);

CREATE INDEX idx_projects_prj_nm ON public.projects USING btree (prj_nm);

CREATE INDEX idx_projects_user_no ON public.projects USING btree (user_no);

CREATE INDEX ix_projects_prj_nm ON public.projects USING btree (prj_nm);

CREATE INDEX ix_projects_user_no ON public.projects USING btree (user_no);

-- Permissions

ALTER TABLE public.projects OWNER TO neondb_owner;

GRANT ALL ON TABLE public.projects TO neondb_owner;

-- public.skills definition

-- Drop table

-- DROP TABLE public.skills;

CREATE TABLE public.skills (
    skill_no serial4 NOT NULL,
    skill_nm varchar NOT NULL,
    skill_type varchar NOT NULL,
    skill_lcls varchar NOT NULL,
    skill_expln text NULL,
    trgt_type varchar NULL,
    dmg_type varchar NULL,
    stat_eff_type varchar NULL,
    use_cost varchar NULL,
    cool_time varchar NULL,
    cast_time varchar NULL,
    use_cnd text NULL,
    use_yn varchar DEFAULT 'Y'::character varying NULL,
    shrn_yn varchar DEFAULT 'Y'::character varying NULL,
    del_yn varchar DEFAULT 'N'::character varying NULL,
    crt_no int8 NULL,
    crt_dt timestamp DEFAULT CURRENT_TIMESTAMP NULL,
    updt_no int8 NULL,
    updt_dt timestamp DEFAULT CURRENT_TIMESTAMP NULL,
    del_no int8 NULL,
    del_dt timestamp NULL,
    CONSTRAINT skills_pkey PRIMARY KEY (skill_no),
    CONSTRAINT skills_crt_no_fkey FOREIGN KEY (crt_no) REFERENCES public.users (user_no),
    CONSTRAINT skills_del_no_fkey FOREIGN KEY (del_no) REFERENCES public.users (user_no),
    CONSTRAINT skills_updt_no_fkey FOREIGN KEY (updt_no) REFERENCES public.users (user_no)
);

CREATE INDEX ix_skills_skill_nm ON public.skills USING btree (skill_nm);

-- Permissions

ALTER TABLE public.skills OWNER TO neondb_owner;

GRANT ALL ON TABLE public.skills TO neondb_owner;

-- public.traits definition

-- Drop table

-- DROP TABLE public.traits;

CREATE TABLE public.traits (
    trait_no bigserial NOT NULL,
    trait_nm varchar(255) NOT NULL,
    trait_expln text NULL,
    trait_lcls varchar(255) NOT NULL,
    trait_mcls varchar(255) NOT NULL,
    aply_trgt varchar(255) NULL,
    cnfl_trait_no int8 NULL,
    use_yn varchar(1) DEFAULT 'Y'::character varying NULL,
    shrn_yn varchar(1) DEFAULT 'Y'::character varying NULL,
    del_yn varchar(1) DEFAULT 'N'::character varying NULL,
    crt_no int8 NULL,
    crt_dt timestamp DEFAULT CURRENT_TIMESTAMP NULL,
    updt_no int8 NULL,
    updt_dt timestamp DEFAULT CURRENT_TIMESTAMP NULL,
    del_no int8 NULL,
    del_dt timestamp NULL,
    CONSTRAINT traits_pkey PRIMARY KEY (trait_no),
    CONSTRAINT traits_cnfl_trait_no_fkey FOREIGN KEY (cnfl_trait_no) REFERENCES public.traits (trait_no),
    CONSTRAINT traits_crt_no_fkey FOREIGN KEY (crt_no) REFERENCES public.users (user_no),
    CONSTRAINT traits_del_no_fkey FOREIGN KEY (del_no) REFERENCES public.users (user_no),
    CONSTRAINT traits_updt_no_fkey FOREIGN KEY (updt_no) REFERENCES public.users (user_no)
);

CREATE INDEX idx_traits_cnfl_trait_no ON public.traits USING btree (cnfl_trait_no);

CREATE INDEX idx_traits_trait_nm ON public.traits USING btree (trait_nm);

CREATE INDEX ix_traits_cnfl_trait_no ON public.traits USING btree (cnfl_trait_no);

CREATE INDEX ix_traits_trait_nm ON public.traits USING btree (trait_nm);

-- Permissions

ALTER TABLE public.traits OWNER TO neondb_owner;

GRANT ALL ON TABLE public.traits TO neondb_owner;

-- public.core_rules definition

-- Drop table

-- DROP TABLE public.core_rules;

CREATE TABLE public.core_rules (
    core_no serial4 NOT NULL,
    prj_no int4 NOT NULL,
    core_nm varchar NOT NULL,
    def_desc text NULL,
    aply_scope text NULL,
    strc_elem text NULL,
    mech_desc text NULL,
    narr_aply text NULL,
    keywords varchar NULL,
    link_docs text NULL,
    rmk text NULL,
    use_yn varchar DEFAULT 'Y'::character varying NULL,
    shrn_yn varchar DEFAULT 'Y'::character varying NULL,
    del_yn varchar DEFAULT 'N'::character varying NULL,
    crt_no int8 NULL,
    crt_dt timestamp DEFAULT CURRENT_TIMESTAMP NULL,
    updt_no int8 NULL,
    updt_dt timestamp DEFAULT CURRENT_TIMESTAMP NULL,
    del_no int8 NULL,
    del_dt timestamp NULL,
    CONSTRAINT core_rules_pkey PRIMARY KEY (core_no),
    CONSTRAINT core_rules_crt_no_fkey FOREIGN KEY (crt_no) REFERENCES public.users (user_no),
    CONSTRAINT core_rules_del_no_fkey FOREIGN KEY (del_no) REFERENCES public.users (user_no),
    CONSTRAINT core_rules_prj_no_fkey FOREIGN KEY (prj_no) REFERENCES public.projects (prj_no),
    CONSTRAINT core_rules_updt_no_fkey FOREIGN KEY (updt_no) REFERENCES public.users (user_no)
);

CREATE INDEX ix_core_rules_prj_no ON public.core_rules USING btree (prj_no);

-- Permissions

ALTER TABLE public.core_rules OWNER TO neondb_owner;

GRANT ALL ON TABLE public.core_rules TO neondb_owner;

-- public.creatures definition

-- Drop table

-- DROP TABLE public.creatures;

CREATE TABLE public.creatures (
    creature_no serial4 NOT NULL,
    prj_no int4 NOT NULL,
    creature_nm varchar NOT NULL,
    creature_type varchar NOT NULL,
    danger_grd varchar NULL,
    ident_stat varchar NOT NULL,
    creature_expln text NULL,
    bio_char text NULL,
    lifespan_growth text NULL,
    body_feat text NULL,
    sense_diet text NULL,
    reprod_info text NULL,
    eco_habit text NULL,
    habitat_env text NULL,
    lang_name text NULL,
    life_style text NULL,
    faith_taboo text NULL,
    soc_struct text NULL,
    psych_tend text NULL,
    abil_weak text NULL,
    civ_tech_lvl text NULL,
    spec_trait text NULL,
    weakness text NULL,
    est_eco text NULL,
    rumor_lore text NULL,
    poten_thrt text NULL,
    intel_lvl varchar NULL,
    drop_rsrc text NULL,
    hostile_rel varchar NULL,
    hist_desc text NULL,
    rmk text NULL,
    use_yn varchar DEFAULT 'Y'::character varying NULL,
    shrn_yn varchar DEFAULT 'Y'::character varying NULL,
    del_yn varchar DEFAULT 'N'::character varying NULL,
    crt_no int8 NULL,
    crt_dt timestamp DEFAULT CURRENT_TIMESTAMP NULL,
    updt_no int8 NULL,
    updt_dt timestamp DEFAULT CURRENT_TIMESTAMP NULL,
    del_no int8 NULL,
    del_dt timestamp NULL,
    CONSTRAINT creatures_pkey PRIMARY KEY (creature_no),
    CONSTRAINT creatures_crt_no_fkey FOREIGN KEY (crt_no) REFERENCES public.users (user_no),
    CONSTRAINT creatures_del_no_fkey FOREIGN KEY (del_no) REFERENCES public.users (user_no),
    CONSTRAINT creatures_prj_no_fkey FOREIGN KEY (prj_no) REFERENCES public.projects (prj_no),
    CONSTRAINT creatures_updt_no_fkey FOREIGN KEY (updt_no) REFERENCES public.users (user_no)
);

CREATE INDEX ix_creatures_creature_nm ON public.creatures USING btree (creature_nm);

CREATE INDEX ix_creatures_prj_no ON public.creatures USING btree (prj_no);

-- Permissions

ALTER TABLE public.creatures OWNER TO neondb_owner;

GRANT ALL ON TABLE public.creatures TO neondb_owner;

-- public.events definition

-- Drop table

-- DROP TABLE public.events;

CREATE TABLE public.events (
    event_no serial4 NOT NULL,
    prj_no int4 NOT NULL,
    event_nm varchar NOT NULL,
    occur_time varchar NULL,
    occur_loc varchar NULL,
    smry text NULL,
    cause_pub text NULL,
    cause_real text NULL,
    side_a_char text NULL,
    side_a_org text NULL,
    side_a_ntn text NULL,
    side_b_char text NULL,
    side_b_org text NULL,
    side_b_ntn text NULL,
    side_c_char text NULL,
    side_c_org text NULL,
    side_c_ntn text NULL,
    flow_trgr text NULL,
    flow_crisis text NULL,
    flow_climax text NULL,
    flow_concl text NULL,
    dmg_rslt text NULL,
    soc_chng text NULL,
    curr_conn text NULL,
    rec_official text NULL,
    truth_hid text NULL,
    rmk text NULL,
    use_yn varchar DEFAULT 'Y'::character varying NULL,
    shrn_yn varchar DEFAULT 'Y'::character varying NULL,
    del_yn varchar DEFAULT 'N'::character varying NULL,
    crt_no int8 NULL,
    crt_dt timestamp DEFAULT CURRENT_TIMESTAMP NULL,
    updt_no int8 NULL,
    updt_dt timestamp DEFAULT CURRENT_TIMESTAMP NULL,
    del_no int8 NULL,
    del_dt timestamp NULL,
    CONSTRAINT events_pkey PRIMARY KEY (event_no),
    CONSTRAINT events_crt_no_fkey FOREIGN KEY (crt_no) REFERENCES public.users (user_no),
    CONSTRAINT events_del_no_fkey FOREIGN KEY (del_no) REFERENCES public.users (user_no),
    CONSTRAINT events_prj_no_fkey FOREIGN KEY (prj_no) REFERENCES public.projects (prj_no),
    CONSTRAINT events_updt_no_fkey FOREIGN KEY (updt_no) REFERENCES public.users (user_no)
);

CREATE INDEX ix_events_event_nm ON public.events USING btree (event_nm);

CREATE INDEX ix_events_prj_no ON public.events USING btree (prj_no);

-- Permissions

ALTER TABLE public.events OWNER TO neondb_owner;

GRANT ALL ON TABLE public.events TO neondb_owner;

-- public.group_relations definition

-- Drop table

-- DROP TABLE public.group_relations;

CREATE TABLE public.group_relations (
    rel_no serial4 NOT NULL,
    prj_no int4 NOT NULL,
    src_type varchar NOT NULL,
    src_no int4 NOT NULL,
    trgt_type varchar NOT NULL,
    trgt_no int4 NOT NULL,
    rel_type varchar NOT NULL,
    rel_desc text NULL,
    use_yn varchar DEFAULT 'Y'::character varying NULL,
    shrn_yn varchar DEFAULT 'Y'::character varying NULL,
    del_yn varchar DEFAULT 'N'::character varying NULL,
    crt_no int8 NULL,
    crt_dt timestamp DEFAULT CURRENT_TIMESTAMP NULL,
    updt_no int8 NULL,
    updt_dt timestamp DEFAULT CURRENT_TIMESTAMP NULL,
    del_no int8 NULL,
    del_dt timestamp NULL,
    CONSTRAINT group_relations_pkey PRIMARY KEY (rel_no),
    CONSTRAINT group_relations_crt_no_fkey FOREIGN KEY (crt_no) REFERENCES public.users (user_no),
    CONSTRAINT group_relations_del_no_fkey FOREIGN KEY (del_no) REFERENCES public.users (user_no),
    CONSTRAINT group_relations_prj_no_fkey FOREIGN KEY (prj_no) REFERENCES public.projects (prj_no),
    CONSTRAINT group_relations_updt_no_fkey FOREIGN KEY (updt_no) REFERENCES public.users (user_no)
);

CREATE INDEX ix_group_relations_prj_no ON public.group_relations USING btree (prj_no);

CREATE INDEX ix_group_relations_src_no ON public.group_relations USING btree (src_no);

CREATE INDEX ix_group_relations_trgt_no ON public.group_relations USING btree (trgt_no);

-- Permissions

ALTER TABLE public.group_relations OWNER TO neondb_owner;

GRANT ALL ON TABLE public.group_relations TO neondb_owner;

-- public.items definition

-- Drop table

-- DROP TABLE public.items;

CREATE TABLE public.items (
    item_no serial4 NOT NULL,
    prj_no int4 NOT NULL,
    item_nm varchar NOT NULL,
    cls_main varchar NOT NULL,
    cls_sub varchar NULL,
    item_grd varchar NULL,
    logline varchar NULL,
    app_desc text NULL,
    visual_feat text NULL,
    attr_type varchar NULL,
    dmg_type varchar NULL,
    main_func text NULL,
    sub_eff text NULL,
    spec_abil text NULL,
    ego_type varchar NULL,
    ego_desc text NULL,
    use_cond text NULL,
    use_mthd text NULL,
    trns_cond text NULL,
    strg_mthd text NULL,
    use_lmt text NULL,
    use_cost text NULL,
    side_eff text NULL,
    durability_desc text NULL,
    hist_past text NULL,
    curr_stat text NULL,
    rmk text NULL,
    use_yn varchar DEFAULT 'Y'::character varying NULL,
    shrn_yn varchar DEFAULT 'Y'::character varying NULL,
    del_yn varchar DEFAULT 'N'::character varying NULL,
    crt_no int8 NULL,
    crt_dt timestamp DEFAULT CURRENT_TIMESTAMP NULL,
    updt_no int8 NULL,
    updt_dt timestamp DEFAULT CURRENT_TIMESTAMP NULL,
    del_no int8 NULL,
    del_dt timestamp NULL,
    CONSTRAINT items_pkey PRIMARY KEY (item_no),
    CONSTRAINT items_crt_no_fkey FOREIGN KEY (crt_no) REFERENCES public.users (user_no),
    CONSTRAINT items_del_no_fkey FOREIGN KEY (del_no) REFERENCES public.users (user_no),
    CONSTRAINT items_prj_no_fkey FOREIGN KEY (prj_no) REFERENCES public.projects (prj_no),
    CONSTRAINT items_updt_no_fkey FOREIGN KEY (updt_no) REFERENCES public.users (user_no)
);

CREATE INDEX ix_items_item_nm ON public.items USING btree (item_nm);

CREATE INDEX ix_items_prj_no ON public.items USING btree (prj_no);

-- Permissions

ALTER TABLE public.items OWNER TO neondb_owner;

GRANT ALL ON TABLE public.items TO neondb_owner;

-- public.lores definition

-- Drop table

-- DROP TABLE public.lores;

CREATE TABLE public.lores (
    lore_no serial4 NOT NULL,
    prj_no int4 NOT NULL,
    lore_nm varchar NOT NULL,
    lore_type varchar NULL,
    main_subj varchar NULL,
    smry text NULL,
    trans_mthd varchar NULL,
    pub_perc text NULL,
    lore_plot text NULL,
    real_fact text NULL,
    dist_rsn text NULL,
    diff_desc text NULL,
    cltr_impact text NULL,
    plot_conn text NULL,
    rmk text NULL,
    use_yn varchar DEFAULT 'Y'::character varying NULL,
    shrn_yn varchar DEFAULT 'Y'::character varying NULL,
    del_yn varchar DEFAULT 'N'::character varying NULL,
    crt_no int8 NULL,
    crt_dt timestamp DEFAULT CURRENT_TIMESTAMP NULL,
    updt_no int8 NULL,
    updt_dt timestamp DEFAULT CURRENT_TIMESTAMP NULL,
    del_no int8 NULL,
    del_dt timestamp NULL,
    CONSTRAINT lores_pkey PRIMARY KEY (lore_no),
    CONSTRAINT lores_crt_no_fkey FOREIGN KEY (crt_no) REFERENCES public.users (user_no),
    CONSTRAINT lores_del_no_fkey FOREIGN KEY (del_no) REFERENCES public.users (user_no),
    CONSTRAINT lores_prj_no_fkey FOREIGN KEY (prj_no) REFERENCES public.projects (prj_no),
    CONSTRAINT lores_updt_no_fkey FOREIGN KEY (updt_no) REFERENCES public.users (user_no)
);

CREATE INDEX ix_lores_lore_nm ON public.lores USING btree (lore_nm);

CREATE INDEX ix_lores_prj_no ON public.lores USING btree (prj_no);

-- Permissions

ALTER TABLE public.lores OWNER TO neondb_owner;

GRANT ALL ON TABLE public.lores TO neondb_owner;

-- public.nations definition

-- Drop table

-- DROP TABLE public.nations;

CREATE TABLE public.nations (
    ntn_no serial4 NOT NULL,
    prj_no int4 NOT NULL,
    ntn_nm varchar NOT NULL,
    ntn_type varchar NULL,
    logline varchar NULL,
    capital_nm varchar NULL,
    ruler_txt varchar NULL,
    pol_sys varchar NULL,
    admin_law text NULL,
    state_rlgn varchar NULL,
    rlgn_desc text NULL,
    nat_idlg text NULL,
    main_plcy text NULL,
    taboo_act text NULL,
    dipl_plcy text NULL,
    intr_cnfl text NULL,
    hidden_fact text NULL,
    econ_struct text NULL,
    soc_cltr text NULL,
    mil_pwr text NULL,
    hist_desc text NULL,
    curr_issue text NULL,
    use_yn varchar DEFAULT 'Y'::character varying NULL,
    shrn_yn varchar DEFAULT 'Y'::character varying NULL,
    del_yn varchar DEFAULT 'N'::character varying NULL,
    crt_no int8 NULL,
    crt_dt timestamp DEFAULT CURRENT_TIMESTAMP NULL,
    updt_no int8 NULL,
    updt_dt timestamp DEFAULT CURRENT_TIMESTAMP NULL,
    del_no int8 NULL,
    del_dt timestamp NULL,
    CONSTRAINT nations_pkey PRIMARY KEY (ntn_no),
    CONSTRAINT nations_crt_no_fkey FOREIGN KEY (crt_no) REFERENCES public.users (user_no),
    CONSTRAINT nations_del_no_fkey FOREIGN KEY (del_no) REFERENCES public.users (user_no),
    CONSTRAINT nations_prj_no_fkey FOREIGN KEY (prj_no) REFERENCES public.projects (prj_no),
    CONSTRAINT nations_updt_no_fkey FOREIGN KEY (updt_no) REFERENCES public.users (user_no)
);

CREATE INDEX ix_nations_ntn_nm ON public.nations USING btree (ntn_nm);

CREATE INDEX ix_nations_prj_no ON public.nations USING btree (prj_no);

-- Permissions

ALTER TABLE public.nations OWNER TO neondb_owner;

GRANT ALL ON TABLE public.nations TO neondb_owner;

-- public.ntn_trait_maps definition

-- Drop table

-- DROP TABLE public.ntn_trait_maps;

CREATE TABLE public.ntn_trait_maps (
    map_no serial4 NOT NULL,
    ntn_no int4 NOT NULL,
    trait_no int4 NOT NULL,
    trait_type varchar NOT NULL,
    trait_rmk text NULL,
    use_yn varchar DEFAULT 'Y'::character varying NULL,
    shrn_yn varchar DEFAULT 'Y'::character varying NULL,
    del_yn varchar DEFAULT 'N'::character varying NULL,
    crt_no int8 NULL,
    crt_dt timestamp DEFAULT CURRENT_TIMESTAMP NULL,
    updt_no int8 NULL,
    updt_dt timestamp DEFAULT CURRENT_TIMESTAMP NULL,
    del_no int8 NULL,
    del_dt timestamp NULL,
    CONSTRAINT ntn_trait_maps_pkey PRIMARY KEY (map_no),
    CONSTRAINT ntn_trait_maps_crt_no_fkey FOREIGN KEY (crt_no) REFERENCES public.users (user_no),
    CONSTRAINT ntn_trait_maps_del_no_fkey FOREIGN KEY (del_no) REFERENCES public.users (user_no),
    CONSTRAINT ntn_trait_maps_ntn_no_fkey FOREIGN KEY (ntn_no) REFERENCES public.nations (ntn_no),
    CONSTRAINT ntn_trait_maps_updt_no_fkey FOREIGN KEY (updt_no) REFERENCES public.users (user_no)
);

CREATE INDEX ix_ntn_trait_maps_ntn_no ON public.ntn_trait_maps USING btree (ntn_no);

CREATE INDEX ix_ntn_trait_maps_trait_no ON public.ntn_trait_maps USING btree (trait_no);

-- Permissions

ALTER TABLE public.ntn_trait_maps OWNER TO neondb_owner;

GRANT ALL ON TABLE public.ntn_trait_maps TO neondb_owner;

-- public.organizations definition

-- Drop table

-- DROP TABLE public.organizations;

CREATE TABLE public.organizations (
    org_no serial4 NOT NULL,
    prj_no int4 NOT NULL,
    org_nm varchar NOT NULL,
    org_type varchar NULL,
    logline varchar NULL,
    org_theme varchar NULL,
    purp_pub varchar NULL,
    purp_hid varchar NULL,
    fnd_bg text NULL,
    org_strc text NULL,
    org_scale varchar NULL,
    join_cond text NULL,
    exit_rule text NULL,
    main_act text NULL,
    act_area text NULL,
    act_mthd text NULL,
    fund_src text NULL,
    key_fig text NULL,
    hist_desc text NULL,
    curr_stat text NULL,
    use_yn varchar DEFAULT 'Y'::character varying NULL,
    shrn_yn varchar DEFAULT 'Y'::character varying NULL,
    del_yn varchar DEFAULT 'N'::character varying NULL,
    crt_no int8 NULL,
    crt_dt timestamp DEFAULT CURRENT_TIMESTAMP NULL,
    updt_no int8 NULL,
    updt_dt timestamp DEFAULT CURRENT_TIMESTAMP NULL,
    del_no int8 NULL,
    del_dt timestamp NULL,
    CONSTRAINT organizations_pkey PRIMARY KEY (org_no),
    CONSTRAINT organizations_crt_no_fkey FOREIGN KEY (crt_no) REFERENCES public.users (user_no),
    CONSTRAINT organizations_del_no_fkey FOREIGN KEY (del_no) REFERENCES public.users (user_no),
    CONSTRAINT organizations_prj_no_fkey FOREIGN KEY (prj_no) REFERENCES public.projects (prj_no),
    CONSTRAINT organizations_updt_no_fkey FOREIGN KEY (updt_no) REFERENCES public.users (user_no)
);

CREATE INDEX ix_organizations_org_nm ON public.organizations USING btree (org_nm);

CREATE INDEX ix_organizations_prj_no ON public.organizations USING btree (prj_no);

-- Permissions

ALTER TABLE public.organizations OWNER TO neondb_owner;

GRANT ALL ON TABLE public.organizations TO neondb_owner;

-- public.project_abilities definition

-- Drop table

-- DROP TABLE public.project_abilities;

CREATE TABLE public.project_abilities (
    ability_no int8 GENERATED BY DEFAULT AS IDENTITY (
        INCREMENT BY 1 MINVALUE 1 MAXVALUE 9223372036854775807 START 1 CACHE 1 NO CYCLE
    ) NOT NULL,
    crt_dt timestamp(6) NULL,
    crt_no int8 NULL,
    del_dt timestamp(6) NULL,
    del_no int8 NULL,
    del_yn varchar(1) DEFAULT 'N'::character varying NULL,
    shrn_yn varchar(1) DEFAULT 'N'::character varying NULL,
    updt_dt timestamp(6) NULL,
    updt_no int8 NULL,
    use_yn varchar(1) DEFAULT 'Y'::character varying NULL,
    ability_nm text NOT NULL,
    ability_domain text NOT NULL,
    ability_source text NOT NULL,
    ability_lineage text NOT NULL,
    ability_form text NOT NULL,
    tags text NULL,
    ability_expln text NULL,
    cast_time int4 NULL,
    cool_time int4 NULL,
    dmg_type text NULL,
    stat_eff_type text NULL,
    trgt_type text NULL,
    use_cnd text NULL,
    use_cost text NULL,
    prj_no int8 NOT NULL,
    CONSTRAINT project_abilities_pkey PRIMARY KEY (ability_no),
    CONSTRAINT fkt1wubm6pt5ko9mj6hg874e5pk FOREIGN KEY (prj_no) REFERENCES public.projects (prj_no)
);

CREATE INDEX idx_project_abilities_ability_nm ON public.project_abilities USING btree (ability_nm);

CREATE INDEX idx_project_abilities_prj_no ON public.project_abilities USING btree (prj_no);

-- Permissions

ALTER TABLE public.project_abilities OWNER TO neondb_owner;

GRANT ALL ON TABLE public.project_abilities TO neondb_owner;

-- public.setting_protections definition (설정 보호. FK는 설정 쪽 미사용, 논리 참조만)
-- DROP TABLE public.setting_protections;
CREATE TABLE public.setting_protections (
    protection_no serial4 NOT NULL,
    prj_no int4 NOT NULL,
    setting_category text NOT NULL,
    setting_no int8 NOT NULL,
    crt_dt timestamp NULL,
    crt_no int8 NULL,
    CONSTRAINT setting_protections_pkey PRIMARY KEY (protection_no),
    CONSTRAINT setting_protections_prj_category_no_unique UNIQUE (prj_no, setting_category, setting_no),
    CONSTRAINT setting_protections_prj_no_fkey FOREIGN KEY (prj_no) REFERENCES public.projects (prj_no)
);

ALTER TABLE public.setting_protections OWNER TO neondb_owner;
GRANT ALL ON TABLE public.setting_protections TO neondb_owner;

-- public.setting_favorites definition (설정 즐겨찾기. FK는 설정 쪽 미사용, 논리 참조만)
-- DROP TABLE public.setting_favorites;
CREATE TABLE public.setting_favorites (
    favorite_no serial4 NOT NULL,
    prj_no int4 NOT NULL,
    setting_category text NOT NULL,
    setting_no int8 NOT NULL,
    crt_dt timestamp NULL,
    crt_no int8 NULL,
    CONSTRAINT setting_favorites_pkey PRIMARY KEY (favorite_no),
    CONSTRAINT setting_favorites_prj_category_no_unique UNIQUE (prj_no, setting_category, setting_no),
    CONSTRAINT setting_favorites_prj_no_fkey FOREIGN KEY (prj_no) REFERENCES public.projects (prj_no)
);

ALTER TABLE public.setting_favorites OWNER TO neondb_owner;
GRANT ALL ON TABLE public.setting_favorites TO neondb_owner;

-- public.project_skills definition

-- Drop table

-- DROP TABLE public.project_skills;

CREATE TABLE public.project_skills (
    skill_no serial4 NOT NULL,
    prj_no int4 NOT NULL,
    skill_nm varchar NOT NULL,
    skill_type varchar NOT NULL,
    skill_lcls varchar NOT NULL,
    skill_expln text NULL,
    trgt_type varchar NULL,
    dmg_type varchar NULL,
    stat_eff_type varchar NULL,
    use_cost varchar NULL,
    cool_time varchar NULL,
    cast_time varchar NULL,
    use_cnd text NULL,
    use_yn varchar DEFAULT 'Y'::character varying NULL,
    shrn_yn varchar DEFAULT 'Y'::character varying NULL,
    del_yn varchar DEFAULT 'N'::character varying NULL,
    crt_no int8 NULL,
    crt_dt timestamp DEFAULT CURRENT_TIMESTAMP NULL,
    updt_no int8 NULL,
    updt_dt timestamp DEFAULT CURRENT_TIMESTAMP NULL,
    del_no int8 NULL,
    del_dt timestamp NULL,
    CONSTRAINT project_skills_pkey PRIMARY KEY (skill_no),
    CONSTRAINT project_skills_crt_no_fkey FOREIGN KEY (crt_no) REFERENCES public.users (user_no),
    CONSTRAINT project_skills_del_no_fkey FOREIGN KEY (del_no) REFERENCES public.users (user_no),
    CONSTRAINT project_skills_prj_no_fkey FOREIGN KEY (prj_no) REFERENCES public.projects (prj_no),
    CONSTRAINT project_skills_updt_no_fkey FOREIGN KEY (updt_no) REFERENCES public.users (user_no)
);

CREATE INDEX ix_project_skills_prj_no ON public.project_skills USING btree (prj_no);

CREATE INDEX ix_project_skills_skill_nm ON public.project_skills USING btree (skill_nm);

-- Permissions

ALTER TABLE public.project_skills OWNER TO neondb_owner;

GRANT ALL ON TABLE public.project_skills TO neondb_owner;

-- public.project_traits definition

-- Drop table

-- DROP TABLE public.project_traits;

CREATE TABLE public.project_traits (
    trait_no bigserial NOT NULL,
    prj_no int8 NOT NULL,
    trait_nm varchar(255) NOT NULL,
    trait_expln text NULL,
    trait_lcls varchar(255) NOT NULL,
    trait_mcls varchar(255) NOT NULL,
    aply_trgt varchar(255) NULL,
    cnfl_trait_no int8 NULL,
    cnfl_trait_type varchar(255) NULL,
    use_yn varchar(1) DEFAULT 'Y'::character varying NULL,
    shrn_yn varchar(1) DEFAULT 'Y'::character varying NULL,
    del_yn varchar(1) DEFAULT 'N'::character varying NULL,
    crt_no int8 NULL,
    crt_dt timestamp DEFAULT CURRENT_TIMESTAMP NULL,
    updt_no int8 NULL,
    updt_dt timestamp DEFAULT CURRENT_TIMESTAMP NULL,
    del_no int8 NULL,
    del_dt timestamp NULL,
    CONSTRAINT project_traits_pkey PRIMARY KEY (trait_no),
    CONSTRAINT project_traits_crt_no_fkey FOREIGN KEY (crt_no) REFERENCES public.users (user_no),
    CONSTRAINT project_traits_del_no_fkey FOREIGN KEY (del_no) REFERENCES public.users (user_no),
    CONSTRAINT project_traits_prj_no_fkey FOREIGN KEY (prj_no) REFERENCES public.projects (prj_no),
    CONSTRAINT project_traits_updt_no_fkey FOREIGN KEY (updt_no) REFERENCES public.users (user_no)
);

CREATE INDEX idx_project_traits_cnfl_trait_no ON public.project_traits USING btree (cnfl_trait_no);

CREATE INDEX idx_project_traits_prj_no ON public.project_traits USING btree (prj_no);

CREATE INDEX idx_project_traits_trait_nm ON public.project_traits USING btree (trait_nm);

CREATE INDEX ix_project_traits_cnfl_trait_no ON public.project_traits USING btree (cnfl_trait_no);

CREATE INDEX ix_project_traits_prj_no ON public.project_traits USING btree (prj_no);

CREATE INDEX ix_project_traits_trait_nm ON public.project_traits USING btree (trait_nm);

-- Permissions

ALTER TABLE public.project_traits OWNER TO neondb_owner;

GRANT ALL ON TABLE public.project_traits TO neondb_owner;

-- public.regions definition

-- Drop table

-- DROP TABLE public.regions;

CREATE TABLE public.regions (
    region_no serial4 NOT NULL,
    prj_no int4 NOT NULL,
    up_region_no int4 NULL,
    region_nm varchar NOT NULL,
    region_type varchar NULL,
    explor_stat varchar NULL,
    region_expln text NULL,
    loc_desc text NULL,
    climate_env varchar NULL,
    terrain_feat text NULL,
    env_spec text NULL,
    func_feat text NULL,
    danger_lvl varchar NULL,
    danger_fctr text NULL,
    inhabit_info text NULL,
    unknown_entity text NULL,
    main_fclty text NULL,
    rsrc_list text NULL,
    ntn_no int4 NULL,
    use_yn varchar DEFAULT 'Y'::character varying NULL,
    shrn_yn varchar DEFAULT 'Y'::character varying NULL,
    del_yn varchar DEFAULT 'N'::character varying NULL,
    crt_no int8 NULL,
    crt_dt timestamp DEFAULT CURRENT_TIMESTAMP NULL,
    updt_no int8 NULL,
    updt_dt timestamp DEFAULT CURRENT_TIMESTAMP NULL,
    del_no int8 NULL,
    del_dt timestamp NULL,
    CONSTRAINT regions_pkey PRIMARY KEY (region_no),
    CONSTRAINT regions_crt_no_fkey FOREIGN KEY (crt_no) REFERENCES public.users (user_no),
    CONSTRAINT regions_del_no_fkey FOREIGN KEY (del_no) REFERENCES public.users (user_no),
    CONSTRAINT regions_ntn_no_fkey FOREIGN KEY (ntn_no) REFERENCES public.nations (ntn_no),
    CONSTRAINT regions_prj_no_fkey FOREIGN KEY (prj_no) REFERENCES public.projects (prj_no),
    CONSTRAINT regions_up_region_no_fkey FOREIGN KEY (up_region_no) REFERENCES public.regions (region_no),
    CONSTRAINT regions_updt_no_fkey FOREIGN KEY (updt_no) REFERENCES public.users (user_no)
);

CREATE INDEX ix_regions_ntn_no ON public.regions USING btree (ntn_no);

CREATE INDEX ix_regions_prj_no ON public.regions USING btree (prj_no);

CREATE INDEX ix_regions_region_nm ON public.regions USING btree (region_nm);

CREATE INDEX ix_regions_up_region_no ON public.regions USING btree (up_region_no);

-- Permissions

ALTER TABLE public.regions OWNER TO neondb_owner;

GRANT ALL ON TABLE public.regions TO neondb_owner;

-- public."characters" definition

-- Drop table

-- DROP TABLE public."characters";

CREATE TABLE public."characters" (
    char_no serial4 NOT NULL,
    prj_no int4 NOT NULL,
    char_nm varchar NOT NULL,
    alias_nm varchar NULL,
    role_type varchar NOT NULL,
    logline text NULL,
    narr_func varchar NULL,
    race_no int4 NULL,
    ntn_no int4 NULL,
    org_no int4 NULL,
    org_rank varchar NULL,
    origin_desc text NULL,
    join_rsn text NULL,
    org_rel_stat varchar NULL,
    real_age varchar NULL,
    app_age varchar NULL,
    gender varchar NULL,
    sex_orient varchar NULL,
    sex_pref text NULL,
    height_val varchar NULL,
    weight_val varchar NULL,
    body_desc text NULL,
    health_stat text NULL,
    dsbl_desc text NULL,
    visual_pnt text NULL,
    fst_impr text NULL,
    mslw_lv1_phys text NULL,
    mslw_lv2_safe text NULL,
    mslw_lv3_soc text NULL,
    mslw_lv4_estm text NULL,
    mslw_lv5_self text NULL,
    like_list text NULL,
    hate_list text NULL,
    align_ord varchar NULL,
    align_moral varchar NULL,
    core_val varchar NULL,
    val_cnfl text NULL,
    world_view text NULL,
    pers_pos text NULL,
    pers_neg text NULL,
    main_emot varchar NULL,
    tone_type varchar NULL,
    soc_mthd text NULL,
    habit_desc text NULL,
    sign_line text NULL,
    emot_expr_json text NULL,
    core_desire text NULL,
    core_dfcn text NULL,
    core_taboo text NULL,
    goal_short text NULL,
    obstacle text NULL,
    exp_cost text NULL,
    rule_abandon text NULL,
    rule_keep text NULL,
    moral_accept text NULL,
    moral_reject text NULL,
    cnfl_trgr text NULL,
    emot_accum text NULL,
    expl_type varchar NULL,
    self_perc text NULL,
    ext_perc text NULL,
    secret_json text NULL,
    trma_core varchar NULL,
    trma_evnt text NULL,
    false_blf text NULL,
    main_fear text NULL,
    trma_trgr text NULL,
    cmbt_styl text NULL,
    cmbt_str text NULL,
    cmbt_weak text NULL,
    abil_cost text NULL,
    arc_start text NULL,
    arc_end text NULL,
    rmk text NULL,
    use_yn varchar DEFAULT 'Y'::character varying NULL,
    shrn_yn varchar DEFAULT 'Y'::character varying NULL,
    del_yn varchar DEFAULT 'N'::character varying NULL,
    crt_no int8 NULL,
    crt_dt timestamp DEFAULT CURRENT_TIMESTAMP NULL,
    updt_no int8 NULL,
    updt_dt timestamp DEFAULT CURRENT_TIMESTAMP NULL,
    del_no int8 NULL,
    del_dt timestamp NULL,
    CONSTRAINT characters_pkey PRIMARY KEY (char_no),
    CONSTRAINT characters_crt_no_fkey FOREIGN KEY (crt_no) REFERENCES public.users (user_no),
    CONSTRAINT characters_del_no_fkey FOREIGN KEY (del_no) REFERENCES public.users (user_no),
    CONSTRAINT characters_ntn_no_fkey FOREIGN KEY (ntn_no) REFERENCES public.nations (ntn_no),
    CONSTRAINT characters_org_no_fkey FOREIGN KEY (org_no) REFERENCES public.organizations (org_no),
    CONSTRAINT characters_prj_no_fkey FOREIGN KEY (prj_no) REFERENCES public.projects (prj_no),
    CONSTRAINT characters_race_no_fkey FOREIGN KEY (race_no) REFERENCES public.creatures (creature_no),
    CONSTRAINT characters_updt_no_fkey FOREIGN KEY (updt_no) REFERENCES public.users (user_no)
);

CREATE INDEX ix_characters_char_nm ON public.characters USING btree (char_nm);

CREATE INDEX ix_characters_ntn_no ON public.characters USING btree (ntn_no);

CREATE INDEX ix_characters_org_no ON public.characters USING btree (org_no);

CREATE INDEX ix_characters_prj_no ON public.characters USING btree (prj_no);

CREATE INDEX ix_characters_race_no ON public.characters USING btree (race_no);

-- Permissions

ALTER TABLE public."characters" OWNER TO neondb_owner;

GRANT ALL ON TABLE public."characters" TO neondb_owner;

-- public.creature_skill_maps definition

-- Drop table

-- DROP TABLE public.creature_skill_maps;

CREATE TABLE public.creature_skill_maps (
    map_no serial4 NOT NULL,
    creature_no int4 NOT NULL,
    skill_no int4 NOT NULL,
    skill_type varchar NOT NULL,
    prof_lvl varchar NULL,
    skill_rmk text NULL,
    use_yn varchar DEFAULT 'Y'::character varying NULL,
    shrn_yn varchar DEFAULT 'Y'::character varying NULL,
    del_yn varchar DEFAULT 'N'::character varying NULL,
    crt_no int8 NULL,
    crt_dt timestamp DEFAULT CURRENT_TIMESTAMP NULL,
    updt_no int8 NULL,
    updt_dt timestamp DEFAULT CURRENT_TIMESTAMP NULL,
    del_no int8 NULL,
    del_dt timestamp NULL,
    CONSTRAINT creature_skill_maps_pkey PRIMARY KEY (map_no),
    CONSTRAINT creature_skill_maps_creature_no_fkey FOREIGN KEY (creature_no) REFERENCES public.creatures (creature_no),
    CONSTRAINT creature_skill_maps_crt_no_fkey FOREIGN KEY (crt_no) REFERENCES public.users (user_no),
    CONSTRAINT creature_skill_maps_del_no_fkey FOREIGN KEY (del_no) REFERENCES public.users (user_no),
    CONSTRAINT creature_skill_maps_updt_no_fkey FOREIGN KEY (updt_no) REFERENCES public.users (user_no)
);

CREATE INDEX ix_creature_skill_maps_creature_no ON public.creature_skill_maps USING btree (creature_no);

CREATE INDEX ix_creature_skill_maps_skill_no ON public.creature_skill_maps USING btree (skill_no);

-- Permissions

ALTER TABLE public.creature_skill_maps OWNER TO neondb_owner;

GRANT ALL ON TABLE public.creature_skill_maps TO neondb_owner;

-- public.creature_trait_maps definition

-- Drop table

-- DROP TABLE public.creature_trait_maps;

CREATE TABLE public.creature_trait_maps (
    map_no serial4 NOT NULL,
    creature_no int4 NOT NULL,
    trait_no int4 NOT NULL,
    trait_type varchar NOT NULL,
    trait_rmk text NULL,
    use_yn varchar DEFAULT 'Y'::character varying NULL,
    shrn_yn varchar DEFAULT 'Y'::character varying NULL,
    del_yn varchar DEFAULT 'N'::character varying NULL,
    crt_no int8 NULL,
    crt_dt timestamp DEFAULT CURRENT_TIMESTAMP NULL,
    updt_no int8 NULL,
    updt_dt timestamp DEFAULT CURRENT_TIMESTAMP NULL,
    del_no int8 NULL,
    del_dt timestamp NULL,
    CONSTRAINT creature_trait_maps_pkey PRIMARY KEY (map_no),
    CONSTRAINT creature_trait_maps_creature_no_fkey FOREIGN KEY (creature_no) REFERENCES public.creatures (creature_no),
    CONSTRAINT creature_trait_maps_crt_no_fkey FOREIGN KEY (crt_no) REFERENCES public.users (user_no),
    CONSTRAINT creature_trait_maps_del_no_fkey FOREIGN KEY (del_no) REFERENCES public.users (user_no),
    CONSTRAINT creature_trait_maps_updt_no_fkey FOREIGN KEY (updt_no) REFERENCES public.users (user_no)
);

CREATE INDEX ix_creature_trait_maps_creature_no ON public.creature_trait_maps USING btree (creature_no);

CREATE INDEX ix_creature_trait_maps_trait_no ON public.creature_trait_maps USING btree (trait_no);

-- Permissions

ALTER TABLE public.creature_trait_maps OWNER TO neondb_owner;

GRANT ALL ON TABLE public.creature_trait_maps TO neondb_owner;

-- public.event_entries definition

-- Drop table

-- DROP TABLE public.event_entries;

CREATE TABLE public.event_entries (
    entry_no serial4 NOT NULL,
    event_no int4 NOT NULL,
    entry_type varchar NOT NULL,
    entry_trgt_no int4 NOT NULL,
    entry_side varchar NULL,
    role_desc text NULL,
    use_yn varchar DEFAULT 'Y'::character varying NULL,
    shrn_yn varchar DEFAULT 'Y'::character varying NULL,
    del_yn varchar DEFAULT 'N'::character varying NULL,
    crt_no int8 NULL,
    crt_dt timestamp DEFAULT CURRENT_TIMESTAMP NULL,
    updt_no int8 NULL,
    updt_dt timestamp DEFAULT CURRENT_TIMESTAMP NULL,
    del_no int8 NULL,
    del_dt timestamp NULL,
    CONSTRAINT event_entries_pkey PRIMARY KEY (entry_no),
    CONSTRAINT event_entries_crt_no_fkey FOREIGN KEY (crt_no) REFERENCES public.users (user_no),
    CONSTRAINT event_entries_del_no_fkey FOREIGN KEY (del_no) REFERENCES public.users (user_no),
    CONSTRAINT event_entries_event_no_fkey FOREIGN KEY (event_no) REFERENCES public.events (event_no),
    CONSTRAINT event_entries_updt_no_fkey FOREIGN KEY (updt_no) REFERENCES public.users (user_no)
);

CREATE INDEX ix_event_entries_entry_trgt_no ON public.event_entries USING btree (entry_trgt_no);

CREATE INDEX ix_event_entries_event_no ON public.event_entries USING btree (event_no);

-- Permissions

ALTER TABLE public.event_entries OWNER TO neondb_owner;

GRANT ALL ON TABLE public.event_entries TO neondb_owner;

-- public.item_skill_maps definition

-- Drop table

-- DROP TABLE public.item_skill_maps;

CREATE TABLE public.item_skill_maps (
    map_no serial4 NOT NULL,
    item_no int4 NOT NULL,
    skill_no int4 NOT NULL,
    skill_type varchar NOT NULL,
    prof_lvl varchar NULL,
    skill_rmk text NULL,
    use_yn varchar DEFAULT 'Y'::character varying NULL,
    shrn_yn varchar DEFAULT 'Y'::character varying NULL,
    del_yn varchar DEFAULT 'N'::character varying NULL,
    crt_no int8 NULL,
    crt_dt timestamp DEFAULT CURRENT_TIMESTAMP NULL,
    updt_no int8 NULL,
    updt_dt timestamp DEFAULT CURRENT_TIMESTAMP NULL,
    del_no int8 NULL,
    del_dt timestamp NULL,
    CONSTRAINT item_skill_maps_pkey PRIMARY KEY (map_no),
    CONSTRAINT item_skill_maps_crt_no_fkey FOREIGN KEY (crt_no) REFERENCES public.users (user_no),
    CONSTRAINT item_skill_maps_del_no_fkey FOREIGN KEY (del_no) REFERENCES public.users (user_no),
    CONSTRAINT item_skill_maps_item_no_fkey FOREIGN KEY (item_no) REFERENCES public.items (item_no),
    CONSTRAINT item_skill_maps_updt_no_fkey FOREIGN KEY (updt_no) REFERENCES public.users (user_no)
);

CREATE INDEX ix_item_skill_maps_item_no ON public.item_skill_maps USING btree (item_no);

CREATE INDEX ix_item_skill_maps_skill_no ON public.item_skill_maps USING btree (skill_no);

-- Permissions

ALTER TABLE public.item_skill_maps OWNER TO neondb_owner;

GRANT ALL ON TABLE public.item_skill_maps TO neondb_owner;

-- public.item_trait_maps definition

-- Drop table

-- DROP TABLE public.item_trait_maps;

CREATE TABLE public.item_trait_maps (
    map_no serial4 NOT NULL,
    item_no int4 NOT NULL,
    trait_no int4 NOT NULL,
    trait_type varchar NOT NULL,
    trait_rmk text NULL,
    use_yn varchar DEFAULT 'Y'::character varying NULL,
    shrn_yn varchar DEFAULT 'Y'::character varying NULL,
    del_yn varchar DEFAULT 'N'::character varying NULL,
    crt_no int8 NULL,
    crt_dt timestamp DEFAULT CURRENT_TIMESTAMP NULL,
    updt_no int8 NULL,
    updt_dt timestamp DEFAULT CURRENT_TIMESTAMP NULL,
    del_no int8 NULL,
    del_dt timestamp NULL,
    CONSTRAINT item_trait_maps_pkey PRIMARY KEY (map_no),
    CONSTRAINT item_trait_maps_crt_no_fkey FOREIGN KEY (crt_no) REFERENCES public.users (user_no),
    CONSTRAINT item_trait_maps_del_no_fkey FOREIGN KEY (del_no) REFERENCES public.users (user_no),
    CONSTRAINT item_trait_maps_item_no_fkey FOREIGN KEY (item_no) REFERENCES public.items (item_no),
    CONSTRAINT item_trait_maps_updt_no_fkey FOREIGN KEY (updt_no) REFERENCES public.users (user_no)
);

CREATE INDEX ix_item_trait_maps_item_no ON public.item_trait_maps USING btree (item_no);

CREATE INDEX ix_item_trait_maps_trait_no ON public.item_trait_maps USING btree (trait_no);

-- Permissions

ALTER TABLE public.item_trait_maps OWNER TO neondb_owner;

GRANT ALL ON TABLE public.item_trait_maps TO neondb_owner;

-- public.lore_char_maps definition

-- Drop table

-- DROP TABLE public.lore_char_maps;

CREATE TABLE public.lore_char_maps (
    map_no serial4 NOT NULL,
    lore_no int4 NOT NULL,
    char_no int4 NOT NULL,
    role_desc text NULL,
    use_yn varchar DEFAULT 'Y'::character varying NULL,
    shrn_yn varchar DEFAULT 'Y'::character varying NULL,
    del_yn varchar DEFAULT 'N'::character varying NULL,
    crt_no int8 NULL,
    crt_dt timestamp DEFAULT CURRENT_TIMESTAMP NULL,
    updt_no int8 NULL,
    updt_dt timestamp DEFAULT CURRENT_TIMESTAMP NULL,
    del_no int8 NULL,
    del_dt timestamp NULL,
    CONSTRAINT lore_char_maps_pkey PRIMARY KEY (map_no),
    CONSTRAINT lore_char_maps_char_no_fkey FOREIGN KEY (char_no) REFERENCES public."characters" (char_no),
    CONSTRAINT lore_char_maps_crt_no_fkey FOREIGN KEY (crt_no) REFERENCES public.users (user_no),
    CONSTRAINT lore_char_maps_del_no_fkey FOREIGN KEY (del_no) REFERENCES public.users (user_no),
    CONSTRAINT lore_char_maps_lore_no_fkey FOREIGN KEY (lore_no) REFERENCES public.lores (lore_no),
    CONSTRAINT lore_char_maps_updt_no_fkey FOREIGN KEY (updt_no) REFERENCES public.users (user_no)
);

CREATE INDEX ix_lore_char_maps_char_no ON public.lore_char_maps USING btree (char_no);

CREATE INDEX ix_lore_char_maps_lore_no ON public.lore_char_maps USING btree (lore_no);

-- Permissions

ALTER TABLE public.lore_char_maps OWNER TO neondb_owner;

GRANT ALL ON TABLE public.lore_char_maps TO neondb_owner;

-- public.lore_item_maps definition

-- Drop table

-- DROP TABLE public.lore_item_maps;

CREATE TABLE public.lore_item_maps (
    map_no serial4 NOT NULL,
    lore_no int4 NOT NULL,
    item_no int4 NOT NULL,
    role_desc text NULL,
    use_yn varchar DEFAULT 'Y'::character varying NULL,
    shrn_yn varchar DEFAULT 'Y'::character varying NULL,
    del_yn varchar DEFAULT 'N'::character varying NULL,
    crt_no int8 NULL,
    crt_dt timestamp DEFAULT CURRENT_TIMESTAMP NULL,
    updt_no int8 NULL,
    updt_dt timestamp DEFAULT CURRENT_TIMESTAMP NULL,
    del_no int8 NULL,
    del_dt timestamp NULL,
    CONSTRAINT lore_item_maps_pkey PRIMARY KEY (map_no),
    CONSTRAINT lore_item_maps_crt_no_fkey FOREIGN KEY (crt_no) REFERENCES public.users (user_no),
    CONSTRAINT lore_item_maps_del_no_fkey FOREIGN KEY (del_no) REFERENCES public.users (user_no),
    CONSTRAINT lore_item_maps_item_no_fkey FOREIGN KEY (item_no) REFERENCES public.items (item_no),
    CONSTRAINT lore_item_maps_lore_no_fkey FOREIGN KEY (lore_no) REFERENCES public.lores (lore_no),
    CONSTRAINT lore_item_maps_updt_no_fkey FOREIGN KEY (updt_no) REFERENCES public.users (user_no)
);

CREATE INDEX ix_lore_item_maps_item_no ON public.lore_item_maps USING btree (item_no);

CREATE INDEX ix_lore_item_maps_lore_no ON public.lore_item_maps USING btree (lore_no);

-- Permissions

ALTER TABLE public.lore_item_maps OWNER TO neondb_owner;

GRANT ALL ON TABLE public.lore_item_maps TO neondb_owner;

-- public.org_trait_maps definition

-- Drop table

-- DROP TABLE public.org_trait_maps;

CREATE TABLE public.org_trait_maps (
    map_no serial4 NOT NULL,
    org_no int4 NOT NULL,
    trait_no int4 NOT NULL,
    trait_type varchar NOT NULL,
    trait_rmk text NULL,
    use_yn varchar DEFAULT 'Y'::character varying NULL,
    shrn_yn varchar DEFAULT 'Y'::character varying NULL,
    del_yn varchar DEFAULT 'N'::character varying NULL,
    crt_no int8 NULL,
    crt_dt timestamp DEFAULT CURRENT_TIMESTAMP NULL,
    updt_no int8 NULL,
    updt_dt timestamp DEFAULT CURRENT_TIMESTAMP NULL,
    del_no int8 NULL,
    del_dt timestamp NULL,
    CONSTRAINT org_trait_maps_pkey PRIMARY KEY (map_no),
    CONSTRAINT org_trait_maps_crt_no_fkey FOREIGN KEY (crt_no) REFERENCES public.users (user_no),
    CONSTRAINT org_trait_maps_del_no_fkey FOREIGN KEY (del_no) REFERENCES public.users (user_no),
    CONSTRAINT org_trait_maps_org_no_fkey FOREIGN KEY (org_no) REFERENCES public.organizations (org_no),
    CONSTRAINT org_trait_maps_updt_no_fkey FOREIGN KEY (updt_no) REFERENCES public.users (user_no)
);

CREATE INDEX ix_org_trait_maps_org_no ON public.org_trait_maps USING btree (org_no);

CREATE INDEX ix_org_trait_maps_trait_no ON public.org_trait_maps USING btree (trait_no);

-- Permissions

ALTER TABLE public.org_trait_maps OWNER TO neondb_owner;

GRANT ALL ON TABLE public.org_trait_maps TO neondb_owner;

-- public.region_trait_maps definition

-- Drop table

-- DROP TABLE public.region_trait_maps;

CREATE TABLE public.region_trait_maps (
    map_no serial4 NOT NULL,
    region_no int4 NOT NULL,
    trait_no int4 NOT NULL,
    trait_type varchar NOT NULL,
    trait_rmk text NULL,
    use_yn varchar DEFAULT 'Y'::character varying NULL,
    shrn_yn varchar DEFAULT 'Y'::character varying NULL,
    del_yn varchar DEFAULT 'N'::character varying NULL,
    crt_no int8 NULL,
    crt_dt timestamp DEFAULT CURRENT_TIMESTAMP NULL,
    updt_no int8 NULL,
    updt_dt timestamp DEFAULT CURRENT_TIMESTAMP NULL,
    del_no int8 NULL,
    del_dt timestamp NULL,
    CONSTRAINT region_trait_maps_pkey PRIMARY KEY (map_no),
    CONSTRAINT region_trait_maps_crt_no_fkey FOREIGN KEY (crt_no) REFERENCES public.users (user_no),
    CONSTRAINT region_trait_maps_del_no_fkey FOREIGN KEY (del_no) REFERENCES public.users (user_no),
    CONSTRAINT region_trait_maps_region_no_fkey FOREIGN KEY (region_no) REFERENCES public.regions (region_no),
    CONSTRAINT region_trait_maps_updt_no_fkey FOREIGN KEY (updt_no) REFERENCES public.users (user_no)
);

CREATE INDEX ix_region_trait_maps_region_no ON public.region_trait_maps USING btree (region_no);

CREATE INDEX ix_region_trait_maps_trait_no ON public.region_trait_maps USING btree (trait_no);

-- Permissions

ALTER TABLE public.region_trait_maps OWNER TO neondb_owner;

GRANT ALL ON TABLE public.region_trait_maps TO neondb_owner;

-- public.char_group_relations definition

-- Drop table

-- DROP TABLE public.char_group_relations;

CREATE TABLE public.char_group_relations (
    rel_no serial4 NOT NULL,
    char_no int4 NOT NULL,
    trgt_ref_type varchar NOT NULL,
    trgt_ref_no int4 NOT NULL,
    rel_type varchar NOT NULL,
    rel_desc text NULL,
    use_yn varchar DEFAULT 'Y'::character varying NULL,
    shrn_yn varchar DEFAULT 'Y'::character varying NULL,
    del_yn varchar DEFAULT 'N'::character varying NULL,
    crt_no int8 NULL,
    crt_dt timestamp DEFAULT CURRENT_TIMESTAMP NULL,
    updt_no int8 NULL,
    updt_dt timestamp DEFAULT CURRENT_TIMESTAMP NULL,
    del_no int8 NULL,
    del_dt timestamp NULL,
    CONSTRAINT char_group_relations_pkey PRIMARY KEY (rel_no),
    CONSTRAINT char_group_relations_char_no_fkey FOREIGN KEY (char_no) REFERENCES public."characters" (char_no),
    CONSTRAINT char_group_relations_crt_no_fkey FOREIGN KEY (crt_no) REFERENCES public.users (user_no),
    CONSTRAINT char_group_relations_del_no_fkey FOREIGN KEY (del_no) REFERENCES public.users (user_no),
    CONSTRAINT char_group_relations_updt_no_fkey FOREIGN KEY (updt_no) REFERENCES public.users (user_no)
);

CREATE INDEX ix_char_group_relations_char_no ON public.char_group_relations USING btree (char_no);

CREATE INDEX ix_char_group_relations_trgt_ref_no ON public.char_group_relations USING btree (trgt_ref_no);

-- Permissions

ALTER TABLE public.char_group_relations OWNER TO neondb_owner;

GRANT ALL ON TABLE public.char_group_relations TO neondb_owner;

-- public.char_item_maps definition

-- Drop table

-- DROP TABLE public.char_item_maps;

CREATE TABLE public.char_item_maps (
    own_no serial4 NOT NULL,
    char_no int4 NOT NULL,
    item_no int4 NOT NULL,
    item_cnt int4 NOT NULL,
    equip_yn varchar NULL,
    rmk varchar NULL,
    use_yn varchar DEFAULT 'Y'::character varying NULL,
    shrn_yn varchar DEFAULT 'Y'::character varying NULL,
    del_yn varchar DEFAULT 'N'::character varying NULL,
    crt_no int8 NULL,
    crt_dt timestamp DEFAULT CURRENT_TIMESTAMP NULL,
    updt_no int8 NULL,
    updt_dt timestamp DEFAULT CURRENT_TIMESTAMP NULL,
    del_no int8 NULL,
    del_dt timestamp NULL,
    CONSTRAINT char_item_maps_pkey PRIMARY KEY (own_no),
    CONSTRAINT char_item_maps_char_no_fkey FOREIGN KEY (char_no) REFERENCES public."characters" (char_no),
    CONSTRAINT char_item_maps_crt_no_fkey FOREIGN KEY (crt_no) REFERENCES public.users (user_no),
    CONSTRAINT char_item_maps_del_no_fkey FOREIGN KEY (del_no) REFERENCES public.users (user_no),
    CONSTRAINT char_item_maps_item_no_fkey FOREIGN KEY (item_no) REFERENCES public.items (item_no),
    CONSTRAINT char_item_maps_updt_no_fkey FOREIGN KEY (updt_no) REFERENCES public.users (user_no)
);

CREATE INDEX ix_char_item_maps_char_no ON public.char_item_maps USING btree (char_no);

CREATE INDEX ix_char_item_maps_item_no ON public.char_item_maps USING btree (item_no);

-- Permissions

ALTER TABLE public.char_item_maps OWNER TO neondb_owner;

GRANT ALL ON TABLE public.char_item_maps TO neondb_owner;

-- public.char_relations definition

-- Drop table

-- DROP TABLE public.char_relations;

CREATE TABLE public.char_relations (
    rel_no serial4 NOT NULL,
    src_char_no int4 NOT NULL,
    trgt_char_no int4 NOT NULL,
    rel_type varchar NOT NULL,
    rel_desc text NULL,
    intimacy_lvl int4 NULL,
    use_yn varchar DEFAULT 'Y'::character varying NULL,
    shrn_yn varchar DEFAULT 'Y'::character varying NULL,
    del_yn varchar DEFAULT 'N'::character varying NULL,
    crt_no int8 NULL,
    crt_dt timestamp DEFAULT CURRENT_TIMESTAMP NULL,
    updt_no int8 NULL,
    updt_dt timestamp DEFAULT CURRENT_TIMESTAMP NULL,
    del_no int8 NULL,
    del_dt timestamp NULL,
    CONSTRAINT char_relations_pkey PRIMARY KEY (rel_no),
    CONSTRAINT char_relations_crt_no_fkey FOREIGN KEY (crt_no) REFERENCES public.users (user_no),
    CONSTRAINT char_relations_del_no_fkey FOREIGN KEY (del_no) REFERENCES public.users (user_no),
    CONSTRAINT char_relations_src_char_no_fkey FOREIGN KEY (src_char_no) REFERENCES public."characters" (char_no),
    CONSTRAINT char_relations_trgt_char_no_fkey FOREIGN KEY (trgt_char_no) REFERENCES public."characters" (char_no),
    CONSTRAINT char_relations_updt_no_fkey FOREIGN KEY (updt_no) REFERENCES public.users (user_no)
);

CREATE INDEX ix_char_relations_src_char_no ON public.char_relations USING btree (src_char_no);

CREATE INDEX ix_char_relations_trgt_char_no ON public.char_relations USING btree (trgt_char_no);

-- Permissions

ALTER TABLE public.char_relations OWNER TO neondb_owner;

GRANT ALL ON TABLE public.char_relations TO neondb_owner;

-- public.char_skill_maps definition

-- Drop table

-- DROP TABLE public.char_skill_maps;

CREATE TABLE public.char_skill_maps (
    char_no int4 NOT NULL,
    skill_no int4 NOT NULL,
    skill_type varchar NOT NULL,
    prof_lvl varchar NULL,
    skill_rmk varchar NULL,
    use_yn varchar DEFAULT 'Y'::character varying NULL,
    shrn_yn varchar DEFAULT 'Y'::character varying NULL,
    del_yn varchar DEFAULT 'N'::character varying NULL,
    crt_no int8 NULL,
    crt_dt timestamp DEFAULT CURRENT_TIMESTAMP NULL,
    updt_no int8 NULL,
    updt_dt timestamp DEFAULT CURRENT_TIMESTAMP NULL,
    del_no int8 NULL,
    del_dt timestamp NULL,
    CONSTRAINT char_skill_maps_pkey PRIMARY KEY (char_no, skill_no),
    CONSTRAINT char_skill_maps_char_no_fkey FOREIGN KEY (char_no) REFERENCES public."characters" (char_no),
    CONSTRAINT char_skill_maps_crt_no_fkey FOREIGN KEY (crt_no) REFERENCES public.users (user_no),
    CONSTRAINT char_skill_maps_del_no_fkey FOREIGN KEY (del_no) REFERENCES public.users (user_no),
    CONSTRAINT char_skill_maps_updt_no_fkey FOREIGN KEY (updt_no) REFERENCES public.users (user_no)
);

CREATE INDEX ix_char_skill_maps_char_no ON public.char_skill_maps USING btree (char_no);

CREATE INDEX ix_char_skill_maps_skill_no ON public.char_skill_maps USING btree (skill_no);

-- Permissions

ALTER TABLE public.char_skill_maps OWNER TO neondb_owner;

GRANT ALL ON TABLE public.char_skill_maps TO neondb_owner;

-- public.char_trait_maps definition

-- Drop table

-- DROP TABLE public.char_trait_maps;

CREATE TABLE public.char_trait_maps (
    char_no int4 NOT NULL,
    trait_no int4 NOT NULL,
    trait_type varchar NOT NULL,
    trait_rmk varchar NULL,
    use_yn varchar DEFAULT 'Y'::character varying NULL,
    shrn_yn varchar DEFAULT 'Y'::character varying NULL,
    del_yn varchar DEFAULT 'N'::character varying NULL,
    crt_no int8 NULL,
    crt_dt timestamp DEFAULT CURRENT_TIMESTAMP NULL,
    updt_no int8 NULL,
    updt_dt timestamp DEFAULT CURRENT_TIMESTAMP NULL,
    del_no int8 NULL,
    del_dt timestamp NULL,
    CONSTRAINT char_trait_maps_pkey PRIMARY KEY (char_no, trait_no),
    CONSTRAINT char_trait_maps_char_no_fkey FOREIGN KEY (char_no) REFERENCES public."characters" (char_no),
    CONSTRAINT char_trait_maps_crt_no_fkey FOREIGN KEY (crt_no) REFERENCES public.users (user_no),
    CONSTRAINT char_trait_maps_del_no_fkey FOREIGN KEY (del_no) REFERENCES public.users (user_no),
    CONSTRAINT char_trait_maps_updt_no_fkey FOREIGN KEY (updt_no) REFERENCES public.users (user_no)
);

CREATE INDEX ix_char_trait_maps_char_no ON public.char_trait_maps USING btree (char_no);

CREATE INDEX ix_char_trait_maps_trait_no ON public.char_trait_maps USING btree (trait_no);

-- Permissions

ALTER TABLE public.char_trait_maps OWNER TO neondb_owner;

GRANT ALL ON TABLE public.char_trait_maps TO neondb_owner;

-- Permissions

GRANT ALL ON SCHEMA public TO pg_database_owner;

GRANT USAGE ON SCHEMA public TO public;

ALTER DEFAULT PRIVILEGES FOR ROLE cloud_admin IN SCHEMA public GRANT SELECT, REFERENCES, MAINTAIN, INSERT, DELETE, TRUNCATE, UPDATE, TRIGGER ON TABLES TO neon_superuser WITH GRANT OPTION;

ALTER DEFAULT PRIVILEGES FOR ROLE cloud_admin IN SCHEMA public
GRANT
SELECT, USAGE,
UPDATE ON SEQUENCES TO neon_superuser
WITH
GRANT OPTION;