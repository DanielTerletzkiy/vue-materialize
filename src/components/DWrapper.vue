<template>
  <component
    :is="componentTag"
    ref="wrapper"
    :role="role"
    class="vuelize"
    :href="link"
    :disabled="disabled"
    :class="[classes, mode, globalClasses, elevationClasses, glowClasses, blurClasses]"
    :style="{height, width, ...outline}"
    @mouseenter="emit('mouseenter')"
    @mouseleave="emit('mouseleave')"
  >
    <slot />
  </component>
</template>

<script setup lang="ts">
import {useVuelizeTheme} from "../stores/ThemeStore";
import {type Component, computed, nextTick, onMounted, PropType, ref, watch} from "vue";
import defaultProps from "../props/default.props";
import {storeToRefs} from "pinia";
import {useClearColors, useColor, useSetColors} from "../composables/Color.composable";
import {BlurAmount} from "../types/Theme";

const wrapper = ref<HTMLElement | null>(null);
defineExpose({wrapper});

const emit = defineEmits(['mouseenter', 'mouseleave'])

const vuelizeTheme = useVuelizeTheme()
const {mode} = storeToRefs(vuelizeTheme)

const props = defineProps({
    classes: {type: Array},
    rootTag: {type: Object as PropType<Component|string>},
    role: {type: String},
    ...defaultProps
})

const componentTag = computed(() => {
    return props.link ? 'a' : props.rootTag ?? 'div'
})

const globalClasses = computed(() => {
    return {
        disabled: props.disabled,
        [`rounded-${props.rounded}`]: props.rounded,
        outlined: checkPropTrue(props.outlined) && (typeof props.outlined === "object" ? !props.outlined.disabled : true),
    }
})

const glowClasses = computed(() => {
    const disabled = typeof props.glow === "object" && props.glow.disabled;
    if (disabled) {
        return {}
    }
    const isObject = typeof props.glow === "object";

    const glowActive = isObject && props.glow.active;
    const glowCentral = isObject && props.glow.central;
    const glowSelectable = isObject && props.glow.selectable;
    return {
        glow: checkPropTrue(props.glow),
        glowActive,
        glowCentral,
        glowSelectable,
    }
})

const blurClasses = computed(() => {
    const active = checkPropTrue(props.blur);
    if (!active) {
        return {};
    }
    const disabled = typeof props.blur === "object" && props.blur.disabled;
    if (disabled) {
        return {}
    }
    const blurAmount = (typeof props.blur === "object" && props.blur.amount) || BlurAmount.medium;
    return {
        blur: active,
        [`blur--${blurAmount}`]: blurAmount,
    }
})

function checkPropTrue(prop: unknown): boolean {
    return prop !== undefined && prop !== false
}

const elevationClasses = computed(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let elevationObject: any = {}
    if (props.elevation === '') {
        elevationObject['elevation'] = true
    } else if (props.elevation) {
        elevationObject[`elevation-${props.elevation}`] = true
    }
    return elevationObject
})

const outline = computed(() => {
    if (typeof props.outlined !== "object" || !wrapper.value) {
        return {}
    }

    if (props.outlined.disabled) {
        return {}
    }

    return {
        outlineOffset: props.outlined.offset,
        outlineWidth: props.outlined.width,
        outlineColor: `color-mix(in srgb, ${props.outlined.color && useColor(wrapper.value, props.outlined.color)}, transparent ${props.outlined.transparency || 20}%)`
    };
})

watch(() => props.color, () => {
    if (!wrapper.value) {
        return;
    }
    if (!props.color) {
        useClearColors(wrapper.value)
        return;
    }
    nextTick(() => {
        if (wrapper.value && props.color) {
            useSetColors(wrapper.value, props.color)
        }
    })
}, {deep: true});

onMounted(() => {
    if (!wrapper.value) {
        return;
    }
    nextTick(() => {
        if (!wrapper.value) {
            return;
        }
        if (props.color) {
            useSetColors(wrapper.value, props.color)
        }
    })
})

</script>

<style scoped lang="scss">

</style>
