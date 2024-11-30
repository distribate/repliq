import { Typography } from '@repo/ui/src/components/typography.tsx';
import { EditorPanel } from '#editor/components/editor-panel.tsx';
import { Editable, RenderPlaceholderProps, Slate, withReact } from 'slate-react';
import { serializeNodes } from '@repo/lib/helpers/nodes-serializer.ts';
import { Controller, useController } from 'react-hook-form';
import { useState, ChangeEvent } from 'react';
import { createEditor, Descendant } from 'slate';
import { getContentLimit, useCreateThread } from '../hooks/use-create-thread.tsx';
import { ImagePlus } from 'lucide-react';
import { FormChildsProps } from '../types/create-thread-form-types.ts';
import { Button } from '@repo/ui/src/components/button.tsx';
import { handleEventKeyDown } from '#editor/helpers/handle-event-keydown.ts';
import { RenderElement } from '#editor/components/render-element.tsx';
import { RenderLeaf } from '#editor/components/render-leaf.tsx';
import { threadFormQuery } from '../queries/thread-form-query.ts';
import { handleOnChangeEditor } from '#editor/helpers/handle-on-change.ts';
import { THREAD_CONTENT_LIMIT_DEFAULT, THREAD_IMAGES_LIMIT_DEFAULT } from '@repo/shared/constants/limits.ts';

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
  const { updateThreadFormMutation, handleControlImage } = useCreateThread();
  const [ editor ] = useState(() => withReact(createEditor()));
  const { data: threadFormValues } = threadFormQuery();
  
  const { field: { onChange } } = useController(
    { name: 'content', control, rules: { required: true } },
  );
  
  const handleOnChange = (value: Descendant[]) => {
    const isAstChange = handleOnChangeEditor(editor, value)
    
    if (isAstChange) updateThreadFormMutation.mutate({ content: value });
  };
  
  const handleAddImages = (
    e: ChangeEvent<HTMLInputElement>,
    onChange: (...event: any[]) => void
  ) => {
    const images = e.target.files ? Array
    .from(e.target.files)
    .slice(THREAD_IMAGES_LIMIT_DEFAULT[0], THREAD_IMAGES_LIMIT_DEFAULT[1]) as Array<File> : null;
    
    onChange(images);
    e.preventDefault()
    
    return handleControlImage({ type: 'add', images });
  }
  
  const contentLength = (threadFormValues && threadFormValues.content)
    ? serializeNodes(threadFormValues.content).length : 0
  
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
                render={({ field }) => (
                  <input
                    type="file"
                    name={field.name}
                    title="Загрузить изображения"
                    ref={field.ref}
                    accept="image/*"
                    multiple
                    className="absolute cursor-pointer right-0 top-0 left-0 bottom-0 opacity-0 w-full"
                    onChange={e => handleAddImages(e, field.onChange)}
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
            className="form-editor !max-w-6xl"
            disableDefaultStyles={true}
          />
        </Slate>
        <Typography textSize="small" textColor="gray" className="self-end">
          {contentLength}/{threadFormValues.images ? getContentLimit(threadFormValues.images) : THREAD_CONTENT_LIMIT_DEFAULT[2]}
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