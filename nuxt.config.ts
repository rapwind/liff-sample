import { Configuration } from "@nuxt/types"

let apiUrl = "http://localhost:3001";
const isLocal = process.env.STAGE === "local";
if (process.env.STAGE) {
  require("dotenv-yaml").config({ path: `./env/${process.env.STAGE}.yml` });
  if (process.env.ApiUrl) {
    apiUrl = process.env.ApiUrl;
  }
}

const config: Configuration = {
  mode: isLocal?"universal":"spa",
  srcDir: "src/frontend/",
  css: [
    "~styles/global.css",
  ],
  buildModules: [
    "@nuxt/typescript-build",
    "@nuxtjs/vuetify"
  ],
  modules: [
    "@nuxtjs/axios",
    "@nuxtjs/proxy"
  ],
  plugins: [
    "~/plugins/axios.ts",
    { src: "~/plugins/nuxt-client-init.ts", ssr: false },
    "~/plugins/filter.ts",
    { src: "~/plugins/ga.js", ssr: false }
  ],
  build: {
    postcss: {
      plugins: {
        "postcss-import": {},
        "postcss-url": {},
        "postcss-custom-properties": {},
        "postcss-nested": {}
      },
      preset: {
        stage: 0,
        browsers: "cover 90%, last 2 major versions",
        importFrom: [
          "src/frontend/styles/global.css",
        ]
      }
    }
  },
  axios: isLocal?{}:{
    baseURL: apiUrl
  },
  proxy: isLocal?{
    "/api": apiUrl
  }:{},
  env: {
    Token: process.env.TOKEN || "",
    FrontUrl: process.env.FrontUrl,
    CognitoClientId: process.env.CognitoClientId,
    CognitoDomain: process.env.CognitoDomain,
    StripePublicKey: process.env.StripePublicKey
  },
  head: {
    meta: [
      {
        charset: "utf-8"
      },
      { name: "viewport", content: "width=device-width, initial-scale=1" }
    ],
    titleTemplate: "%s | Sample LIFF App",
    script: [
      {
        src: 'https://js.stripe.com/v3/'
      }
    ]
  }
};

export default config;
