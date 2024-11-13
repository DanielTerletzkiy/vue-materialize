<template>
    <div
        id="root"
        ref="wrapper"
        class="d-root"
        :class="mode"
    >
        <header
            class="header"
            :class="mode"
        >
            <slot name="toolbar"/>
        </header>
        <div
            class="content"
            :class="mode"
        >
            <aside class="navbar">
                <slot name="navbar"/>
            </aside>
            <main
                class="view"
                :class="mode"
            >
                <slot name="default"/>
            </main>
        </div>
        <footer
            class="footer"
            :class="mode"
        >
            <slot name="footer"/>
        </footer>
        <slot name="notifications"/>
    </div>
</template>

<script setup lang="ts">
import {Theme, ThemeColorProperty, ThemeSheetProperty, ThemeTextProperty} from "../../types/Theme";
import {onMounted, ref, watch} from "vue";
import {useSetColor} from "../../composables/Color.composable";
import {useVuelizeTheme} from "../../stores/ThemeStore";
import {storeToRefs} from "pinia";

const wrapper = ref<HTMLElement | null>(null);
defineExpose({wrapper});

const themeStore = useVuelizeTheme();
const {mode, themes, currentTheme} = storeToRefs(themeStore);

watch([mode, themes], () => {
    setTheme()
}, {
    deep: true
})

onMounted(() => {
    setTheme()
})

function setTheme() {
    if (!wrapper.value) {
        return;
    }

    for (const key of Object.keys(ThemeColorProperty)) {
        useSetColor(
            document.documentElement,
            currentTheme.value.colors[key as keyof Theme['colors']],
            ThemeColorProperty[key as keyof typeof ThemeColorProperty],
        )
    }

    for (const key of Object.keys(ThemeSheetProperty)) {
        useSetColor(
            document.documentElement,
            currentTheme.value.sheets[key as keyof Theme['sheets']],
            ThemeSheetProperty[key as keyof typeof ThemeSheetProperty],
        )
    }

    for (const key of Object.keys(ThemeTextProperty)) {
        useSetColor(
            document.documentElement,
            currentTheme.value.text[key as keyof Theme['text']],
            ThemeTextProperty[key as keyof typeof ThemeTextProperty],
        )
    }

    document.documentElement.style.setProperty('color-scheme', mode.value)
}

</script>

<style lang="scss">
@import "../../styles/index";
</style>

<style scoped lang="scss">

.header {
    position: sticky;
    top: 0;
    left: 0;
    width: 100%;
    max-height: $toolbarHeight;
    z-index: 10;
}

.content {
    position: relative;
    display: flex;

    .navbar {
        position: sticky;
        z-index: 9;
    }

    .view {
        flex: 1;
    }
}
</style>
