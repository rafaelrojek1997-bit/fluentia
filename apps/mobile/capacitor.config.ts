import type { CapacitorConfig } from "@capacitor/cli";
const config: CapacitorConfig = {
  appId: "com.fluentia.englishmentor",
  appName: "Fluentia",
  webDir: "../web/out",
  bundledWebRuntime: false,
  android: { allowMixedContent: false },
  server: { androidScheme: "https" }
};
export default config;
