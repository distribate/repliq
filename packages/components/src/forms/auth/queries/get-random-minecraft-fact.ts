import { createClient } from "../../../../../lib/utils/api/supabase-client.ts";

function getRandomArbitrary(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

export async function getRandomMinecraftFact() {
  const randomId = getRandomArbitrary(1, 97);
  const api = createClient();

  const { data, error } = await api
    .from("config_minecraft_facts")
    .select("fact")
    .eq("id", Math.floor(randomId))
    .single();

  if (error) {
    return null;
  }

  return data;
}
