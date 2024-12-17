import { z } from 'zod';

export const getUserPostsSchema = z.object({
  limit: z.string().transform(Number).optional(),
  ascending: z.boolean().optional(),
  searchQuery: z.string().optional(),
  filteringType: z.enum(['created_at', 'views_count']).optional(),
  range: z.array(z.string().transform(Number)).length(2).optional(),
  currentUserNickname: z.string(),
});