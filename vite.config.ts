/** @type {import('vite').UserConfig} */

import { defineConfig } from 'vite' 

export default defineConfig({
    build:{
        outDir:".",
        // minify:false,
        emptyOutDir:false,
        lib:{
            entry:"src/main.ts",
            fileName:"index",
            formats: ['es']
        }
    }
})