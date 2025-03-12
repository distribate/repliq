import { isProduction } from '@repo/lib/helpers/is-production.ts';
import { fetchOptions } from '../constants/fetch-options.ts';
import { hc } from 'hono/client';
import type { 
  AchievementsAppType, 
  SkinAppType, 
  LandsAppType, 
  RatingAppType,
  PlayerAppType
} from 'minecraft-backend/src/types/routes-types.ts';

const baseUrl = isProduction ? `https://api.fasberry.su/minecraft` : "http://localhost:4102/minecraft";

export const landsClient = hc<LandsAppType>(baseUrl, fetchOptions)
export const skinClient = hc<SkinAppType>(baseUrl, fetchOptions)
export const achievementsClient = hc<AchievementsAppType>(baseUrl, fetchOptions)
export const ratingClient = hc<RatingAppType>(baseUrl, fetchOptions)
export const playerClient = hc<PlayerAppType>(baseUrl, fetchOptions)