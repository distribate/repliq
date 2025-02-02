import { z } from 'zod';

export const getUserPostsSchema = z.object({
  filteringType: z.enum(['created_at', 'views_count']),
  ascending: z.string().transform((val) => val === "true").optional(),
  cursor: z.string().optional(),
  searchQuery: z.string().optional()
})