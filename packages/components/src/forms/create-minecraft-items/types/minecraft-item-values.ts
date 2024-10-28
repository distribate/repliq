import { Tables } from '@repo/types/entities/supabase.ts';

export type MinecraftItemValues = Omit<Tables<"config_minecraft_items">, "id">