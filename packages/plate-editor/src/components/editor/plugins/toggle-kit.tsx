

import { TogglePlugin } from '@platejs/toggle/react';

import { IndentKit } from '#plate/components/editor/plugins/indent-kit';
import { ToggleElement } from '#plate/components/ui/toggle-node';

export const ToggleKit = [
  ...IndentKit,
  TogglePlugin.withComponent(ToggleElement),
];
