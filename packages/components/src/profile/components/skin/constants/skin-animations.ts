import { SkinAnimation } from '../queries/skin-query.ts';

type SkinControls = {
  animation: SkinAnimation,
  icon: SkinIconType,
}

type SkinIconType =
  | 'sprite/people-idle'
  | 'sprite/people-running'
  | 'sprite/people-flying'

export const SKIN_ANIMATIONS: SkinControls[] = [
  {
    animation: 'idle', icon: 'sprite/people-idle',
  },
  {
    animation: 'run', icon: 'sprite/people-running',
  },
  {
    animation: 'flying', icon: 'sprite/people-flying',
  },
];