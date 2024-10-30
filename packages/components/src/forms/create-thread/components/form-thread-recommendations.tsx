'use client';

import { Typography } from '@repo/ui/src/components/typography.tsx';
import { useState } from 'react';
import { MessageSquareWarning } from 'lucide-react';

export const FormThreadRecommendations = () => {
  const [ expanded, setExpanded ] = useState<boolean>(true);
  
  return (
    <div className="flex flex-col w-full gap-2">
      <div onClick={() => setExpanded(prev => !prev)} className="flex items-center cursor-pointer gap-2 w-fit">
        <Typography textSize="large" textColor="gray">
          Рекомендации
        </Typography>
        <MessageSquareWarning size={18} className="text-shark-300" />
      </div>
      {expanded && (
        <div className="flex flex-col gap-1 w-full h-full">
          <Typography>
            {`>`} категория треда обязательна. Выбирайте близкую по смыслу треда
          </Typography>
          <Typography>
            {`>`} заголовок должен быть понятен и не должен быть слишком короткий или длинный,
          </Typography>
          <Typography>
            {`>`} описание треда необязательно
          </Typography>
          <Typography>
            {`>`} вы можете добавить изображения к треду, если нужно
          </Typography>
          <Typography>
            {`>`} теги могут быть использованы для быстрого поиска треда, но необязательны
          </Typography>
        </div>
      )}
    </div>
  );
};