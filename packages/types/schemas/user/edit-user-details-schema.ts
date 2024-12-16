import { z } from 'zod';

export const userDetailsSchema = z.object({
  userId: z.string(),
  value: z.union([
    z.string().nullable(),
    z.string().default('#FFFFFF'),
  ]),
  criteria: z.enum([ 'real_name', 'birthday', 'description', 'name_color', 'favorite_item' ]),
}).refine(
  ({ value, criteria }) => {
    switch(criteria) {
      case 'real_name':
      case 'birthday':
      case 'description':
        return value === null || value.length > 0;
      case 'name_color':
        return /^#[0-9a-fA-F]{6}$/.test(value || '');
      case 'favorite_item':
        return value !== null && value.length >= 1 && value.length <= 100;
      default:
        return false;
    }
  },
  {
    message: 'Value does not meet the criteria requirements',
    path: [ 'value' ],
  },
);