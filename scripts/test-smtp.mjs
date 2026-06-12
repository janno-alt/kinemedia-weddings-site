/**
 * SMTP-Diagnose-Script — prüft Verbindung, Login und Versand mit den
 * Werten aus der .env. Auf dem Server ausführen:
 *
 *   node --env-file=.env scripts/test-smtp.mjs
 */
import nodemailer from "nodemailer";

console.log("Konfiguration:", {
  host: process.env.SMTP_HOST || "(FEHLT!)",
  port: process.env.SMTP_PORT || "(fehlt, default 587)",
  user: process.env.SMTP_USER || "(FEHLT!)",
  passGesetzt: Boolean(process.env.SMTP_PASS),
  from: process.env.SMTP_FROM || "(fehlt, nutzt SMTP_USER)",
});

if (!process.env.SMTP_HOST || !process.env.SMTP_USER) {
  console.error(
    "✗ SMTP_HOST oder SMTP_USER fehlen in der .env — bitte ergänzen.",
  );
  process.exit(1);
}

const transport = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT || 587),
  secure: Number(process.env.SMTP_PORT) === 465,
  auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
  logger: true,
});

try {
  await transport.verify();
  console.log("✓ SMTP-Verbindung und Login OK");
  const info = await transport.sendMail({
    from: process.env.SMTP_FROM || process.env.SMTP_USER,
    to: process.env.CONTACT_NOTIFY_TO || "kontakt@wedding-kinemedia.de",
    subject: "SMTP-Test wedding-kinemedia.de",
    text: "Wenn diese Mail ankommt, funktioniert der Versand.",
  });
  console.log("✓ Testmail gesendet:", info.response);
} catch (e) {
  console.error("✗ FEHLER:", e.message);
  process.exit(1);
}
