import { z } from "zod/v4";

export const donateSchema = z.enum(["arkhont", "authentic", "loyal", "default", "dev", "helper", "moder"])