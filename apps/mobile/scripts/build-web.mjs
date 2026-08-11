import { spawnSync } from "node:child_process";
import { resolve } from "node:path";

const apiUrl = process.env.MOBILE_API_URL ?? process.env.NEXT_PUBLIC_API_URL;

if (!apiUrl) {
  console.error(
    "Brak MOBILE_API_URL. Przed budową aplikacji Android ustaw publiczny adres backendu, np. https://api.fluentia.pl/api/v1.",
  );
  process.exit(1);
}

let parsedApiUrl;
try {
  parsedApiUrl = new URL(apiUrl);
} catch {
  console.error("MOBILE_API_URL musi być poprawnym adresem URL.");
  process.exit(1);
}

if (parsedApiUrl.protocol !== "https:") {
  console.error("Wersja Android do Google Play wymaga adresu API rozpoczynającego się od https://.");
  process.exit(1);
}

const result = spawnSync("npm --prefix apps/web run build", [], {
  shell: true,
  cwd: resolve(import.meta.dirname, "../../.."),
  stdio: "inherit",
  env: {
    ...process.env,
    CAPACITOR_BUILD: "true",
    NEXT_PUBLIC_API_URL: parsedApiUrl.toString().replace(/\/$/, ""),
  },
});

if (result.error) console.error(result.error);
process.exit(result.status ?? 1);
