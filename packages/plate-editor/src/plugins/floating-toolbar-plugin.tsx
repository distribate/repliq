'use client';

import { createPlatePlugin } from '@udecode/plate/react';

import { FloatingToolbar } from '#ui/floating-toolbar.tsx';
import { FloatingToolbarButtons } from '#ui/floating-toolbar-buttons.tsx';

export const FloatingToolbarPlugin = createPlatePlugin({
  key: 'floating-toolbar',
  render: {
    afterEditable: () => (
      <FloatingToolbar>
        <FloatingToolbarButtons />
      </FloatingToolbar>
    ),
  },
});
