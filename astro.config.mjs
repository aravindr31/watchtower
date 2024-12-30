// @ts-check
import { defineConfig, envField } from "astro/config";

import tailwind from "@astrojs/tailwind";

import vercel from "@astrojs/vercel/serverless";

export default defineConfig({
  site: "https://watchtower-roan.vercel.app/",
  integrations: [tailwind()],
  output: "server",
  adapter: vercel(),
  experimental: {
    serverIslands: true,
    env: {
      schema: {
        API_KEY: envField.string({
          context: "server",
          access: "secret",
        }),
        PORT: envField.number({
          context: "server",
          access: "public",
          default: 4321,
        }),
        MONGODB_URI: envField.string({ context: "server", access: "secret" }),
        ACCESS_TOKEN: envField.string({ context: "server", access: "secret" }),
        ACCOUNT_ID: envField.string({ context: "server", access: "secret" }),
        JWT_ISSUER: envField.string({ context: "server", access: "secret" }),
        JWT_AUDIENCE: envField.string({ context: "server", access: "secret" }),

        JWT_EXPIRATION_TIME: envField.string({
          context: "server",
          access: "public",
          default: "10m",
        }),
        SPOTIFY_CLIENT_ID: envField.string({
          context: "server",
          access: "secret",
        }),
        SPOTIFY_CLIENT_SECRET: envField.string({
          context: "server",
          access: "secret",
        }),
        SPOTIFY_REDIRECT_URL: envField.string({
          context: "server",
          access: "secret",
        }),
      },
    },
  },
});
