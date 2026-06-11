import type { CollectionConfig } from "payload";

/**
 * Anfragen vom Kontaktformular der Marketing-Website.
 * Lesbar/editierbar nur im Payload-Admin (auth required).
 * Anlegen geht via POST /api/contact (öffentlich, ohne Auth).
 */
export const ContactSubmissions: CollectionConfig = {
  slug: "contact-submissions",
  access: {
    // Anlegen ist über die public REST-Route, nicht direkt
    create: () => false,
    read: ({ req }) => Boolean(req.user),
    update: ({ req }) => Boolean(req.user),
    delete: ({ req }) => Boolean(req.user),
  },
  admin: {
    useAsTitle: "names",
    defaultColumns: ["names", "email", "weddingDate", "packageInterest", "status", "createdAt"],
    description: "Anfragen vom Kontaktformular der Website.",
  },
  fields: [
    {
      name: "names",
      type: "text",
      label: "Brautpaar",
      required: true,
    },
    {
      name: "email",
      type: "email",
      label: "E-Mail",
      required: true,
    },
    {
      name: "phone",
      type: "text",
      label: "Telefon",
    },
    {
      name: "weddingDate",
      type: "date",
      label: "Hochzeitsdatum",
      admin: {
        date: { pickerAppearance: "dayOnly" },
      },
    },
    {
      name: "location",
      type: "text",
      label: "Location",
    },
    {
      name: "packageInterest",
      type: "select",
      label: "Paket-Interesse",
      options: [
        { label: "Trauung", value: "trauung" },
        { label: "Tagesfilm", value: "tagesfilm" },
        { label: "Full Day", value: "fullday" },
        { label: "Noch unsicher", value: "unsure" },
      ],
    },
    {
      name: "message",
      type: "textarea",
      label: "Nachricht",
    },
    {
      name: "status",
      type: "select",
      label: "Status",
      defaultValue: "new",
      options: [
        { label: "Neu", value: "new" },
        { label: "Kontaktiert", value: "contacted" },
        { label: "Termin vereinbart", value: "scheduled" },
        { label: "Gebucht", value: "booked" },
        { label: "Abgelehnt", value: "declined" },
      ],
      admin: { position: "sidebar" },
    },
    {
      name: "internalNotes",
      type: "textarea",
      label: "Interne Notizen",
      admin: { position: "sidebar" },
    },
  ],
  timestamps: true,
};
