import {defineConfig} from 'vite'
import vue from '@vitejs/plugin-vue'
import dts from "vite-plugin-dts"
import {dirname, relative, resolve} from 'path'
import {readFileSync, writeFileSync} from "fs";


function cssLinker() {
    return {
        name: 'lib-css',

        writeBundle(option, bundle) {
            const files = Object.keys(bundle);

            for (const component of files.filter((file) => file.endsWith(".vue.js"))) {
                const outDir = 'dist';
                const componentPath = resolve(outDir, component);
                const data = readFileSync(componentPath, {
                    encoding: 'utf8',
                });

                const componentRegex = new RegExp(/([/\\])(\w*).vue.js$/, 'g').exec(componentPath);
                if (!componentRegex || !componentRegex.length) continue;

                const componentName = componentRegex[2];

                const cssFiles = files.filter((v) => v.includes(componentName) && v.endsWith('.css'));
                if (!cssFiles) continue;

                const componentDir = dirname(componentPath);

                const cssImports: string[] = [];

                for (const cssFile of cssFiles) {
                    const cssPath = resolve(outDir, cssFile);
                    const relativeCssPath = relative(componentDir, cssPath).replace(/\\/mg, "/");

                    cssImports.push(`import '${relativeCssPath}';`)
                }

                writeFileSync(componentPath, `${cssImports.join("\n")}\n${data}`);
            }
        },
    };
}


export default defineConfig({
    resolve: {
        dedupe: ['vue'],
        alias: {
            '@': resolve(__dirname, 'src')
        }
    },
    server: {port: 6565},
    css: {
        preprocessorOptions: {
            scss: {
                additionalData: `@import "src/styles/variables.scss";`,
            }
        }
    },
    plugins: [
        vue(),
        dts({
            insertTypesEntry: true,
            rollupTypes: true,
        }),
    ],
    build: {
        cssCodeSplit: true,
        lib: {
            entry: resolve(__dirname, 'src/index.ts'),
            name: 'Vuelize',
            fileName: (format) => `vuelize.${format}.js`,
            formats: ['es']
        },
        rollupOptions: {
            external: ['vue'],
            output: {
                plugins: [cssLinker()],
                globals: {
                    vue: 'Vue'
                },
                // Create separate chunks for each component
                preserveModules: true,
                preserveModulesRoot: 'src',
                entryFileNames: '[name].vue.js',
                assetFileNames: 'assets/[name][extname]',
            }
        },
    }
})