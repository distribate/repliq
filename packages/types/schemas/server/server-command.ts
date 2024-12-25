import { z } from 'zod';

export const callServerCommandSchema = z.object({
  parent: z.enum(["lp", "sudo", "cmi"]),
  value: z.string()
})