import { FormField } from '@repo/ui/src/components/form-field.tsx';
import { Typography } from '@repo/ui/src/components/typography.tsx';
import { EditorPanel } from '../../../editor/components/editor-panel.tsx';
import { Editable, Slate, withReact } from 'slate-react';
import { serializeNodes } from '@repo/lib/helpers/serialize-nodes.ts';
import { CustomEditor } from '../../../editor/components/editor.tsx';
import { Controller, useController } from 'react-hook-form';
import { useCallback, useState } from 'react';
import { createEditor } from 'slate';
import { CodeElement } from '../../../editor/components/code-element.tsx';
import { DefaultElement } from '../../../editor/components/default-element.tsx';
import { Leaf } from '../../../editor/components/leaf.tsx';
import { useCreateThread } from '../hooks/use-create-thread.tsx';
import { useCreateThreadImages } from '../hooks/use-create-thread-images.ts';
import { ImagePlus } from 'lucide-react';
import { FormChildsProps } from './create-thread-form.tsx';

const initialValue = [ {
  type: 'paragraph',
  children: [ { text: '' } ],
} ];

export const FormThreadContent = ({
  errors, control
}: FormChildsProps) => {
  const { updateThreadFormMutation } = useCreateThread();
  const { handleControlImage } = useCreateThreadImages();
  const [ editor ] = useState(() => withReact(createEditor()));
  
  const { field: { onChange } } = useController(
    { name: 'content', control, rules: { required: true } },
  );
  
  const renderElement = useCallback(({ ...props }) => {
    switch(props.element.type) {
      case 'code':
        return <CodeElement {...props} />;
      case 'italic':
        return <DefaultElement {...props} />;
      default:
        return <DefaultElement {...props} />;
    }
  }, []);
  
  const renderLeaf = useCallback(({ ...props }) => {
    return <Leaf {...props} />;
  }, []);
  
  return (
    <FormField errorMessage={errors?.content?.message}>
      <div className="flex flex-col">
        <Typography textColor="shark_white" textSize="medium">
          Контент
        </Typography>
        <Typography className="text-shark-300" textSize="small">
          (основная часть поста)
        </Typography>
      </div>
      <div className="flex flex-col gap-y-2 w-full">
        <EditorPanel
          editor={editor}
          withImage={{
            trigger: (
              <div className="flex px-4 py-2 gap-2 items-center group relative">
                <ImagePlus
                  size={16}
                  className="text-shark-300 group-hover:text-caribbean-green-500"
                />
                <Controller
                  name="images"
                  control={control}
                  render={({ field: { name, ref, onChange } }) => (
                    <input
                      type="file"
                      name={name}
                      ref={ref}
                      accept="image/*"
                      multiple
                      className="absolute right-0 top-0 left-0 bottom-0 opacity-0 w-full"
                      onChange={(e) => {
                        const files = e.target.files
                          ? Array.from(e.target.files).slice(0, 2) as File[]
                          : [];
                        
                        onChange(files);
                        return handleControlImage({
                          e, type: 'add', images: files
                        });
                      }}
                    />
                  )}
                />
              </div>
            ),
            content: (
              <Typography textSize="small">
                Прикрепить изображения
              </Typography>
            ),
          }}
        />
        <Slate
          editor={editor}
          initialValue={initialValue}
          onValueChange={(value) => onChange(serializeNodes(value))}
          onChange={value => {
            const isAstChange = editor.operations.some(
              // @ts-ignore
              op => 'set_selection' !== op.type,
            );
            
            if (isAstChange) {
              updateThreadFormMutation.mutate({
                values: {
                  content: value,
                },
              });
            }
          }}
        >
          <Editable
            renderLeaf={renderLeaf}
            renderElement={renderElement}
            className="relative px-4 py-2 bg-shark-900 !text-sm text-shark-50 w-full rounded-md min-h-[160px] whitespace-pre-wrap break-words"
            disableDefaultStyles={true}
            renderPlaceholder={({ attributes, children }) => (
              <span className="py-2 text-sm" {...attributes}>
                {children}
              </span>
            )}
            onKeyDown={event => {
              if (!event.ctrlKey) return;
              
              switch(event.key) {
                case '`': {
                  event.preventDefault();
                  CustomEditor.toggleCodeBlock(editor);
                  break;
                }
                
                case 'b': {
                  event.preventDefault();
                  CustomEditor.toggleBoldMark(editor);
                  break;
                }
              }
            }}
            placeholder="Напишите что-нибудь"
          />
        </Slate>
      </div>
    </FormField>
  );
};