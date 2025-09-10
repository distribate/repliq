import * as React from 'react';

import type { SlateElementProps } from 'platejs';

import { SlateElement } from 'platejs';

import { cn } from '#plate/lib/utils.ts';

export function HrElementStatic(props: SlateElementProps) {
  return (
    <SlateElement {...props}>
      <div className="cursor-text py-6" contentEditable={false}>
        <hr
          className={cn(
            'h-0.5 rounded-sm border-none bg-shark-800/60 bg-clip-content'
          )}
        />
      </div>
      {props.children}
    </SlateElement>
  );
}