import { hc } from 'hono/client';
import { SkinAppType } from 'skin-backend/src';

export const skinClient = hc<SkinAppType>(`http://localhost:4102/`)