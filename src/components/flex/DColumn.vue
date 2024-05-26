<template>
  <DWrapper
    ref="wrapper"
    :classes="['d-column', flexClasses($props), noPadding ? 'pa-0' : 'pa-1']"
    v-bind="{...$props, ...$attrs}"
  >
    <slot />
  </DWrapper>
</template>

<script setup lang="ts">
import {ref} from "vue";
import DWrapper from "../DWrapper.vue";
import defaultProps from "../../props/default.props";
import flexProps, {flexClasses} from "../../props/flex.props";

const wrapper = ref(null);
defineExpose({wrapper});

defineProps({
    align: {type: String, default: 'unset'},
    justify: {type: String, default: 'unset'},
    noPadding: {type: Boolean},
    ...flexProps,
    ...defaultProps
})
</script>

<style scoped lang="scss">
.d-column {
    align-items: v-bind(align);
    justify-content: v-bind(justify);
    display: flex;
    flex-flow: column;

    :deep(> .d-column) {
        padding: 0;
    }
}
</style>
