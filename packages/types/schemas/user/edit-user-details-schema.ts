import { z } from 'zod/v4';

const realNameSchema = z.string().min(1).nullable()

export const userDetailsSchema = z.object({
  value: z.union([
    z.string().nullable(),
    z.number(),
  ]),
  criteria: z.enum([
    'real_name', 'birthday', 'description', 'name_color', 'favorite_item'
  ]),
}).refine(({ value, criteria }) => {
  switch (criteria) {
    case 'real_name':
      return realNameSchema.safeParse(value).success;
    case 'birthday':
    case 'description':
      return value === null || (typeof value === 'string' && value.length > 0);
    case 'name_color':
      return typeof value === 'string' && /^#[0-9a-fA-F]{6}$/.test(value);
    case 'favorite_item':
      const numberValue = typeof value === 'number' ? value : Number(value);
      return !isNaN(numberValue) && numberValue >= 1 && numberValue <= 100;
    default:
      return false;
  }
}, {
  error: 'Value does not meet the criteria requirements',
  path: ['value'],
});