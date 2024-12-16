import { DropdownWrapper } from '#wrappers/dropdown-wrapper.tsx';
import { Typography } from '@repo/ui/src/components/typography.tsx';
import { HoverCardWrapper } from '#wrappers/hover-card-wrapper.tsx';
import { currentUserQuery } from '@repo/lib/queries/current-user-query.ts';
import { useUpdateUserSettings } from '@repo/lib/hooks/use-update-user-settings.ts';
import { DropdownMenuItem } from '@repo/ui/src/components/dropdown-menu.tsx';

export const OutlineCover = () => {
  const { preferences: { cover_outline_visible } } = currentUserQuery().data;
  const { updateUserSettingsMutation } = useUpdateUserSettings()
  
  const handleCoverOutlineVisibility = (value: boolean) => {
    if (value === cover_outline_visible) return;
    
    return updateUserSettingsMutation.mutate({
      setting: "cover_outline_visible", value
    })
  }

  return (
    <DropdownWrapper
      properties={{ contentAlign: 'end', sideAlign: 'right' }}
      trigger={
        <Typography className="text-base">
          {cover_outline_visible ? 'вкл' : 'выкл'}
        </Typography>
      }
      content={
        <div className="flex flex-col gap-y-4">
          <div className="flex justify-start w-full flex-col pt-2 px-2">
            <Typography className="text-shark-300 text-sm">
              Обводка профиля
            </Typography>
            <HoverCardWrapper
              properties={{
                delay: 10,
                contentAlign: 'center',
                sideAlign: 'right',
              }}
              trigger={
                <Typography className="text-shark-400 text-sm hover:text-pink-500 cursor-pointer">
                  (подробнее)
                </Typography>
              }
              content={
                <div className="flex flex-col gap-y-2 w-full p-2">
                  <Typography textSize="small" textColor="shark_white">
                    Обводка вокруг профиля - уникальная фича, чтобы выделиться
                    среди других игроков.
                  </Typography>
                  <Typography textSize="small" textColor="shark_white">
                    Цвет обводки зависит от типа привилегии.
                  </Typography>
                </div>
              }
            />
          </div>
          <div className="flex flex-col gap-y-2">
            <DropdownMenuItem onClick={() => handleCoverOutlineVisibility(true)}>
              <Typography state={cover_outline_visible ? 'active' : 'default'}>
                включить
              </Typography>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleCoverOutlineVisibility(false)}>
              <Typography state={!cover_outline_visible ? 'active' : 'default'}>
                выключить
              </Typography>
            </DropdownMenuItem>
          </div>
        </div>
      }
    />
  );
};