import { fetchOptions } from '../constants/fetch-options.ts';
import { hc } from 'hono/client';
import { AchievementsAppType, SkinAppType, LandsAppType } from 'minecraft-backend/src/types/routes-types';

const baseUrl = `https://api.fasberry.su/api/minecraft`;

export const landsClient = hc<LandsAppType>(baseUrl, fetchOptions)
export const skinClient = hc<SkinAppType>(baseUrl, fetchOptions)
export const achievementsClient = hc<AchievementsAppType>(baseUrl, fetchOptions)