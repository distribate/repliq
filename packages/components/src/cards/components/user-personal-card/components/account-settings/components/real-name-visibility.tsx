import { DropdownWrapper } from '#wrappers/dropdown-wrapper.tsx';
import { Typography } from '@repo/ui/src/components/typography.tsx';
import { HoverCardItem } from '@repo/ui/src/components/hover-card.tsx';
import { useUpdateUserSettings } from '@repo/lib/hooks/use-update-user-settings.ts';
import { currentUserQuery } from '@repo/lib/queries/current-user-query.ts';

const REAL_NAME_PREFER_OPTIONS = [
  { name: 'включить', value: true },
  { name: 'выключить', value: false },
];

export const RealNameVisibility = () => {
  const { preferences: { real_name_visible } } = currentUserQuery().data;
  const { updateUserSettingsMutation } = useUpdateUserSettings();
  
  const handleRealNameVisibility = (value: boolean) => {
    if (value === real_name_visible) return;
    
    return updateUserSettingsMutation.mutate({
      setting: 'real_name_visible', value,
    });
  };
  
  return (
    <DropdownWrapper
      properties={{ contentAlign: 'end', sideAlign: 'right' }}
      trigger={
        <Typography className="text-base">
          {real_name_visible ? 'видно' : 'скрыто'}
        </Typography>
      }
      content={
        <div className="flex flex-col gap-y-4">
          <div className="flex justify-start w-full flex-col pt-2 px-2">
            <Typography className="text-shark-300 text-sm">
              Реальное имя
            </Typography>
          </div>
          <div className="flex flex-col gap-y-2">
            {REAL_NAME_PREFER_OPTIONS.map(({ name, value }) => (
              <HoverCardItem
                key={value.toString()}
                isActive={real_name_visible === value}
                onClick={() => handleRealNameVisibility(value)}
              >
                <Typography>{name}</Typography>
              </HoverCardItem>
            ))}
          </div>
        </div>
      }
    />
  );
};
