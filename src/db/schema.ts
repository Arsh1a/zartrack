import { InferSelectModel } from "drizzle-orm";
import {
  pgTable,
  text,
  timestamp,
  uuid,
  decimal,
  boolean,
} from "drizzle-orm/pg-core";

export const user = pgTable("user", {
  id: uuid().primaryKey().defaultRandom(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  verified: boolean("verified").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date()),
});
export type User = InferSelectModel<typeof user>;

export const otp = pgTable("otp", {
  id: uuid().primaryKey().defaultRandom(),
  expiresAt: timestamp("expires_at").notNull(),
  code: text("code").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date()),
  userId: uuid("user_id")
    .notNull()
    .references(() => user.id),
});
export type Otp = InferSelectModel<typeof otp>;

export const asset = pgTable("asset", {
  id: uuid().primaryKey().defaultRandom(),
  code: text("code").notNull(),
  buyPrice: decimal("buy_price").notNull(),
  amount: decimal("amount").notNull(),
  boughtAt: timestamp("bought_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date()),
  userId: uuid("user_id")
    .notNull()
    .references(() => user.id),
});
export type Asset = InferSelectModel<typeof asset>;
