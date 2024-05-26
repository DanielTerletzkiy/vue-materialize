<template>
  <DWrapper
    ref="wrapper"
    :classes="['d-accordion']"
    v-bind="{...$props, ...$attrs}"
  >
    <DCardTitle
      v-ripple
      class="d-accordion__header"
      :class="{'pa-0':removePadding}"
      :color="headerColor"
      glow
      :glowing="open"
      @click.self="onClick"
    >
      <slot name="header" />
      <DIcon
        v-if="showArrow"
        :name="angleIcon"
        class="d-accordion__header__icon"
      />
    </DCardTitle>
    <TransitionExpand :duration="60">
      <suspense>
        <DCardContent
          v-if="open"
          class="d-accordion__content"
        >
          <slot name="default" />
        </DCardContent>
      </suspense>
    </TransitionExpand>
  </DWrapper>
</template>

<script setup lang="ts">
import {Wrapper} from "../../types/components/Wrapper";
import {computed, getCurrentInstance, ref, watch} from "vue";
import DWrapper from "../DWrapper.vue";
import DCardTitle from "../card/text/DCardTitle.vue";
import DCardContent from "../card/content/DCardContent.vue";
import DIcon from "../icon/DIcon.vue";
import {TransitionExpand} from '@morev/vue-transitions';
import defaultProps from "../../props/default.props";

const wrapper = ref<Wrapper>();
defineExpose({wrapper});

const component = getCurrentInstance();

const emit = defineEmits(['update:modelValue'])
const props = defineProps({
  modelValue: {type: Boolean, required: true},
  headerColor: {type: String},
  showArrow: {type: Boolean},
  removePadding: {type: Boolean},
  ...defaultProps
})

const state = ref(props.modelValue);

watch(() => props.modelValue, () => {
  state.value = props.modelValue
})

const angleIcon = computed((): string => {
  return props.disabled ? 'solar:forbidden-circle-line-duotone' : open.value ? 'solar:alt-arrow-up-linear' : 'solar:alt-arrow-down-linear'
})

const open = computed((): boolean | number => {
  return !!state.value;
})

function onClick() {
  if (props.disabled) {
    return;
  }
  emit('update:modelValue', !state.value)
}
</script>

<style scoped lang="scss">
.d-accordion {
  position: relative;

  &__header {
    width: 100%;
    display: flex;
    align-items: center;
    font-size: 1.4rem;
    padding: 10px 12px;

    pointer-events: all;

    &__icon {
      margin-left: auto;
      align-self: center;
    }
  }

  &__content {
    padding: 8px;

  }
}
</style>
