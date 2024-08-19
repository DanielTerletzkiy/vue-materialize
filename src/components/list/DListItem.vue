<template>
  <DWrapper
    ref="wrapper"
    v-ripple
    root-tag="li"
    :classes="['d-list__item', {filled: isFilled, selected, center}]"
    v-bind="{...$props, ...$attrs}"
    :tabindex="disabled?-1:0"
    :glow="{
      active:!filled && selected
    }"
    :color="color"
    @focusin="focus = true"
    @focusout="focus = false"
    @mouseenter="focus = true"
    @mouseleave="focus = false"
    @click="onClick"
    @keyup.enter="onClick"
  >
    <span class="d-list__item__content">
      <slot />
    </span>
  </DWrapper>
</template>

<script setup lang="ts">
import {computed, getCurrentInstance, inject, onMounted, ref} from "vue";
import defaultProps from "../../props/default.props";
import DWrapper from "../DWrapper.vue";
import {Wrapper} from "../../types/components/Wrapper";

const wrapper = ref<Wrapper>();
defineExpose({wrapper});
const updateList: any = inject('updateList');
const parentProps: any = inject('parentProps');

const emit = defineEmits(['click']);
const props = defineProps({
  center: Boolean,
  ...defaultProps
})

const focus = ref(false);

const instance: any = getCurrentInstance();

const itemColor = computed<string>(() => {
  return props.color || parentProps.color;
})

const isMultiple = computed(() => {
  return parentProps.modelValue && Array.isArray(parentProps.modelValue)
})

const selected = computed(() => {
  return isMultiple.value ?
      parentProps.modelValue.includes(instance.vnode.key)
      : parentProps.modelValue === instance.vnode.key
})

const filled = computed(() => {
  return instance.parent.parent.props.filled
})

const isFilled = computed(() => {
  return filled.value && selected.value
})

const color = computed<string>(() => {
  if (isFilled.value) {
    return itemColor.value;
  }
  return focus.value || (!filled.value && selected.value) ? itemColor.value : ''
})

function updateParent() {
  updateList(instance.vnode.key, instance.vnode.el.offsetLeft, instance.vnode.el.clientWidth, props.color)
}

function onClick(e: Event) {
  updateParent();
  emit('click', e)
}

onMounted(() => {
  if (selected.value) {
    //updateParent();
  }
})
</script>

<style scoped lang="scss">
@import "../../styles/variables";

$height: 40px;

.d-list__item {
  position: relative;

  border-radius: inherit;
  min-height: $height;
  cursor: pointer;

  list-style: none;
  margin: 0;
  width: 100%;

  transition-duration: 0.1s;

  &.center {
    flex: 1;
    text-align: center;
    justify-content: center;
  }

  &:focus-visible {
    outline: 2px solid currentColor;
    outline-offset: 2px;
  }

  &:not(.selected):hover::before {
    //color: darken($dark_card_text, 14) !important;
    opacity: 0.05 !important;
  }

  &.filled {
    .d-list__item__content {
      color: var(--text-contrast); //var(--text-card); // TODO: use color-contrast when it finally comes out!
    }

    background: currentColor;
  }

  &__content {
    width: 100%;
    min-height: $height;

    padding: 6px 12px;
    display: flex;
    align-items: center;
    white-space: nowrap;
    gap: $gap*2;
  }
}
</style>
