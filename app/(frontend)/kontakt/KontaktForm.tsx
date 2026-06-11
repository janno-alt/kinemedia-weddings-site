"use client";

import { useState, useTransition } from "react";
import Link from "next/link";

type Status =
  | { kind: "idle" }
  | { kind: "submitting" }
  | { kind: "success" }
  | { kind: "error"; message: string };

const packageOptions = [
  { value: "", label: "Bitte wählen …" },
  { value: "trauung", label: "Trauung (3 Stunden)" },
  { value: "tagesfilm", label: "Tagesfilm (8 Stunden) · Bestseller" },
  { value: "fullday", label: "Full Day (12 Stunden)" },
  { value: "unsure", label: "Noch unsicher" },
];

export function KontaktForm() {
  const [names, setNames] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [weddingDate, setWeddingDate] = useState("");
  const [location, setLocation] = useState("");
  const [packageInterest, setPackageInterest] = useState("");
  const [message, setMessage] = useState("");
  const [consent, setConsent] = useState(false);
  const [status, setStatus] = useState<Status>({ kind: "idle" });
  const [isPending, startTransition] = useTransition();

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus({ kind: "submitting" });
    startTransition(async () => {
      try {
        const res = await fetch("/api/contact", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            names,
            email,
            phone,
            weddingDate,
            location,
            packageInterest,
            message,
            consent,
          }),
        });
        const data = await res.json().catch(() => ({}));
        if (!res.ok) {
          setStatus({
            kind: "error",
            message: data?.error || "Anfrage konnte nicht gesendet werden.",
          });
          return;
        }
        setStatus({ kind: "success" });
      } catch {
        setStatus({
          kind: "error",
          message: "Verbindungsfehler. Bitte später erneut versuchen.",
        });
      }
    });
  }

  if (status.kind === "success") {
    return (
      <div className="glass p-10 sm:p-14 text-center">
        <div
          className="w-14 h-14 rounded-full mx-auto mb-6 grid place-items-center text-paper text-[26px]"
          style={{ background: "var(--color-accent)" }}
        >
          ✓
        </div>
        <h2 className="font-serif font-light text-[clamp(28px,4vw,44px)] leading-tight mb-4">
          Anfrage <em className="italic-accent">angekommen.</em>
        </h2>
        <p className="text-white/75 leading-relaxed max-w-[46ch] mx-auto">
          Vielen Dank! Ich melde mich innerhalb von 48 Stunden bei euch zurück.
        </p>
        <Link href="/" className="btn btn-glass mt-8 inline-flex">
          Zurück zur Startseite
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="glass p-6 sm:p-10 grid gap-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <FormField id="names" label="Brautpaar" required>
          <input
            id="names"
            type="text"
            className="input-field"
            value={names}
            onChange={(e) => setNames(e.target.value)}
            placeholder="Anna & Tom"
            required
            disabled={isPending}
          />
        </FormField>

        <FormField id="email" label="E-Mail" required>
          <input
            id="email"
            type="email"
            className="input-field"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="anna@beispiel.de"
            required
            disabled={isPending}
          />
        </FormField>

        <FormField id="phone" label="Telefon">
          <input
            id="phone"
            type="tel"
            className="input-field"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="optional"
            disabled={isPending}
          />
        </FormField>

        <FormField id="weddingDate" label="Hochzeitsdatum">
          <input
            id="weddingDate"
            type="date"
            className="input-field"
            value={weddingDate}
            onChange={(e) => setWeddingDate(e.target.value)}
            disabled={isPending}
          />
        </FormField>

        <FormField id="location" label="Location">
          <input
            id="location"
            type="text"
            className="input-field"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="z. B. Schloss Mosigkau"
            disabled={isPending}
          />
        </FormField>

        <FormField id="packageInterest" label="Paket-Interesse">
          <select
            id="packageInterest"
            className="input-field"
            value={packageInterest}
            onChange={(e) => setPackageInterest(e.target.value)}
            disabled={isPending}
          >
            {packageOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </FormField>
      </div>

      <FormField id="message" label="Eure Nachricht">
        <textarea
          id="message"
          className="input-field min-h-[140px] resize-y"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Optional. Erzählt mir gern kurz von eurer Hochzeit: Wo, wann, wie viele Gäste, was wünscht ihr euch für euren Film?"
          disabled={isPending}
        />
      </FormField>

      <label className="flex items-start gap-3 cursor-pointer text-[13px] text-white/70 leading-relaxed">
        <input
          type="checkbox"
          checked={consent}
          onChange={(e) => setConsent(e.target.checked)}
          required
          disabled={isPending}
          className="mt-0.5 w-4 h-4 accent-[var(--color-accent)] shrink-0"
        />
        <span>
          Ich bin damit einverstanden, dass meine Angaben zur Bearbeitung meiner Anfrage
          gespeichert werden. Mehr Infos in der{" "}
          <Link href="/datenschutz" className="underline hover:text-paper">
            Datenschutzerklärung
          </Link>
          .
        </span>
      </label>

      {status.kind === "error" && (
        <div className="p-4 rounded-xl border border-[rgba(240,184,148,0.3)] bg-[rgba(240,184,148,0.08)] text-[13px] text-[#f0a394]">
          {status.message}
        </div>
      )}

      <button
        type="submit"
        disabled={isPending || !consent}
        className="btn btn-light btn-block"
      >
        {isPending ? "Wird gesendet …" : "Anfrage senden ↗"}
      </button>
    </form>
  );
}

function FormField({
  id,
  label,
  required,
  children,
}: {
  id: string;
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={id} className="input-label">
        {label}
        {required && <span className="text-[var(--color-accent-soft)] ml-1">*</span>}
      </label>
      {children}
    </div>
  );
}
