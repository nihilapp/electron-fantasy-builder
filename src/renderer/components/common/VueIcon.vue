<script setup lang="ts">

import { getIconData, iconToSVG, replaceIDs, type IconifyIcon } from '@iconify/utils';
import { cva, type VariantProps } from 'class-variance-authority';
import { computed } from 'vue';

import type { IconSetName } from '@app-types/common.types';
import type { IconName } from '~/data/icon-name.generated';
import { cn } from '~/utils/cn';
import { getIcons } from '~/utils/getIcons';

interface Props extends /* @vue-ignore */ VariantProps<typeof cssVariants> {
  class?: string;
  iconName: IconName;
}

const props = defineProps<Props>();

const cssVariants = cva(
  [
    'inline-block shrink-0 select-none',
    'align-[-0.125em] leading-[1em] fill-current',
    'size-5',
  ],
  {
    variants: {},
    defaultVariants: {},
    compoundVariants: [],
  }
);

const iconInfo = computed(() => {
  const idx = props.iconName.indexOf(':');

  if (idx === -1) return { iconSet: '', iconName: props.iconName, };

  return {
    iconSet: props.iconName.slice(0, idx) as IconSetName,
    iconName: props.iconName.slice(idx + 1),
  };
});

const iconSet = computed(() => {
  const set = getIcons(iconInfo.value.iconSet);

  return set ?? null;
});

const iconData = computed(() => {
  if (!iconSet.value || !iconInfo.value.iconName) return null;

  return getIconData(iconSet.value, iconInfo.value.iconName);
});

const renderData = computed(() => {
  if (!iconData.value) return null;

  return iconToSVG(iconData.value as IconifyIcon, { height: 'auto', });
});

const svgBody = computed(() => {
  if (!renderData.value) return '';

  return replaceIDs(renderData.value.body);
});

const svgAttributes = computed(() => renderData.value?.attributes ?? { });
</script>

<template>
  <svg
    v-if="renderData"
    :class="cn(cssVariants({}), props.class)"
    v-bind="svgAttributes"
    v-html="svgBody"
    aria-hidden="true"
  />
</template>
