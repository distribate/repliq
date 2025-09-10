import { CursorOverlayPlugin } from '@platejs/selection/react';

import { CursorOverlay } from '#plate/components/ui/cursor-overlay';

export const CursorOverlayKit = [
  CursorOverlayPlugin.configure({
    render: {
      afterEditable: () => <CursorOverlay />,
    },
  }),
];