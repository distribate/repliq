import { Typography } from '@repo/ui/src/components/typography.tsx';
import { EditorPanel } from '../../../editor/components/editor-panel.tsx';
import { Editable, RenderPlaceholderProps, Slate, withReact } from 'slate-react';
import { serializeNodes } from '@repo/lib/helpers/serialize-nodes.ts';
import { Controller, useController } from 'react-hook-form';
import { useState } from 'react';
import { createEditor, Descendant } from 'slate';
import { useCreateThread } from '../hooks/use-create-thread.tsx';
import { useCreateThreadImages } from '../hooks/use-create-thread-images.ts';
import { ImagePlus } from 'lucide-react';
import { FormChildsProps } from '../types/create-thread-form-types.ts';
import { Button } from '@repo/ui/src/components/button.tsx';
import { OperationType } from '@repo/types/global';
import { handleEventKeyDown } from '../../../editor/helpers/handle-event-keydown.ts';
import { RenderElement } from '../../../editor/components/render-element.tsx';
import { RenderLeaf } from '../../../editor/components/render-leaf.tsx';
import { threadFormQuery } from '../queries/thread-form-query.ts';
import { THREAD_CONTENT_LIMIT } from '../schemas/create-thread-schema.ts';

const initialValue = [ {
  type: 'paragraph', children: [ { text: '' } ],
} ];

const FormThreadContentPlaceholder = ({
  ...props
}: RenderPlaceholderProps) => {
  return <span className="py-2 text-[15px]" {...props.attributes}>{props.children}</span>;
};

export const FormThreadContent = ({
  errors, control,
}: FormChildsProps) => {
  const { updateThreadFormMutation } = useCreateThread();
  const { handleControlImage } = useCreateThreadImages();
  const [ editor ] = useState(() => withReact(createEditor()));
  const { data: threadFormValues } = threadFormQuery();
  
  const { field: { onChange } } = useController(
    { name: 'content', control, rules: { required: true } },
  );
  
  const handleOnChange = (value: Descendant[]) => {
    const isAstChange = editor.operations.some(
      (op: { type: OperationType; }) => 'set_selection' !== op.type,
    );
    
    if (isAstChange) {
      return updateThreadFormMutation.mutate({
        values: { content: value },
      });
    }
  };
  
  return (
    <div className="flex flex-col gap-y-1 w-full max-w-full overflow-hidden">
      <Typography textColor="shark_white" textSize="large">
        Контент
      </Typography>
      <div className="flex flex-col gap-y-2 w-full">
        <EditorPanel
          editor={editor}
          withImage={
            <Button
              onMouseDown={event => event.preventDefault()}
              type="button"
              className="group hover:bg-shark-800 relative w-12 overflow-hidden"
            >
              <ImagePlus size={16} className="text-shark-300" />
              <Controller
                name="images"
                control={control}
                render={({ field: { name, ref, onChange } }) => (
                  <input
                    type="file"
                    name={name}
                    title="Загрузить изображения"
                    ref={ref}
                    accept="image/*"
                    multiple
                    className="absolute cursor-pointer right-0 top-0 left-0 bottom-0 opacity-0 w-full"
                    onChange={(e) => {
                      const images = e.target.files
                        ? Array.from(e.target.files).slice(0, 2) as File[] : [];
                      onChange(images);
                      return handleControlImage({ e, type: 'add', images });
                    }}
                  />
                )}
              />
            </Button>
          }
        />
        <Slate
          editor={editor}
          initialValue={initialValue}
          onValueChange={value => onChange(serializeNodes(value))}
          onChange={handleOnChange}
        >
          <Editable
            renderLeaf={props => <RenderLeaf {...props} children={props.children} />}
            renderElement={props => <RenderElement {...props} children={props.children} />}
            renderPlaceholder={props => <FormThreadContentPlaceholder {...props} children={props.children} />}
            onKeyDown={event => handleEventKeyDown({ event, editor })}
            placeholder="Напишите что-нибудь"
            className="form-editor"
            disableDefaultStyles={true}
          />
        </Slate>
        <Typography textSize="small" textColor="gray" className="self-end">
          {(threadFormValues.values && threadFormValues.values.content)
            ? serializeNodes(threadFormValues.values.content).length
            : 0}/{THREAD_CONTENT_LIMIT
        }
        </Typography>
      </div>
      {errors.content && (
        <span className="text-red-600 text-[16px] font-normal">
          {errors.content.message}
        </span>
      )}
    </div>
  );
};