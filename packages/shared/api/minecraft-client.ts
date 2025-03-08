import { fetchOptions } from '../constants/fetch-options.ts';
import { hc } from 'hono/client';
import type { 
  AchievementsAppType, 
  SkinAppType, 
  LandsAppType, 
  RatingAppType 
} from 'apps/minecraft-backend/src/types/routes-types.ts';

const baseUrl = `https://api.fasberry.su/minecraft`;

export const landsClient = hc<LandsAppType>(baseUrl, fetchOptions)
export const skinClient = hc<SkinAppType>(baseUrl, fetchOptions)
export const achievementsClient = hc<AchievementsAppType>(baseUrl, fetchOptions)
export const ratingClient = hc<RatingAppType>(baseUrl, fetchOptions)