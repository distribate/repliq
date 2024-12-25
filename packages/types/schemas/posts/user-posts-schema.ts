import { z } from 'zod';
import { queryRouteSchema } from '../global/query-route-schema.ts';

export const getUserPostsSchema = z.object({
  filteringType: z.enum(['created_at', 'views_count']),
  currentUserNickname: z.string({
    message: "Current user nickname is required"
  })
}).merge(queryRouteSchema)