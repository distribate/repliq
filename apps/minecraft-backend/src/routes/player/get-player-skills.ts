import { bisquiteDB } from "#shared/database/bisquite-db.ts";
import { throwError } from "@repo/lib/helpers/throw-error";
import { Hono } from "hono";

async function getSkills(nickname: string) {
  const query = await bisquiteDB
    .selectFrom("ADAPT_DATA")
    .innerJoin("Players", "Players.UUID", "ADAPT_DATA.UUID")
    .select([
      "ADAPT_DATA.DATA"
    ])
    .where("Players.Name", "=", nickname)
    .executeTakeFirst()

  return query ?? null;
}

type Skill = {
  line: string;
  xp: number;
  lastXP: number;
  knowledge: number;
  multiplier: number;
  freshness: number;
  rfreshness: number;
  lastLevel: number;
  last: number;
  storage: Record<string, unknown>;
  adaptations: Record<string, unknown>;
  multipliers: unknown[];
};

type SkillsData = {
  skillLines: {
    discovery: Skill,
    agility: Skill,
    rift: Skill,
    architect: Skill,
    seaborne: Skill,
    stealth: Skill,
    axes: Skill,
    herbalism: Skill,
    hunter: Skill,
    pickaxe: Skill,
    swords: Skill,
    ranged: Skill,
    tragoul: Skill,
    excavation: Skill,
    unarmed: Skill
  };
  stats: {
    move: number,
    "minutes.online": number,
    "move.sprint": number,
    "move.sneak": number,
    "blocks.placed": number,
    "blocks.placed.value": number,
    "move.swim": number,
    "move.fly": number,
    "blocks.broken": number,
    "axes.blocks.broken": number,
    "axes.blocks.value": number,
    "food.eaten": number,
    "harvest.blocks": number,
    "killed.kills": number,
    "pickaxe.blocks.broken": number,
    "pickaxe.blocks.value": number,
    "sword.hits": number,
    "sword.damage": number,
    "ranged.shotsfired": number,
    "ranged.shotsfired.arrow": number,
    "ranged.distance": number,
    "ranged.distance.arrow": number,
    "ranged.damage": number,
    "ranged.damage.arrow": number,
    "trag.hitsrecieved": number,
    "trag.damage": number,
    "excavation.blocks.broken": number,
    "excavation.blocks.value": number,
    "axes.damage": number,
    "axes.swings": number,
    "unarmed.hist": number,
    "unarmed.damage": number, 
  }
  last: "none",
  advancements: Array<string>,
  seenMobs: {
    seen: Array<string>
  },
  seenFoods: {
    seen: Array<string>
  },
  seenItems: {
    seen: Array<string>
  },
  seenRecipes: {
    seen: Array<string>
  },
  seenWorlds: {
    seen: Array<string>
  },
  seenPeople: {
    seen: Array<string>
  },
  seenEnvironments: {
    seen: Array<string>
  },
  seenPotionEffects: {
    seen: Array<string>
  },
  seenBlocks: {
    seen: Array<string>
  },
  multipliers: unknown[],
  wisdom: number,
  multiplier: number,
  lastLogin: number,
  masterXp: number,
  lastMasterXp: number
};

export const getPlayerSkillsRoute = new Hono()
  .get("/get-player-skills/:nickname", async (ctx) => {
    const { nickname } = ctx.req.param()

    try {
      let skills = await getSkills(nickname)

      if (!skills) {
        return ctx.json({ data: null }, 200)
      }

      const data = JSON.parse(skills.DATA) as SkillsData

      return ctx.json({ data }, 200)
    } catch (e) {
      return ctx.json({ error: throwError(e) }, 500)
    }
  })