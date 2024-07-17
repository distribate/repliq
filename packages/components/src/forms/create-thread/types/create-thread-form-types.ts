import { z } from "zod";
import { createThreadSchema } from "../schemas/create-thread-schema.ts";
import { Control } from 'react-hook-form';

export type CreateThreadProps = {
  control: Control<zodCreateThreadForm, any>,
  errors?: string
}

export type zodCreateThreadForm = z.infer<typeof createThreadSchema>