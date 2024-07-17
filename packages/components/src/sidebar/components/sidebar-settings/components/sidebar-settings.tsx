import { GripVertical, LogOut } from 'lucide-react';
import { Separator } from '@repo/ui/src/components/separator.tsx';
import { Typography } from '@repo/ui/src/components/typography.tsx';
import { DropdownMenuItem } from '@repo/ui/src/components/dropdown-menu.tsx';
import { PanelsTopLeft } from 'lucide-react';
import { HoverCardItem } from '@repo/ui/src/components/hover-card.tsx';
import { SIDEBAR_FORMATS } from '../constants/sidebar-formats.ts';
import { DropdownWrapper } from '../../../../wrappers/dropdown-wrapper.tsx';
import { DialogWrapper } from '../../../../wrappers/dialog-wrapper.tsx';
import {
  LogoutConfirmation,
} from '../../../../modals/action-confirmation/components/logout/components/logout-confirmation.tsx';
import { NavigationBar } from '../../sidebar-content/navigation/navigation-bar.tsx';
import { SidebarFormat, sidebarLayoutQuery } from '../../sidebar-layout/queries/sidebar-layout-query.ts';
import { useSidebarControl } from '../../sidebar-layout/hooks/use-sidebar-control.ts';

export const SidebarSettings = () => {
  const { data: sidebarState } = sidebarLayoutQuery();
  const { updateSidebarPropertiesMutation, isCompact, isExpanded } = useSidebarControl();
  
  const isValue = (format: SidebarFormat) => format === sidebarState.format;
  
  return (
    <div className="flex items-center justify-end flex-wrap bg-white/10 self-end rounded-md px-3 py-1 w-full gap-2">
      {isCompact || !isExpanded ? (
        <DropdownWrapper
          properties={{ sideAlign: 'right', contentAlign: 'end' }}
          trigger={
            <div className="flex justify-center items-center">
              <PanelsTopLeft size={18} className="text-neutral-400 cursor-pointer" />
            </div>
          }
          content={
            <div className="flex flex-col gap-y-2">
              <DropdownWrapper
                properties={{ sideAlign: 'right', contentAlign: 'end', }}
                trigger={
                  <DropdownMenuItem
                    onClick={(e) => {
                      e.preventDefault();
                    }}
                  >
                    <Typography>Режим сайдбара</Typography>
                  </DropdownMenuItem>
                }
                content={
                  <div className="flex flex-col gap-y-2">
                    {SIDEBAR_FORMATS.map((format, i) => (
                      <DropdownMenuItem
                        key={i}
                        onClick={(e) => {
                          e.preventDefault();
                          updateSidebarPropertiesMutation.mutate({
                            type: 'format',
                            values: { format: format.value },
                          });
                        }}
                      >
                        <Typography className={isValue(format.value) ? 'text-caribbean-green-500' : ''}>
                          {format.title}
                        </Typography>
                      </DropdownMenuItem>
                    ))}
                  </div>
                }
              />
              <DialogWrapper
                name="logout-confirm"
                trigger={
                  <HoverCardItem>
                    <Typography className="text-red-400 text-sm">Выйти из аккаунта</Typography>
                  </HoverCardItem>
                }
              >
                <LogoutConfirmation />
              </DialogWrapper>
            </div>
          } />
      ) : (
        <>
          <NavigationBar />
          <Separator orientation="vertical" />
          <div className="flex items-center justify-center w-fit">
            <DropdownWrapper
              properties={{ sideAlign: 'top', contentAlign: 'start' }}
              trigger={
                <div className="flex items-center justify-center">
                  <GripVertical size={18} className="text-neutral-400 cursor-pointer" />
                </div>
              }
              content={
                <div className="flex flex-col gap-y-4">
                  <Typography className="text-shark-300 text-sm px-2 pt-2">
                    Режим сайдбара
                  </Typography>
                  <div className="flex flex-col gap-y-2">
                    {SIDEBAR_FORMATS.map((format, i) => (
                      <DropdownMenuItem
                        key={i}
                        onClick={(e) => {
                          e.preventDefault();
                          updateSidebarPropertiesMutation.mutate({
                            type: 'format',
                            values: { format: format.value },
                          });
                        }}
                      >
                        <Typography className={isValue(format.value) ? 'text-caribbean-green-500' : ''}>
                          {format.title}
                        </Typography>
                      </DropdownMenuItem>
                    ))}
                  </div>
                </div>
              }
            />
          </div>
          <DialogWrapper
            name="logout-confirm"
            trigger={<LogOut size={18} className="text-neutral-400 cursor-pointer" />}
          >
            <LogoutConfirmation />
          </DialogWrapper>
        </>
      )}
    </div>
  );
};