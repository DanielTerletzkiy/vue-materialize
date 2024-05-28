<template>
  <DWrapper
    ref="wrapper"
    :classes="['d-text-field', classesObject]"
    v-bind="{...$props, ...$attrs}"
    :style="textFieldStylesObject"
    @mouseenter="hover = true"
    @mouseleave="hover = false"
    @click="onClick"
  >
    <div
      v-if="!!$slots.prefix"
      class="d-text-field__prefix"
    >
      <slot name="prefix" />
    </div>
    <component
      :is="componentType"
      v-if="componentType !== 'input'"
      v-bind="{...$props, ...$attrs}"
      :id="instance && instance.uid"
      ref="input"
      class="d-text-field__input"
      :placeholder="placeholderActive ? placeholder : ' '"
      :model-value="modelValue"
      @update:model-value="onInput"
      @remove-focus="removeFocus"
      @focusin="selected = true"
      @focusout="selected = false"
    >
      <template
        #label="props"
      >
        <slot
          name="label"
          :item="props.item as A"
        />
      </template>
      <template
        #item="props"
      >
        <slot
          name="item"
          :item="props.item as A"
        />
      </template>
      <template
        #empty
      >
        <slot
          name="empty"
        />
      </template>
    </component>
    <input
      v-else
      v-bind="{...$props, ...$attrs}"
      :id="instance && instance.uid"
      ref="input"
      class="d-text-field__input"
      :placeholder="placeholderActive ? placeholder : ' '"
      :value="modelValue"
      @input="onInput"
      @keyup.enter="$emit('enter')"
      @removeFocus="removeFocus"
      @focusin="selected = true"
      @focusout="selected = false"
    >
    <label
      v-if="label && !solo"
      :for="instance && instance.uid"
      class="d-text-field__label"
      :class="labelClassesObject"
    >{{
      label
    }}</label>
    <div
      v-if="!!$slots.suffix"
      class="d-text-field__suffix"
    >
      <slot name="suffix" />
    </div>
  </DWrapper>
</template>

<script setup lang="ts" generic="T, A">
const wrapper = ref(null);
const input = ref<HTMLElement | null>(null);
defineExpose({wrapper, input});

import DSelect from "./variant/DSelect.vue";
//import DAutocomplete from "@/components/textfield/variant/Autocomplete.vue";
import {computed, getCurrentInstance, onMounted, PropType, ref} from "vue";
import defaultProps from "../../props/default.props";
import DWrapper from "../DWrapper.vue";

const instance = getCurrentInstance();

defineSlots<{
    prefix(props: object): never
    label(props: { item: A | object }): never
    item(props: { item: A | object }): never
    empty(props: object): never
    suffix(props: object): never
}>();

const emit = defineEmits(['update:modelValue', 'enter']);
const props = defineProps({
    modelValue: {type: Object as PropType<T>, required: true},
    autocomplete: {type: Boolean},
    filled: {type: Boolean},
    fullWidth: {type: Boolean},
    solo: {type: Boolean},
    label: {type: String},
    placeholder: {type: String, default: ''},
    items: {type: Array as PropType<A[]>},
    select: {type: Boolean},
    mandatory: {type: Boolean},
    search: {type: Boolean},
    searchKey: {type: String, default: 'value'},
    indexKey: {type: String},
    ...defaultProps
});

const hover = ref(false);
const selected = ref(false);

const placeholderActive = !!props.placeholder && !props.modelValue;

const classesObject = computed(() => {
    return {
        'd-text-field--active': (hover.value || selected.value),
        'd-text-field--placeholder': placeholderActive,
        'd-text-field--value': (typeof (props.modelValue as string) === 'string' && (props.modelValue as string).length > 0)
            || (typeof (props.modelValue as number) === 'number' && (props.modelValue as number) != null),
        'd-text-field--outlined outlined depressed elevation': props.outlined,
        'd-text-field--filled glow glowActive': props.filled,
        'd-text-field--solo': props.solo,
    }
});

const componentType = computed(() => {
    if (props.select) {
        return DSelect
    } else if (props.autocomplete) {
        return 'd-autocomplete'
    } else {
        return 'input'
    }
})

const labelClassesObject = computed(() => {
    return {
        'd-text-field--filled': props.filled,
    }
});

const textFieldStylesObject = computed(() => {
    return {
        width: props.width,
        'min-width': props.fullWidth ? '100%' : 'unset',
    }
});


onMounted(() => {
    hover.value = false;
    selected.value = false;

    if (!instance) {
        return;
    }
    instance.proxy.$forceUpdate();
});

function onInput(e: {
    target: HTMLInputElement
}) {
    emit('update:modelValue', typeof e === 'object' ? e.target.value : e)
}

function onClick() {
    if (input.value) {
        if (input.value?.wrapper) {
            //input.value?.wrapper.click()
            return;
        }
        input.value.focus();
    }
}

function removeFocus() {
    hover.value = false;
    selected.value = false;
    //@ts-ignore
    document.activeElement.blur();
}
</script>

<style scoped lang="scss">
@import "../../styles/variables";

.d-text-field {
    position: relative;
    width: 250px;
    height: 3rem;
    caret-color: var(--misc-current);
    display: flex;
    align-items: center;
    cursor: text;

    &:not(&--active) {
        color: unset !important;
    }

    &__input, :deep(.d-text-field__input__autocomplete), :deep(.d-text-field__input) {
        position: relative;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        border: none;
        border-radius: inherit;
        font-family: inherit;
        font-size: inherit;
        outline: none;
        margin: 0 1.25em;
        background: none;
        align-items: center;

        color: currentColor;
        caret-color: inherit;

        transition-duration: 0.2s;
        transition-timing-function: ease-in;
    }

    &__label {
        border-radius: 50px 50px 0 0;
        position: absolute;
        left: 1rem;
        top: 0.8rem;
        margin: 0 0.5rem;
        cursor: text;
        transition-duration: 0.2s;
        background: inherit;
        height: 10px;
        pointer-events: none;
    }

    &__prefix {
        position: relative;
        left: 0.7rem;
        font-size: 20px;
        transition-duration: 0.1s;

        & ~ .d-text-field__label {
            left: 40px;
        }
    }

    &__suffix {
        position: relative;
        right: 0.7rem;
        font-size: 20px;
        transition-duration: 0.1s;
    }

    &--outlined {
        background: inherit;
        box-shadow: none;

        &.d-text-field--active {
            outline: solid 1.8px currentColor !important;
            border-color: currentColor;
        }

        &:focus-within::before {
            transition-duration: 0.2s;
        }
    }

    &--filled {
        &.glow--active:not(:hover):not(.d-text-field--active)::before {
            opacity: 0.05 !important;
        }

        height: 3rem;

        .d-text-field__label {
            height: auto;
            top: 0.85rem;
            font-size: 1.2rem;
        }

        .d-text-field__input {
            height: calc(100% - 12px);
            margin-top: 12px !important;
            margin-bottom: 0 !important;
            margin-left: 1.2em;
            margin-right: 1.2em;
        }

        &:not(.d-text-field--solo) {

            .d-text-field__prefix {
                //margin-top: 12px;
            }

            .d-text-field__suffix {
                //margin-top: 12px;
            }
        }
    }

    &--solo {
        height: 2.6rem !important;

        .d-text-field__input {
            margin-top: 0 !important;
            margin-bottom: 0 !important;
        }

        .d-text-field__label {
            display: none;
        }
    }

    &:not(.d-text-field--solo) {
        height: 3.2rem !important;
    }

    &.d-text-field--filled.d-text-field--outlined label {
        background: none !important;
    }

    &::before {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        content: '';
        border-radius: inherit;
    }

    .d-text-field__input {
        color: var(--text-header);
    }

}

.d-text-field:focus,
.d-text-field--active,
.d-text-field--value,
.d-text-field--placeholder,
.d-text-field__input:not(:placeholder-shown) {
    .d-text-field__label {
        font-size: 0.9rem;
        padding: 0 0.3rem;
        top: -0.485rem;
        left: 0;

        &.d-text-field--filled {
            top: 0.2rem !important;
        }
    }

    &:not(.d-text-field--solo) {

        .d-text-field__prefix {
            margin-top: 12px !important;
        }

        .d-text-field__suffix {
            margin-top: 12px;
        }
    }
}

</style>
