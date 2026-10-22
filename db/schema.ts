import {
  integer,
  pgTable,
  varchar,
  serial,
  text,
  bigint,
  AnyPgColumn,
  boolean,
  timestamp,
  pgEnum,
  index,
  uuid,
} from "drizzle-orm/pg-core";
import { InferSelectModel, relations } from "drizzle-orm";
import { timestamps } from "./helper";

/* USERS */
export const usersTable = pgTable(
  "users",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    name: varchar("name", { length: 255 }).notNull(),
    email: varchar("email", { length: 255 }).notNull().unique(),
    password: varchar("password", { length: 255 }),
    avatarUrl: text("avatar_url"),
    emailVerified: boolean("email_verified").default(false).notNull(),
    lastLoginAt: timestamp("last_login_at"),
    lastVerificationEmailSentAt: timestamp("last_verification_email_sent_at"),
    storageUsed: bigint("storage_used", {
      mode: "number",
    })
      .default(0)
      .notNull(),

    storageLimit: bigint("storage_limit", {
      mode: "number",
    })
      .default(50 * 1024 * 1024)
      .notNull(),
    ...timestamps,
  },
  (table) => [index("users_email_idx").on(table.email)],
);

//FOLDERS
export const folders = pgTable(
  "folders",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    name: text("name").notNull(),

    parentId: uuid("parent_id").references((): AnyPgColumn => folders.id, {
      onDelete: "cascade",
    }),

    userId: uuid("user_id")
      .notNull()
      .references(() => usersTable.id, { onDelete: "cascade" }),

    color: text("color"),

    isFavorite: boolean("is_favorite").default(false).notNull(),

    deletedAt: timestamp("deleted_at"),

    ...timestamps,
  },
  (table) => [
    index("folders_user_idx").on(table.userId),
    index("folders_parent_idx").on(table.parentId),
    index("folders_deleted_idx").on(table.deletedAt),
  ],
);

// FILES
export const files = pgTable(
  "files",
  {
    id: uuid("id").defaultRandom().primaryKey(),

    name: text("name").notNull(),

    originalName: text("original_name").notNull(),

    extension: text("extension").notNull(),

    mimeType: text("mime_type").notNull(),

    size: bigint("size", { mode: "number" }).notNull(),

    url: text("url").notNull(),

    publicId: text("public_id"),

    thumbnailUrl: text("thumbnail_url"),

    folderId: uuid("folder_id").references(() => folders.id, {
      onDelete: "cascade",
    }),

    userId: uuid("user_id")
      .notNull()
      .references(() => usersTable.id, { onDelete: "cascade" }),

    isFavorite: boolean("is_favorite").default(false).notNull(),

    downloads: integer("downloads").default(0).notNull(),

    views: integer("views").default(0).notNull(),

    deletedAt: timestamp("deleted_at"),

    lastOpenedAt: timestamp("last_opened_at"),

    ...timestamps,
  },
  (table) => [
    index("files_user_idx").on(table.userId),
    index("files_folder_idx").on(table.folderId),
    index("files_deleted_idx").on(table.deletedAt),
    index("files_created_idx").on(table.createdAt),
    index("files_last_opened_idx").on(table.lastOpenedAt),
  ],
);

// ACTIVITY LOG
export const activityActionEnum = pgEnum("activity_action", [
  "UPLOAD",
  "DELETE",
  "MOVE",
  "RESTORE",
  "RENAME",
  "DOWNLOAD",
  "SHARE",
  "UNSHARE",
]);

export const activities = pgTable(
  "activities",
  {
    id: serial("id").primaryKey(),

    userId: uuid("user_id")
      .notNull()
      .references(() => usersTable.id, { onDelete: "cascade" }),

    fileId: uuid("file_id").references(() => files.id, {
      onDelete: "cascade",
    }),

    folderId: uuid("folder_id").references(() => folders.id, {
      onDelete: "cascade",
    }),

    action: activityActionEnum("action").notNull(),

    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [
    index("activities_user_idx").on(table.userId),
    index("activities_created_idx").on(table.createdAt),
  ],
);

// SHARES
export const shares = pgTable("shares", {
  id: uuid("id").defaultRandom().primaryKey(),

  fileId: uuid("file_id").references(() => files.id, {
    onDelete: "cascade",
  }),

  folderId: uuid("folder_id").references(() => folders.id, {
    onDelete: "cascade",
  }),

  shareId: text("share_id").unique().notNull(),

  passwordHash: text("password_hash"),

  expiresAt: timestamp("expires_at"),

  isActive: boolean("is_active").default(true).notNull(),

  allowDownloads: boolean("allow_downloads").default(true).notNull(),

  createdBy: uuid("created_by")
    .notNull()
    .references(() => usersTable.id, { onDelete: "cascade" }),

  createdAt: timestamp("created_at").defaultNow().notNull(),

  viewCount: integer("view_count").default(0).notNull(),

  downloadCount: integer("download_count").default(0).notNull(),
},
(table)=>[
    index("shares_file_idx").on(table.fileId),
    index("shares_folder_idx").on(table.folderId),
    index("shares_creator_idx").on(table.createdBy),
]
);

// VERIFICATION
export const verificationTokens = pgTable(
  "verification_tokens",
  {
    id: uuid("id").defaultRandom().primaryKey(),

    userId: uuid("user_id")
      .notNull()
      .references(() => usersTable.id, {
        onDelete: "cascade",
      }),

    token: text("token").notNull().unique(),

    expiresAt: timestamp("expires_at").notNull(),

    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [
    index("verification_tokens_user_idx").on(table.userId),
    index("verification_tokens_token_idx").on(table.token),
    index("verification_tokens_expires_idx").on(table.expiresAt),
  ]
);

// RELATIONS

export const usersRelations = relations(usersTable, ({ many }) => ({
  files: many(files),

  folders: many(folders),

  activities: many(activities),

  shares: many(shares),

  verificationTokens: many(verificationTokens),
}));

export const foldersRelations = relations(folders, ({ one, many }) => ({
  owner: one(usersTable, {
    fields: [folders.userId],
    references: [usersTable.id],
  }),

  parent: one(folders, {
    fields: [folders.parentId],
    references: [folders.id],
  }),

  children: many(folders),

  files: many(files),

  activities: many(activities),

  shares: many(shares),
}));

export const filesRelations = relations(files, ({ one, many }) => ({
  owner: one(usersTable, {
    fields: [files.userId],
    references: [usersTable.id],
  }),

  folder: one(folders, {
    fields: [files.folderId],
    references: [folders.id],
  }),

  activities: many(activities),

  shares: many(shares),
}));

export const activitiesRelations = relations(activities, ({ one }) => ({
  user: one(usersTable, {
    fields: [activities.userId],
    references: [usersTable.id],
  }),

  file: one(files, {
    fields: [activities.fileId],
    references: [files.id],
  }),

  folder: one(folders, {
    fields: [activities.folderId],
    references: [folders.id],
  }),
}));

export const sharesRelations = relations(shares, ({ one }) => ({
  creator: one(usersTable, {
    fields: [shares.createdBy],
    references: [usersTable.id],
  }),

  file: one(files, {
    fields: [shares.fileId],
    references: [files.id],
  }),

  folder: one(folders, {
    fields: [shares.folderId],
    references: [folders.id],
  }),
}));


export const verificationTokensRelations = relations(
  verificationTokens,
  ({ one }) => ({
    user: one(usersTable, {
      fields: [verificationTokens.userId],
      references: [usersTable.id],
    }),
  })
);

export type User = InferSelectModel<typeof usersTable>;