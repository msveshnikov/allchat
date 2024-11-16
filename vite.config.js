import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
    assetsInclude: ["**/*.md"],
    plugins: [
        react(),
        VitePWA({
            registerType: "autoUpdate",
            manifest: {
                short_name: "AllChat",
                name: "AllChat AI Assistant",
                icons: [
                    {
                        src: "favicon.ico",
                        sizes: "64x64 32x32 24x24 16x16",
                        type: "image/x-icon",
                    },
                    {
                        src: "logo192.png",
                        type: "image/png",
                        sizes: "192x192",
                    },
                    {
                        src: "logo512.png",
                        type: "image/png",
                        sizes: "512x512",
                    },
                ],
                start_url: ".",
                display: "standalone",
                theme_color: "#000000",
                background_color: "#ffffff",
                categories: ["books", "business", "entertainment", "lifestyle", "personalization"],
                dir: "auto",
                lang: "en",
                orientation: "any",
                description: "Intelligent Conversational AI Assistant",
            },
            workbox: {
                globPatterns: ["**/*.{js,css,html,ico,png,svg}"],
                maximumFileSizeToCacheInBytes: 5 * 1024 * 1024, // 5 MB
            },
        }),
    ],
});
