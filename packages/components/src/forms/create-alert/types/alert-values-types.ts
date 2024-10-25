import { AlertEntity } from '@repo/types/entities/entities-type.ts';

export type AlertValues = Pick<AlertEntity, 'title' | 'description' | 'link'>