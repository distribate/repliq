import type { Value } from '@udecode/plate';

import { withProps } from '@udecode/cn';
import {
  BoldPlugin,
  CodePlugin,
  ItalicPlugin,
  StrikethroughPlugin,
  SubscriptPlugin,
  SuperscriptPlugin,
  UnderlinePlugin,
} from '@udecode/plate-basic-marks/react';
import { BlockquotePlugin } from '@udecode/plate-block-quote/react';
import { CodeBlockPlugin, CodeLinePlugin, CodeSyntaxPlugin } from '@udecode/plate-code-block/react';
import { DatePlugin } from '@udecode/plate-date/react';
import { EmojiInputPlugin } from '@udecode/plate-emoji/react';
import { ExcalidrawPlugin } from '@udecode/plate-excalidraw/react';
import { HEADING_KEYS } from '@udecode/plate-heading';
import { HighlightPlugin } from '@udecode/plate-highlight/react';
import { HorizontalRulePlugin } from '@udecode/plate-horizontal-rule/react';
import { ColumnItemPlugin, ColumnPlugin } from '@udecode/plate-layout/react';
import { LinkPlugin } from '@udecode/plate-link/react';
import { EquationPlugin, InlineEquationPlugin } from '@udecode/plate-math/react';
import { SlashInputPlugin } from '@udecode/plate-slash-command/react';
import { TogglePlugin } from '@udecode/plate-toggle/react';
import { type CreatePlateEditorOptions, ParagraphPlugin, PlateLeaf, usePlateEditor } from '@udecode/plate/react';

import { editorPlugins } from '#plate/plugins/editor-plugins.tsx';
import { BlockquoteElement } from '#plate/ui/blockquote-element.tsx';
import { CodeBlockElement } from '#plate/ui/code-block-element.tsx';
import { CodeLeaf } from '#plate/ui/code-leaf.tsx';
import { CodeLineElement } from '#plate/ui/code-line-element.tsx';
import { CodeSyntaxLeaf } from '#plate/ui/code-syntax-leaf.tsx';
import { ColumnElement } from '#plate/ui/column-element.tsx';
import { ColumnGroupElement } from '#plate/ui/column-group-element.tsx';
import { DateElement } from '#plate/ui/date-element.tsx';
import { EmojiInputElement } from '#plate/ui/emoji-input-element.tsx';
import { EquationElement } from '#plate/ui/equation-element.tsx';
import { ExcalidrawElement } from '#plate/ui/excalidraw-element.tsx';
import { HeadingElement } from '#plate/ui/heading-element.tsx';
import { HighlightLeaf } from '#plate/ui/highlight-leaf.tsx';
import { HrElement } from '#plate/ui/hr-element.tsx';
import { InlineEquationElement } from '#plate/ui/inline-equation-element.tsx';
import { LinkElement } from '#plate/ui/link-element.tsx';
import { ParagraphElement } from '#plate/ui/paragraph-element.tsx';
import { withPlaceholders } from '#plate/ui/placeholder.tsx';
import { SlashInputElement } from '#plate/ui/slash-input-element.tsx';
import { ToggleElement } from '#plate/ui/toggle-element.tsx';

export const viewComponents = {
  [BlockquotePlugin.key]: BlockquoteElement,
  [BoldPlugin.key]: withProps(PlateLeaf, { as: 'strong' }),
  [CodeBlockPlugin.key]: CodeBlockElement,
  [CodeLinePlugin.key]: CodeLineElement,
  [CodePlugin.key]: CodeLeaf,
  [CodeSyntaxPlugin.key]: CodeSyntaxLeaf,
  [ColumnItemPlugin.key]: ColumnElement,
  [ColumnPlugin.key]: ColumnGroupElement,
  [DatePlugin.key]: DateElement,
  [EquationPlugin.key]: EquationElement,
  [ExcalidrawPlugin.key]: ExcalidrawElement,
  [HEADING_KEYS.h1]: withProps(HeadingElement, { variant: 'h1' }),
  [HEADING_KEYS.h2]: withProps(HeadingElement, { variant: 'h2' }),
  [HEADING_KEYS.h3]: withProps(HeadingElement, { variant: 'h3' }),
  [HEADING_KEYS.h4]: withProps(HeadingElement, { variant: 'h4' }),
  [HEADING_KEYS.h5]: withProps(HeadingElement, { variant: 'h5' }),
  [HEADING_KEYS.h6]: withProps(HeadingElement, { variant: 'h6' }),
  [HighlightPlugin.key]: HighlightLeaf,
  [HorizontalRulePlugin.key]: HrElement,
  [InlineEquationPlugin.key]: InlineEquationElement,
  [ItalicPlugin.key]: withProps(PlateLeaf, { as: 'em' }),
  [LinkPlugin.key]: LinkElement,
  [ParagraphPlugin.key]: ParagraphElement,
  [StrikethroughPlugin.key]: withProps(PlateLeaf, { as: 's' }),
  [SubscriptPlugin.key]: withProps(PlateLeaf, { as: 'sub' }),
  [SuperscriptPlugin.key]: withProps(PlateLeaf, { as: 'sup' }),
  [TogglePlugin.key]: ToggleElement,
  [UnderlinePlugin.key]: withProps(PlateLeaf, { as: 'u' }),
};

export const editorComponents = {
  ...viewComponents,
  [EmojiInputPlugin.key]: EmojiInputElement,
  [SlashInputPlugin.key]: SlashInputElement,
};

export const useCreateEditor = (
  {
    components,
    override,
    readOnly,
    ...options
  }: {
    components?: Record<string, any>;
    plugins?: any[];
    readOnly?: boolean;
  } & Omit<CreatePlateEditorOptions, 'plugins'> = {},
  deps: any[] = []
) => {
  return usePlateEditor<Value>(
    {
      override: {
        components: {
          ...(readOnly ? viewComponents : withPlaceholders(editorComponents)),
          ...components,
        },
        ...override,
      },
      plugins: [
        ...editorPlugins,
      ],
      ...options,
    },
    deps
  );
};
