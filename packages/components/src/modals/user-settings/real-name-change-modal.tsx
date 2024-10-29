import { Typography } from '@repo/ui/src/components/typography.tsx';
import {
  RealNameChange,
} from '../../cards/components/user-personal-card/components/profile-settings/components/real-name-change/components/real-name-change.tsx';
import { useQueryClient } from '@tanstack/react-query';
import { CURRENT_USER_QUERY_KEY, CurrentUser } from '@repo/lib/queries/current-user-query.ts';
import { DynamicModal } from '../dynamic-modal.tsx';
import { UPDATE_FIELD_MUTATION_KEY } from '@repo/lib/hooks/use-update-current-user.ts';

export const RealNameChangeModal = () => {
  const qc = useQueryClient();
  const currentUser = qc.getQueryData<CurrentUser>(CURRENT_USER_QUERY_KEY);
  
  const realName = currentUser?.real_name;
  
  return (
    <DynamicModal
      mutationKey={UPDATE_FIELD_MUTATION_KEY}
      trigger={<div className="flex items-center gap-1">
        <Typography className="text-base">
          {realName ? realName : 'не указано'}
        </Typography>
      </div>}
      content={
        <RealNameChange />
      }
    />
  );
};