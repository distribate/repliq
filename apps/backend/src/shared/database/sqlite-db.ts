import { Kysely } from 'kysely';
import type { DB as sqliteDBType } from "@repo/types/db/sqlite-database-types";
import { Database } from "bun:sqlite";
import { BunSqliteDialect } from 'kysely-bun-sqlite';
import { SQLITE_PATH } from '../env';

const database = new Database(SQLITE_PATH)

database.exec("PRAGMA journal_mode = WAL;");

const dialect = new BunSqliteDialect({ database })

export const sqliteDB = new Kysely<sqliteDBType>({ dialect })