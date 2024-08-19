<template>
  <DWrapper
    ref="wrapper"
    :classes="['d-avatar']"
    v-bind="{...$props, ...$attrs}"
  >
    <slot>
      <DImage
        class="d-avatar__image"
        :src="src"
        :rounded="rounded"
      />
    </slot>
  </DWrapper>
</template>

<script setup lang="ts">
const wrapper = ref(null);
defineExpose({ wrapper });
import DWrapper from "../DWrapper.vue";
import DImage from "../image/DImage.vue";
import {computed, ref} from "vue";
import defaultProps from "../../props/default.props";

const props = defineProps({
  src: {type: String},
  size: {type: [String, Number], default: 40},
  ...defaultProps
})

const size = computed(() => props.size + 'px');
</script>

<style scoped lang="scss">
.d-avatar {
  height: v-bind(size);
  width: v-bind(size);

  background: currentColor;

  display: flex;
  justify-content: center;
  align-items: center;

  transition-duration: 0.2s;

  overflow: hidden;

  &__image {
    width: inherit;
    height: inherit;
    border-radius: inherit;
    object-fit: cover;
  }
}
</style>
