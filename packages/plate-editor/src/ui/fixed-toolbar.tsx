import { withCn } from '@udecode/cn';

import { Toolbar } from './toolbar';

export const FixedToolbar = withCn(
  Toolbar,
  `sticky top-0 left-0 z-50 scrollbar-hide w-full justify-between overflow-x-auto
  rounded-t-lg border-b border-shark-900 bg-shark-950 p-1 py-3`
);