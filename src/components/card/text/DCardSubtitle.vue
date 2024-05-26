<template>
  <DWrapper
      ref="wrapper"
      :classes="['d-card-subtitle']"
      v-bind="{...$props, ...$attrs}"
  >
      <slot/>
  </DWrapper>
</template>

<script setup lang="ts">
import {ref} from "vue";
import DWrapper from "../../DWrapper.vue";
import defaultProps from "../../../props/default.props";

const wrapper = ref(null);
defineExpose({wrapper});

defineProps({...defaultProps})
</script>

<style lang="scss">
@import "../../../styles/variables";

.d-card-subtitle {
  font-size: 0.9rem;
  padding: 8px;
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--text-card)
}

.d-card-title ~ .d-card-subtitle {
  margin-top: -16px;
  //padding-left: 10px;
}


.d-card {
  .d-card-subtitle {
    width: auto;
  }

  .d-card-title + .d-content {
    padding-top: 0;
  }
}
</style>
