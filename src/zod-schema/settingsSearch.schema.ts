/**
 * 전체 설정 통합 검색 API용 스키마.
 * GET /settings/search?prjNo=&q=&categories=&page=&pageSize=
 */

import { z } from 'zod';

/** 통합 검색 쿼리 파라미터. */
export const settingsSearchParamsSchema = z.object({
  prjNo: z.number().int().positive(),
  /** 키워드 검색 (이름/표시명). 선택. */
  q: z.string().optional().default(''),
  /** 카테고리 필터. 쉼표 구분 (예: CORE_RULE,CREATURE). 비면 전체. */
  categories: z.string().optional().default(''),
  page: z.number().int().min(1).optional().default(1),
  pageSize: z.number().int().min(1).max(100).optional().default(20),
});

/** 통합 검색 결과 한 항목. 모든 설정 테이블 공통 형태. */
export const unifiedSettingItemSchema = z.object({
  /** 설정 카테고리 코드 (DESIGN_SettingProtectionFavoritesAndDocLinks와 동일). */
  settingCategory: z.string(),
  /** 해당 카테고리 내 설정 PK. */
  settingNo: z.number().int(),
  /** 표시용 이름 (coreNm, creatureNm, charNm 등). */
  displayName: z.string(),
  /** UI 표시용 카테고리 라벨 (한글). */
  categoryLabel: z.string(),
});

export type SettingsSearchParams = z.infer<typeof settingsSearchParamsSchema>;
export type UnifiedSettingItem = z.infer<typeof unifiedSettingItemSchema>;

/** 지원하는 설정 카테고리 코드. */
export const SETTING_CATEGORIES = [
  'CORE_RULE',
  'CREATURE',
  'CHARACTER',
  'REGION',
  'NATION',
  'ORGANIZATION',
  'ITEM',
  'EVENT',
  'LORE',
] as const;

export type SettingCategoryCode = (typeof SETTING_CATEGORIES)[number];

/** 카테고리 코드 → 한글 라벨 (프로젝트 상세 사이드바와 동일). */
export const SETTING_CATEGORY_LABELS: Record<SettingCategoryCode, string> = {
  CORE_RULE: '주요 설정',
  CREATURE: '종족/생물',
  CHARACTER: '인물',
  REGION: '지역',
  NATION: '국가',
  ORGANIZATION: '단체',
  ITEM: '도구',
  EVENT: '역사',
  LORE: '신화/전설/설화',
};
