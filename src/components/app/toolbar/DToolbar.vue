<template>
  <DWrapper
    ref="wrapper"
    :classes="['d-toolbar']"
    :rounded="Rounded.none"
    v-bind="{...$props, ...$attrs}"
  >
    <DRow
      block
      gap
      class="px-2 d-toolbar__content"
      align="center"
    >
      <DIconButton
        v-if="showHamburger"
        style="margin-left: -8px"
        :color="ThemeColorProperty.primary"
        @click="onHamburgerClick"
      >
        <DIcon name="solar:hamburger-menu-linear" />
      </DIconButton>
      <slot />
    </DRow>
  </DWrapper>
</template>

<script setup lang="ts">
import {ref} from "vue";
import DWrapper from "../../DWrapper.vue";
import DRow from "../../flex/DRow.vue";
import DIconButton from "../../button/DIconButton.vue";
import DIcon from "../../icon/DIcon.vue";
import defaultProps from "../../../props/default.props";
import {ThemeColorProperty} from "../../../types/Theme";
import {Rounded} from "../../../types/Vuelize";

const wrapper = ref(null);
defineExpose({wrapper});

const emit = defineEmits(['hamburgerClick'])

defineProps({
  showHamburger: {type: Boolean, default: false},
  ...defaultProps
})

function onHamburgerClick(e: Event) {
  emit('hamburgerClick', e)
}
</script>

<style scoped lang="scss">
@import "../../../styles/variables";

.d-toolbar {
  position: sticky;
  top: 0;
  left: 0;

  background-color: color-mix(in srgb, var(--sheet-card), transparent 35%);
  backdrop-filter: blur(10px);

  border-bottom: $outline;

  width: 100%;
  height: $toolbarHeight;
  max-height: $toolbarHeight;
  z-index: 15;

  border-radius: 0 !important;

  &__content {
    height: $toolbarHeight;
  }

  &.dark {
    //box-shadow: 0 0 30px -20px darken($dark_background, 5);
  }

  &.light {
    box-shadow: 0 2px 30px -24px rgba(31, 33, 40, 1);
  }

  .d-card {
    min-height: inherit;
    padding: 2px;
    display: flex;
    align-items: center;
  }

  .d-divider.dark {
    color: lighten($dark_sheet, 4);
  }
}
</style>
