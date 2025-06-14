import { sqliteDB } from "#shared/database/sqlite-db.ts";
import { throwError } from "@repo/lib/helpers/throw-error";
import { Hono } from "hono";

const ruleTypes: Record<"chat" | "game" | "based", string> = {
  'chat': 'Правила чата',
  'game': 'Игровые правила',
  'based': 'Основные правила проекта',
}

async function getRules() {
  const [rules, terms] = await Promise.all([
    sqliteDB
      .selectFrom("rules_rule_content")
      .selectAll()
      .where("rule_list_id", "in", ["chat", "game", "based"])
      .execute(),
    sqliteDB
      .selectFrom("rules_termin_content")
      .selectAll()
      .execute()
  ])

  const termsResult = {
    categoryTitle: 'Терминология', content: terms,
  };

  const categorizedRules = ["chat", "game", "based"].reduce((acc, type) => {
    acc[type] = {
      categoryTitle: ruleTypes[type as "chat", "game", "based"],
      content: rules.filter((rule) => rule.rule_list_id === type),
    };

    return acc;
  }, {} as Record<string, { categoryTitle: string; content: any[] }>);

  return { rules: categorizedRules, terms: termsResult };
}

export const getRulesRoute = new Hono()
  .get("/get-rules", async (ctx) => {
    try {
      const data = await getRules()

      ctx.header("Cache-Control", "public, max-age=60")

      return ctx.json({ data }, 200)
    } catch (e) {
      return ctx.json({ error: throwError(e) }, 500)
    }
  })