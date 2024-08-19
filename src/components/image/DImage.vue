<template>
  <DWrapper
    ref="wrapper"
    :classes="['d-image']"
    :src="src"
    draggable="false"
    root-tag="img"
    v-bind="{...$props, ...$attrs}"
    @click="openDialog"
  />
  <teleport to="main">
    <d-dialog
      v-model="dialogOpen"
      class="d-image__dialog"
    >
      <d-card
        :blur="BlurAmount.strong"
        class="d-image__dialog__container"
        height="80vh"
        width="80vw"
      >
        <DWrapper
          ref="dialogImage"
          :classes="['d-image__dialog__container__image']"
          :src="src"
          download="test.png"
          draggable="false"
          height="99%"
          root-tag="img"
          width="100%"
        />
      </d-card>
      <d-row
        class="d-image__dialog__actionbar"
        gap
        justify="center"
        width="80vw"
      >
        <d-row
          :wrap="false"
          blur
          class="px-4"
          gap
          outlined
          rounded="pill"
          width="max-content"
        >
          <d-icon-button
            :download="alt || 'downloaded-file'"
            :href="src"
            name="solar:cloud-download-line-duotone"
            root-tag="a"
            target="_blank"
          />
          <d-divider
            block
            class="my-3"
            vertical
          />
          <d-icon-button
            :disabled="Math.round(zoomLevel*100)<=10"
            name="solar:magnifer-zoom-out-line-duotone"
            @click="decreaseZoom"
          />
          <d-column no-padding>
            <d-card-title
              :glow="{active: true, central: true}"
              class="font-size-medium pa-1"
              width="100px"
              @click="resetZoom"
            >
              {{ Math.round(zoomLevel * 100) }}%
            </d-card-title>
          </d-column>
          <d-icon-button
            :disabled="Math.round(zoomLevel*100)>=300"
            name="solar:minimalistic-magnifer-zoom-in-line-duotone"
            @click="increaseZoom"
          />
          <d-divider
            block
            class="my-3"
            vertical
          />
          <d-icon-button
            name="solar:close-circle-line-duotone"
            @click="closeDialog"
          />
        </d-row>
      </d-row>
    </d-dialog>
  </teleport>
</template>

<script setup lang="ts">
import {ref} from "vue";
import DWrapper from "../DWrapper.vue";
import defaultProps from "../../props/default.props";
import {BlurAmount} from "../../types";
import {DColumn, DDialog, DDivider, DIconButton, DCard, DCardTitle, DRow} from "../../ComponentImport";

const wrapper = ref(null);
const dialogImage = ref(null);
defineExpose({wrapper, dialogImage});

const props = defineProps({
    src: {type: String, required: true},
    alt: {type: String, required: true},
    fit: {type: String, required: false, default: "contain"},
    ...defaultProps
})

const dialogOpen = ref<boolean>(false);

function openDialog() {
    dialogOpen.value = true;
}

function closeDialog() {
    dialogOpen.value = false;
}

const zoomLevel = ref<number>(1);

function increaseZoom() {
    zoomLevel.value += .1;
}

function decreaseZoom() {
    zoomLevel.value -= .1;
}

function resetZoom() {
    zoomLevel.value = 1;
}
</script>

<style scoped lang="scss">
@import "../../styles/variables";

.d-image {
    overflow: hidden;

    user-select: none;
    object-fit: v-bind(fit);
    background-position: center;
    width: inherit;
    height: inherit;

    &__dialog {
        &__container {
            overflow: auto;

            &__image {
                transform-origin: top left;
                transition: transform .2s;
                transform: scale(v-bind(zoomLevel));
                background-position: top left;
                object-fit: v-bind(fit);
            }
        }

        &__actionbar {
            position: absolute;
            bottom: $gap;
            font-family: monospace;
        }
    }
}
</style>
