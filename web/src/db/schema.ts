import { relations } from "drizzle-orm";
import {
  bigint,
  boolean,
  doublePrecision,
  index,
  jsonb,
  pgEnum,
  pgTable,
  real,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

export const incidentTypeEnum = pgEnum("incident_type", [
  "medical",
  "fire",
  "traffic",
  "violence",
  "other",
]);

export const incidentStatusEnum = pgEnum("incident_status", [
  "open",
  "triaged",
  "closed",
]);

export const userRoleEnum = pgEnum("user_role", ["public", "responder", "admin"]);

export const profiles = pgTable("profiles", {
  id: uuid("id").primaryKey(),
  displayName: text("display_name"),
  phone: text("phone"),
  role: userRoleEnum("role").notNull().default("public"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

/** Append-only moderation / ops trail (Phase 7). */
export const auditLog = pgTable(
  "audit_log",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    action: text("action").notNull(),
    subjectId: uuid("subject_id"),
    actorId: uuid("actor_id"),
    meta: jsonb("meta").$type<Record<string, unknown> | null>(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [index("audit_log_created_at_idx").on(table.createdAt)],
);

export const incidents = pgTable(
  "incidents",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    type: incidentTypeEnum("type").notNull(),
    description: text("description"),
    lat: doublePrecision("lat").notNull(),
    lng: doublePrecision("lng").notNull(),
    accuracyM: real("accuracy_m"),
    status: incidentStatusEnum("status").notNull().default("open"),
    isSilentSecurity: boolean("is_silent_security").notNull().default(false),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    createdBy: uuid("created_by"),
  },
  (table) => [index("incidents_created_at_idx").on(table.createdAt)],
);

export const incidentMedia = pgTable(
  "incident_media",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    incidentId: uuid("incident_id")
      .notNull()
      .references(() => incidents.id, { onDelete: "cascade" }),
    blobUrl: text("blob_url").notNull(),
    mime: text("mime").notNull(),
    sizeBytes: bigint("size_bytes", { mode: "number" }).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [index("incident_media_incident_id_idx").on(table.incidentId)],
);

export const incidentsRelations = relations(incidents, ({ many }) => ({
  media: many(incidentMedia),
}));

export const incidentMediaRelations = relations(incidentMedia, ({ one }) => ({
  incident: one(incidents, {
    fields: [incidentMedia.incidentId],
    references: [incidents.id],
  }),
}));

export const resourceKindEnum = pgEnum("resource_kind", [
  "aed",
  "hospital",
  "first_aid",
  "other",
]);

export const resources = pgTable(
  "resources",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    kind: resourceKindEnum("kind").notNull(),
    name: text("name").notNull(),
    lat: doublePrecision("lat").notNull(),
    lng: doublePrecision("lng").notNull(),
    source: text("source"),
    verifiedAt: timestamp("verified_at", { withTimezone: true }),
    photoUrl: text("photo_url"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    createdBy: uuid("created_by"),
  },
  (table) => [
    index("resources_lat_idx").on(table.lat),
    index("resources_lng_idx").on(table.lng),
  ],
);
