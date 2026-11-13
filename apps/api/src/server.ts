import "dotenv/config";
import { buildApp } from "./app.js";
import { loadEnv } from "./config/env.js";

const env = loadEnv();
const app = await buildApp(env);

try {
  // 0.0.0.0 is required on Render (and in containers generally).
  await app.listen({ port: env.PORT, host: "0.0.0.0" });
  app.log.info(`OBAFEMIX API listening on :${env.PORT} — Swagger UI at /docs`);
} catch (err) {
  app.log.error(err);
  process.exit(1);
}
