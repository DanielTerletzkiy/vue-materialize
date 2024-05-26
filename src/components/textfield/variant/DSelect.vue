<template>
  <div
    ref="wrapper"
    class="d-select"
    v-bind="{...$props, ...$attrs}"
    tabindex="0"
    @keyup.esc="dropdownOpen = false"
    @keyup.enter="dropdownOpen = true"
    @focusin="focusIn"
    @focusout="focusOut"
    @click.self="toggleDropdown"
  >
    <span
      v-if="search ? !dropdownOpen : true"
      class="d-select-label"
      @click="toggleDropdown"
    >
      <slot
        v-if="!!selectedItem"
        name="label"
        :item="selectedItem"
        :index="modelValue"
      >
        <span class="d-text-field__input__default">{{ selectedItem?.value }}</span>
      </slot>
      <slot
        v-else
        name="empty"
      >
        <span class="d-text-field__input__default">Please Select</span>
      </slot>
    </span>
    <input
      v-show="dropdownOpen && search"
      ref="searchBox"
      v-model="searchInput"
      class="d-text-field__input d-text-field__input__search"
    >
    <DIconButton
      size="24"
      :rounded="Rounded.circle"
      class="d-text-field__input__icon"
      tabindex="-1"
      type="button"
      @click="toggleDropdown"
    >
      <TransitionSlide
        :duration="100"
        group
      >
        <DIcon
          :name="angleIcon"
          color="currentColor"
        />
      </TransitionSlide>
    </DIconButton>
    <DSelectMenu
      v-model:open="dropdownOpen"
      :items="itemsCopy"
      :model-value="modelValue"
      :mandatory="mandatory"
      :multiple="false"
      :index-key="indexKey"
      :color="color"
      @update:model-value="onInput"
    >
      <template #item="props">
        <slot
          name="item"
          v-bind="props"
        >
          <span class="d-text-field__select__default">{{ modelValue }}</span>
        </slot>
      </template>
    </DSelectMenu>
  </div>
</template>

<script setup lang="ts" generic="T, A">
import {computed, nextTick, onBeforeMount, PropType, ref, watch} from "vue";
import DSelectMenu from "../../menu/DSelectMenu.vue";
import DIconButton from "../../button/DIconButton.vue";
import DIcon from "../../icon/DIcon.vue";
import {TransitionSlide} from "@morev/vue-transitions";
import defaultProps from "../../../props/default.props";
import {Rounded} from "../../../types/Vuelize";

const wrapper = ref(null);
defineExpose({wrapper});

const emit = defineEmits(['update:modelValue', 'removeFocus', 'focusout', 'focusin'])
const props = defineProps({
    modelValue: {
        type: Object as PropType<T>,
        required: true,
    },
    items: {type: Array as PropType<A[]>, required: true},
    indexKey: {type: String},
    mandatory: {type: Boolean},
    search: {type: Boolean},
    searchKey: {type: String, default: 'value'},
    ...defaultProps
})

const itemsCopy = ref<A[]>(props.items);

const searchBox = ref<HTMLElement | null>(null);
const searchInput = ref("");

watch(searchInput, mapItems)
watch(() => props.items, mapItems)

function mapItems() {
    itemsCopy.value = props.items;
    if (!itemsCopy.value || !props.items) {
        return;
    }
    itemsCopy.value = props.items.map((item: any) => {
        if (!item[props.searchKey] || !searchInput.value.toLowerCase()) {
            return {...item, _show: true};
        }
        item = {
            ...item,
            _show: item[props.searchKey].toString().toLowerCase().includes(searchInput.value.toLowerCase())
        };
        return item;
    });
}

const dropdownOpen = ref(false);

function toggleDropdown() {
    dropdownOpen.value = !dropdownOpen.value;
}

watch(dropdownOpen, (value) => {
    if (value) {
        nextTick(() => {
            if (searchBox.value) {
                searchBox.value.focus();
            }
        })
    }
})

function onInput(val: number | string) {
    emit('update:modelValue', val)
    emit('removeFocus')
}

function focusOut() {
    emit('focusout');
}

function focusIn() {
    emit('focusin');
}

const angleIcon = computed(() => {
    return dropdownOpen.value ? 'solar:close-circle-line-duotone' : 'solar:alt-arrow-down-linear'
})

const selectedItem = computed<A>(() => {
    if (props.indexKey) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        //@ts-ignore
        return itemsCopy.value.find((item) => item[props.indexKey] === props.modelValue) as A
    }
    return itemsCopy.value[props.modelValue] as A;
})

onBeforeMount(mapItems)
</script>

<style scoped lang="scss">
:deep(.d-select-menu__dropdown) {
    left: -1.2em;
    width: calc(100% + (1.2em * 2));
}

.d-select {
    height: 100% !important;

    &-label {
        width: 100%;
        display: flex;
    }
}

.d-text-field__input {
    cursor: pointer;
    user-select: none;
    position: relative;
    margin-top: 0.5em !important;
    margin-bottom: 0.5em !important;
    display: flex;

    &__search {
        margin-left: 0 !important;
        cursor: text;
    }

    &__icon {
        margin-left: auto;
        margin-right: -8px;
        align-self: center;
    }
}
</style>
