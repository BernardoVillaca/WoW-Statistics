import { sql } from "drizzle-orm";
import {
  index,
  pgTableCreator,
  serial,
  timestamp,
  varchar,
  integer
} from "drizzle-orm/pg-core";


export const createTable = pgTableCreator((name) => `wowstats_${name}`);

export const us3v3Leaderboard = createTable(
  "us_3v3_leaderboard",
  {
    id: serial("id").primaryKey(),
    character_name: varchar("character_name", { length: 256 }),
    character_id: integer("character_id"),
    character_class: varchar("character_class", { length: 256 }).default(''),
    character_spec: varchar("character_spec", { length: 256 }).default(''),
    realm_id: integer("realm_id"),
    realm_slug: varchar("realm_slug", { length: 256 }),
    faction_name: varchar("faction_name", { length: 256 }),
    rank: integer("rank"),
    rating: integer("rating"),
    played: integer("played"),
    won: integer("won"),
    lost: integer("lost"),
    tier_id: integer("tier_id"),
    tier_href: varchar("tier_href", { length: 512 }),
    created_at: timestamp("created_at", { withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
    ,
    updated_at: timestamp("updated_at", { withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)

  },
  (leaderboard) => ({
    characterNameIndex: index("character_name_idx").on(leaderboard.character_name),
    characterIdIndex: index("character_id_idx").on(leaderboard.character_id),
    characterClassIndex: index("character_class_idx").on(leaderboard.character_class),
    characterSpecIndex: index("character_spec_idx").on(leaderboard.character_spec),
    factionNameIndex: index("faction_name_idx").on(leaderboard.faction_name),
    rankIndex: index("rank_idx").on(leaderboard.rank),
    ratingIndex: index("rating_idx").on(leaderboard.rating),
    playedIndex: index("played_idx").on(leaderboard.played),
  })
);

export const authToken = createTable(
  "auth_token",
  {
    id: serial("id").primaryKey(),
    access_token: varchar("access_token", { length: 255 }).unique().notNull(),
    token_type: varchar("token_type", { length: 50 }).notNull(),
    expires_in: integer("expires_in").notNull(),
    sub: varchar("sub", { length: 255 }),
    created_at: timestamp("created_at", { withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`),
    updated_at: timestamp("updated_at", { withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
  },
  (authToken) => ({
    accessTokenIndex: index("access_token_idx").on(authToken.access_token),
    subIndex: index("sub_idx").on(authToken.sub),
    expiresInIndex: index("expires_in_idx").on(authToken.expires_in)
  })
);

export const usRealms = createTable(
  "us_realms",
  {
    id: serial("id").primaryKey(),
    realm_name: varchar("realm_name", { length: 256 }),
   
  },
  (usRealms) => ({
    usRealmsIndex: index("realm_name_idx").on(usRealms.realm_name),
    
  })
);