<template>
  <DWrapper
    ref="wrapper"
    root-tag="button"
    :classes="['d-button', size, {filled, block, glow, loading, progress}]"
    v-bind="{...$props, ...$attrs}"
    :elevation="typeof $props.glow === 'undefined' && !filled && !flat ? 1 : $props.elevation || 0"
    :disabled="$props.disabled || !!loading"
    @click.capture="$emit('click')"
  >
    <span
      v-ripple
      class="d-button__content"
    >
      <span
        v-if="!!$slots.prefix"
        class="prefix"
      >
        <slot name="prefix" />
      </span>
      <span class="center"><slot name="default" /></span>
      <span
        v-if="!!$slots.suffix"
        class="suffix"
      >
        <slot name="suffix" />
      </span>
    </span>
    <slot name="misc" />
  </DWrapper>
</template>

<script setup lang="ts">
import {computed, PropType, ref} from "vue";
import DWrapper from "../DWrapper.vue";
import defaultProps from "../../props/default.props";
import {Size} from "../../types";

const wrapper = ref(null);
defineExpose({wrapper});

defineEmits(['click'])

const props = defineProps({
    flat: {type: Boolean},
    filled: {type: Boolean},
    block: {type: Boolean},
    size: {type: String as PropType<Size>, default: Size.regular},
    loading: {type: [Boolean, Number], default: false},
    ...defaultProps
})

const progress = computed(() => {
    if (typeof props.loading === "number") {
        return `${props.loading}%`;
    }
    return null;
})
</script>

<style scoped lang="scss">
.d-button {
    overflow: hidden;
    user-select: none;
    position: relative;
    background: none;
    color: inherit;
    font: inherit;
    cursor: pointer;
    display: flex;

    min-height: 2.25rem;

    border-radius: inherit;

    text-transform: uppercase;
    font-weight: 600;
    font-size: .875rem;
    letter-spacing: 0.08em;

    transition-duration: 0.1s;

    &:focus-visible {
        outline: 2px solid currentColor;
        outline-offset: 2px;
    }

    &::before, &::after {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        content: '';
        border-radius: inherit;

        background: currentColor;
        opacity: 0;

        transition-duration: 0.25s;
    }

    &::after {
        content: none;
    }

    &:hover {
        &::before {
            opacity: 0.1;
            transition-duration: 0.15s;
        }
    }

    &.filled {
        .d-button__content {
            color: var(--text-contrast); //var(--text-card); // TODO: use color-contrast when it finally comes out!
        }

        &::before {
            opacity: 1;
        }

        &:hover {
            &::before {
                opacity: 0.9;
            }
        }

        &.loading {
            &::after {
                filter: brightness(0.1);
            }
        }
    }

    &.glow {
        &::before {
            opacity: 0.1;
        }

        &:hover {
            &::before {
                opacity: 0.15;
            }
        }
    }

    &.block {
        //noinspection CssInvalidPropertyValue
        width: -webkit-fill-available; //Its valid...
        //noinspection CssInvalidPropertyValue
        width: -moz-available;
    }

    &.loading {

        &.disabled {
            color: color-mix(in srgb, var(--misc-current), transparent 35%) !important;
        }

        &.progress {
            &::after {
                animation: none;
                opacity: 0.25;
                width: v-bind(progress);
                transition: width 0.2s ease-in-out;
            }
        }

        &::after {
            content: '';
            opacity: 0.14;
            animation: load 2.5s infinite ease-in-out;
            pointer-events: none;
            width: auto;
        }

        @keyframes load {
            0% {
                left: -80%;
                right: 100%;
            }

            60% {
                left: -80%;
                right: 100%;
            }
            100% {
                left: 100%;
                right: -40%;
            }
        }
    }

    .d-button__content {
        min-height: inherit;
        height: 100%;
        width: 100%;
        border-radius: inherit;
        position: relative;
        display: flex;
        align-items: center;
        gap: 0.5rem;
        padding: 0 1rem;
        //justify-content: center;

        .prefix {
            //margin-left: 8px;
        }

        .center {
            margin-left: auto;
            margin-right: auto;
        }

        .suffix {
            //margin-right: 8px;
        }
    }

    &.small {
        min-height: unset;

        .d-button__content {
            font-size: 0.65rem;
            padding: 0.4rem;
        }
    }

    &.large {
        font-size: 1.4rem;

        .d-button__content {
            padding: 0.5rem 1rem;
        }
    }
}
</style>
