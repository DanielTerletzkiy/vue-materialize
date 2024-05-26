<template>
  <DWrapper
      ref="wrapper"
      :classes="['d-card-title']"
      v-bind="{...$props, ...$attrs}"
  >
    <slot/>
  </DWrapper>
</template>

<script setup lang="ts">
import {ref} from "vue";
import DWrapper from "../../DWrapper.vue";
import defaultProps from "../../../props/default.props";
import typographyProps from "../../../props/typography.props";

const wrapper = ref(null);
defineExpose({wrapper});

defineProps({
  ...defaultProps,
  ...typographyProps
})
</script>

<style lang="scss">
@import "../../../styles/variables";

.d-card-title {
  font-size: 1.5rem;
  padding: 8px;
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--text-header)
}

.d-card {
  .d-card-title {
    width: auto;
  }

  .d-card-title + .d-content {
    padding-top: 0;
  }
}
</style>
