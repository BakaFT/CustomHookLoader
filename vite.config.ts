/** @type {import('vite').UserConfig} */

import { defineConfig } from 'vite' 

export default defineConfig({
    build:{
        outDir:".",
        emptyOutDir:false,
        lib:{
            entry:"src/main.ts",
            fileName:"index",
            formats: ['es']
        }
    }
})