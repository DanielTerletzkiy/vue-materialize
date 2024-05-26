<script setup lang="ts">
import {Icon} from "@iconify/vue";
import {computed, PropType} from "vue";
import DWrapper from "../DWrapper.vue";
import {Color} from "../../types";

const props = defineProps({
    name: { type: String, required: true },
    size: { type: Number, default: 24 },
    strokeWidth: { type: Number, default: 1.5 },
    color: { type: String as PropType<Color | string>, default: "inherit" },
});

const strokeWidthPx = computed(() => `${props.strokeWidth}px`);
const sizePx = computed(() => `${props.size}px`);
</script>

<template>
  <DWrapper
    :classes="['iconify']"
    :color="color"
    :height="sizePx"
    :width="sizePx"
  >
    <Icon
      :icon="name"
      :height="sizePx"
      :width="sizePx"
    />
  </DWrapper>
</template>

<style scoped lang="scss">
.iconify {
    display: flex;

    :deep(g) {
        stroke-width: v-bind(strokeWidthPx) !important;
    }
}
</style>
