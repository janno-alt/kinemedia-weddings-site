import { appendFile, mkdir } from "node:fs/promises";
import path from "node:path";

/**
 * Einfaches File-Logging nach data/app.log — Mittwald zeigt für
 * Node-Apps keine Prozess-Logs an, also schreiben wir selbst.
 * Lesen per SSH: tail -50 data/app.log
 */
const LOG_DIR = path.resolve(process.cwd(), "data");
const LOG_FILE = path.join(LOG_DIR, "app.log");

export async function logToFile(scope: string, ...parts: unknown[]) {
  const line = `[${new Date().toISOString()}] [${scope}] ${parts
    .map((p) =>
      p instanceof Error
        ? `${p.message}${p.stack ? `\n${p.stack}` : ""}`
        : typeof p === "object"
          ? JSON.stringify(p)
          : String(p),
    )
    .join(" ")}\n`;
  try {
    await mkdir(LOG_DIR, { recursive: true });
    await appendFile(LOG_FILE, line, "utf8");
  } catch {
    // Logging darf nie die App stören
  }
  // Zusätzlich stdout — falls doch mal Logs sichtbar sind
  console.log(line.trimEnd());
}
