-- project_abilities: 권역(domain)·원천(source)·계통(lineage)·형태(form) 컬럼 추가
-- 기존 행이 있을 수 있으므로 NOT NULL에 DEFAULT '' 적용
ALTER TABLE `project_abilities` ADD COLUMN `ability_domain` text NOT NULL DEFAULT '';--> statement-breakpoint
ALTER TABLE `project_abilities` ADD COLUMN `ability_source` text NOT NULL DEFAULT '';--> statement-breakpoint
ALTER TABLE `project_abilities` ADD COLUMN `ability_lineage` text NOT NULL DEFAULT '';--> statement-breakpoint
ALTER TABLE `project_abilities` ADD COLUMN `ability_form` text NOT NULL DEFAULT '';
