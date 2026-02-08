<script setup lang="ts">
import { cva, type VariantProps } from 'class-variance-authority';
import { DateTime } from 'luxon';

import { cn } from '~/utils/cn';

/** 설정 작성 페이지 공통 사이드바. 태그·연관 설정(슬롯) + 메타 필드(DetailField). */

/** 메타 필드 표시용. 없으면 전부 "—" */
export interface SettingSidebarMeta {
  useYn?: string | null;
  delYn?: string | null;
  shrnYn?: string | null;
  crtNo?: number | null;
  crtDt?: string | null;
  updtNo?: number | null;
  updtDt?: string | null;
  delNo?: number | null;
  delDt?: string | null;
}

interface Props extends /* @vue-ignore */ VariantProps<typeof cssVariants> {
  class?: string;
  /** 있으면 값 표시, 없으면 전부 "—" (추가 화면 등) */
  meta?: SettingSidebarMeta | null;
}

// ═══════════════════════════════════════════════════════════════
// BASE — 기본 정보 (defineProps, cva/cssVariants)
// ═══════════════════════════════════════════════════════════════

const props = defineProps<Props>();

const cssVariants = cva(
  [
    'flex h-full min-h-0 w-80 shrink-0 flex-col gap-4 overflow-y-auto border-l border-border bg-card p-4',
  ],
  {
    variants: {},
    defaultVariants: {},
    compoundVariants: [],
  }
);

// ─────────────────────────────────────────────────────────────
// STOREDATA — Pinia 스토어 사용 시
// ─────────────────────────────────────────────────────────────

// ─────────────────────────────────────────────────────────────
// STATES — ref, computed 등 반응형 변수
// ─────────────────────────────────────────────────────────────

/**
 * @description meta 객체에서 key에 해당하는 값을 문자열 또는 숫자로 반환.
 * @param key - meta 필드명
 */
function metaVal(key: keyof SettingSidebarMeta): string {
  const v = props.meta?.[key];

  if (v == null || v === '') return '—';

  return String(v);
}

/** Luxon으로 ISO 날짜/일시 포맷. 유효하지 않거나 없으면 "—" */
const META_DATETIME_FORMAT = 'yyyy-MM-dd HH:mm';

function formatMetaDate(iso: string | null | undefined): string {
  if (iso == null || String(iso).trim() === '') return '—';

  const dt = DateTime.fromISO(iso.trim());

  return dt.isValid
    ? dt.toFormat(META_DATETIME_FORMAT)
    : '—';
}

// ─────────────────────────────────────────────────────────────
// ACTIONS — 변수를 제어하는 함수들
// ─────────────────────────────────────────────────────────────

// ─────────────────────────────────────────────────────────────
// WATCH — watch() 정의 영역
// ─────────────────────────────────────────────────────────────

// ─────────────────────────────────────────────────────────────
// LIFECYCLE — onMounted, onUnmounted 등
// ─────────────────────────────────────────────────────────────

</script>

<template>
  <aside
    :class="cn(cssVariants({}), props.class)"
    aria-label="공통 컬럼"
  >
    <slot name="tags" />
    <slot name="linkDocs" />

    <!-- 메타: DetailField로 표시. 날짜는 Luxon 포맷 -->
    <div class="flex flex-col gap-4 text-sm">
      <DetailField
        label="사용여부"
        :content="metaVal('useYn')"
      />
      <DetailField
        label="삭제 여부"
        :content="metaVal('delYn')"
      />
      <DetailField
        label="공유 여부"
        :content="metaVal('shrnYn')"
      />
      <DetailField
        label="등록자"
        :content="metaVal('crtNo')"
      />
      <DetailField
        label="등록일시"
        :content="formatMetaDate(meta?.crtDt ?? null)"
      />
      <DetailField
        label="수정자"
        :content="metaVal('updtNo')"
      />
      <DetailField
        label="수정일시"
        :content="formatMetaDate(meta?.updtDt ?? null)"
      />
      <DetailField
        label="삭제자"
        :content="metaVal('delNo')"
      />
      <DetailField
        label="삭제일시"
        :content="formatMetaDate(meta?.delDt ?? null)"
      />
    </div>
  </aside>
</template>
