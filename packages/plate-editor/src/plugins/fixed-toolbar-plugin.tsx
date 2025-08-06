'use client';

import { createPlatePlugin } from '@udecode/plate/react';

import { FixedToolbar } from '#plate/ui/fixed-toolbar.tsx';
import { FixedToolbarButtons } from '#plate/ui/fixed-toolbar-buttons.tsx';

export const FixedToolbarPlugin = createPlatePlugin({
  key: 'fixed-toolbar',
  render: {
    beforeEditable: () => (
      <FixedToolbar>
        <FixedToolbarButtons />
      </FixedToolbar>
    ),
  },
});
