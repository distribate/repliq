import { Hono } from "hono";
import type { MergeSchemaPath, MergePath, Env, Schema } from "hono/types";

export interface Module {
  path: string;
  routes: Hono;
}

export function mergeRoutes<T extends Module[], H extends Hono>(
  base: H,
  ...routes: T
) {
  for (const route of routes) {
    base.route(route.path, route.routes);
  }
  return base as unknown as H extends Hono<infer E, infer S, infer B>
    ? MergeRoutes<T, E, S, B>
    : never;
}

type MergeUnion<T> = (T extends any ? (x: T) => void : never) extends (
  x: infer R,
) => void
  ? R
  : never;

type MergeSchema<T extends any[], B extends string> = MergeUnion<
  T[number] extends infer module
    ? module extends { path: infer N; routes: infer H }
      ? H extends Hono<infer _, infer S>
        ? MergeSchemaPath<S, MergePath<B, N extends string ? N : never>>
        : never
      : never
    : never
>;

type MergeRoutes<
  T extends any[],
  E extends Env,
  S extends Schema,
  B extends string,
> = Hono<E, MergeSchema<T, B> & S, B>;
