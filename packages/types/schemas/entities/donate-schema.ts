import * as z from "zod";

export const donateSchema = z.enum(['authentic', 'arkhont', 'loyal']);