import { DropdownWrapper } from '#wrappers/dropdown-wrapper.tsx';
import { Typography } from '@repo/ui/src/components/typography.tsx';
import { useUpdateCurrentUser } from '@repo/lib/hooks/use-update-current-user.ts';
import { getPreferenceValue } from '@repo/lib/helpers/convert-user-preferences-to-map.ts';
import { HoverCardItem } from '@repo/ui/src/components/hover-card.tsx';
import { getUser } from '@repo/lib/helpers/get-user.ts';

type RealNamePreferType = {
  e: React.MouseEvent<HTMLDivElement>,
  value: boolean,
}

const REAL_NAME_PREFER_OPTIONS = [
  { name: 'включить', value: true },
  { name: 'выключить', value: false },
];

const REAL_NAME_VISIBILITY_NAME = "realNameVisibility"

export const RealNameVisibility = () => {
  const currentUser = getUser();
  const { updateFieldMutation } = useUpdateCurrentUser();
  
  if (!currentUser) return null;
  
  const preferences = currentUser.properties.preferences;
  const preferRealName = getPreferenceValue(
    preferences, REAL_NAME_VISIBILITY_NAME
  );
  
  const handleRealNamePrefer = (values: RealNamePreferType) => {
    const { e, value } = values;
    
    e.preventDefault();
    
    updateFieldMutation.mutate({
      value: value.toString(),
      field: 'preferences',
      preferences: { value: value, key: REAL_NAME_VISIBILITY_NAME, },
    });
  };
  
  return (
    <DropdownWrapper
      properties={{ contentAlign: 'end', sideAlign: 'right' }}
      trigger={
        <Typography className="text-base">
          {preferRealName ? 'видно' : 'скрыто'}
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
            {REAL_NAME_PREFER_OPTIONS.map(option => (
              <HoverCardItem
                key={option.value.toString()}
                isActive={preferRealName === option.value}
                onClick={(e) => handleRealNamePrefer({ e, value: option.value })}
              >
                <Typography>{option.name}</Typography>
              </HoverCardItem>
            ))}
          </div>
        </div>
      }
    />
  );
};