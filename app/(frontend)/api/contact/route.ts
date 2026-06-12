import { NextResponse } from "next/server";
import { getPayload } from "payload";
import config from "@payload-config";
import { logToFile } from "@/lib/log";

/**
 * Public Endpoint für das Kontaktformular auf /kontakt.
 * Validiert minimal und legt einen Eintrag in der "contact-submissions"-
 * Collection an. Im Payload-Admin (/admin) tauchen neue Anfragen
 * automatisch auf.
 */
export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const data = body as Record<string, unknown>;
  const names = typeof data.names === "string" ? data.names.trim() : "";
  const email = typeof data.email === "string" ? data.email.trim() : "";
  const phone = typeof data.phone === "string" ? data.phone.trim() : "";
  const weddingDate =
    typeof data.weddingDate === "string" && data.weddingDate ? data.weddingDate : null;
  const location = typeof data.location === "string" ? data.location.trim() : "";
  const packageInterest =
    typeof data.packageInterest === "string" ? data.packageInterest : "";
  const message = typeof data.message === "string" ? data.message.trim() : "";
  const consent = Boolean(data.consent);

  // Server-side Validierung
  if (!names || names.length < 2) {
    return NextResponse.json({ error: "Bitte gib eure Namen an." }, { status: 400 });
  }
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "Bitte gib eine gültige E-Mail an." }, { status: 400 });
  }
  if (!consent) {
    return NextResponse.json(
      { error: "Bitte stimme der Datenverarbeitung zu." },
      { status: 400 },
    );
  }

  try {
    const payload = await getPayload({ config });
    await payload.create({
      collection: "contact-submissions",
      data: {
        names,
        email,
        phone: phone || undefined,
        weddingDate: weddingDate || undefined,
        location: location || undefined,
        packageInterest: (packageInterest || undefined) as
          | "trauung"
          | "tagesfilm"
          | "fullday"
          | "unsure"
          | undefined,
        message: message || "(keine Nachricht)",
        status: "new",
      },
    });

    // Benachrichtigung an den Postfach-Inhaber. Versand-Fehler dürfen die
    // Anfrage nicht scheitern lassen — sie ist bereits gespeichert und im
    // Admin unter Contact Submissions sichtbar.
    const notifyTo =
      process.env.CONTACT_NOTIFY_TO || "kontakt@wedding-kinemedia.de";
    const packageLabels: Record<string, string> = {
      trauung: "Trauung (4 Stunden)",
      tagesfilm: "Tagesfilm (8 Stunden)",
      fullday: "Full Day (12 Stunden)",
      unsure: "Noch unsicher",
    };
    const lines = [
      `Brautpaar: ${names}`,
      `E-Mail: ${email}`,
      phone ? `Telefon: ${phone}` : null,
      weddingDate ? `Hochzeitsdatum: ${weddingDate}` : null,
      location ? `Location: ${location}` : null,
      packageInterest ? `Paket-Interesse: ${packageLabels[packageInterest] ?? packageInterest}` : null,
      "",
      "Nachricht:",
      message || "(keine Nachricht)",
      "",
      "—",
      "Alle Anfragen: https://wedding-kinemedia.de/admin/collections/contact-submissions",
    ].filter((l) => l !== null);

    try {
      await logToFile(
        "contact",
        `Anfrage gespeichert: ${names}. SMTP konfiguriert: ${Boolean(process.env.SMTP_HOST && process.env.SMTP_USER)} (Host: ${process.env.SMTP_HOST || "-"}). Sende an ${notifyTo} …`,
      );
      await payload.sendEmail({
        to: notifyTo,
        replyTo: email,
        subject: `Neue Hochzeitsfilm-Anfrage: ${names}`,
        text: lines.join("\n"),
      });
      await logToFile("contact", `Benachrichtigung an ${notifyTo} gesendet.`);
    } catch (mailErr) {
      await logToFile("contact", "Mail-Versand fehlgeschlagen:", mailErr as Error);
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    await logToFile("contact", "Speichern fehlgeschlagen:", err as Error);
    return NextResponse.json(
      { error: "Anfrage konnte nicht gespeichert werden. Bitte später erneut versuchen." },
      { status: 500 },
    );
  }
}
