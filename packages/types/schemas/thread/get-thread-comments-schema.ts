import { z } from 'zod';
import { queryRouteSchema } from '../global/query-route-schema.ts';

export const getThreadCommentsSchema = queryRouteSchema.extend({
  limit: z.string().transform(Number).optional()
}).omit({
  searchQuery: true
})