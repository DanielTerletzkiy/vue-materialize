import {defineStore} from 'pinia'
import {computed, ref} from "vue";
import {Themes} from "../types";

const isServer = !(typeof window != 'undefined' && window.document);

const prefersDark = isServer || window.matchMedia("(prefers-color-scheme: dark)").matches;
export const useVuelizeTheme = defineStore('vuelizeTheme', () => {
    const themes = ref<Themes>({
        dark: {
            colors: {
                primary: '#A8B2FF',
                secondary: '#858585',
                accent: '#8080BD',
                success: '#74ec38',
                error: '#ff6b6b',
                warning: '#fca121',
                info: '#2ea2e0'
            },
            sheets: {
                background: "#080808",
                card: "#262626",
                glow: "currentColor",
            },
            text: {
                header: "#bdbdbd",
                card: "#949494",
                contrast: "currentColor"
            }
        },
        light: {
            colors: {
                primary: '#3075FF',
                secondary: '#424242',
                accent: '#B0B5B2',
                success: '#62c62f',
                error: '#ff6b6b',
                warning: '#ffa600',
                info: '#00b2ff'
            },
            sheets: {
                background: "#d2d2d2",
                card: "#fefefe",
                glow: "currentColor",
            },
            text: {
                header: "#020202",
                card: "#363636",
                contrast: "currentColor"
            }
        },
    })

    const mode = ref<keyof Themes>(prefersDark ? "dark" : "light");

    const currentTheme = computed(() => {
        return themes.value[mode.value];
    })

    return {
        themes, mode, currentTheme
    }
})
