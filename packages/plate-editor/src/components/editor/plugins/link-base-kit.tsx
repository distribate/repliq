import { BaseLinkPlugin } from '@platejs/link';

import { LinkElementStatic } from '#plate/components/ui/link-node-static';

export const BaseLinkKit = [BaseLinkPlugin.withComponent(LinkElementStatic)];