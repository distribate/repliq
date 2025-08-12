import { isProduction } from "@repo/lib/helpers/is-production";
import { Pool, type PoolClient, type PoolConfig } from "pg";

function getProcessId(client: PoolClient) {
  // @ts-expect-error
  return typeof client.processID === "number" ? client.processID : "unknown";
}

export class LoggingPool extends Pool {
  private _database: string;

  constructor(opts: PoolConfig) {
    super(opts);
    this._database = opts.database as string;

    this.on("connect", (client: PoolClient) => {
      if (!isProduction) console.log(`[PG Pool / DB=${this._database}] New client connected (pid=${getProcessId(client)})`);
    });

    this.on("acquire", (client: PoolClient) => {
      if (!isProduction) console.log(`[PG Pool / DB=${this._database}] Client acquired (pid=${getProcessId(client)})`);
    });

    this.on("remove", (client: PoolClient) => {
      if (!isProduction) console.log(`[PG Pool / DB=${this._database}] Client removed (pid=${getProcessId(client)})`);
    });

    this.on("error", (err: Error, client: PoolClient) => {
      console.error(`[PG Pool / DB=${this._database}] Client error (pid=${getProcessId(client)}):`, err);
    });
  }
}