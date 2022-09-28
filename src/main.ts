import { createApp } from "vue";
import { createPinia } from "pinia";
import ElementPlus from "element-plus";
import piniaPluginPersistedstate from "pinia-plugin-persistedstate";
import "highlight.js/styles/monokai-sublime.css";
import * as ElementPlusIconsVue from "@element-plus/icons-vue";

import App from "./App.vue";
import router from "./router";
import "@/common/css/tailwind.css";
import "@/common/css/root.css";
import "element-plus/dist/index.css";

const app = createApp(App);
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component);
}

app.use(ElementPlus);
app.use(createPinia().use(piniaPluginPersistedstate));
app.use(router);

app.mount("#app");
