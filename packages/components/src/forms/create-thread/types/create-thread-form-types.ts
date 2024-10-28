import { z } from "zod";
import { createThreadSchema } from "../schemas/create-thread-schema.ts";
import { Control, FieldErrors } from 'react-hook-form';

export type FormChildsProps = {
  control: Control<zodCreateThreadForm, any>,
  errors: FieldErrors<zodCreateThreadForm>
}

export type zodCreateThreadForm = z.infer<typeof createThreadSchema>