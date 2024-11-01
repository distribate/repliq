'use client';

import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@repo/ui/src/components/resizable.tsx';
import { ReactNode, useEffect, useRef, useState } from 'react';
import { RESIZABLE_LAYOUT_COOKIE_KEY } from '@repo/shared/keys/cookie.ts';
import { ImperativePanelHandle } from 'react-resizable-panels';
import { useMediaQuery } from '@repo/lib/hooks/use-media-query.ts';
import dynamic from 'next/dynamic';
import { SidebarDesktopSkeleton } from '../sidebar/desktop/components/sidebar/sidebar-desktop-skeleton.tsx';
import { SidebarDesktop } from '../sidebar/desktop/components/sidebar/sidebar-desktop.tsx';
import { useSidebarControl } from '../sidebar/desktop/components/sidebar-layout/hooks/use-sidebar-control.ts';

interface ResizableLayout {
  defaultLayout: number[] | undefined,
  children: ReactNode
}

const SidebarMobile = dynamic(() =>
  import("../sidebar/mobile/components/sidebar-mobile.tsx")
  .then(m => m.SidebarMobile)
)

export const DEFAULT_LAYOUT_SIZES = [ 16, 84 ];

type PanelsProps = {
  defaultSize: number
}

export const SidebarMain = ({
  defaultSize,
}: PanelsProps) => {
  const { isDynamic, updateSidebarPropertiesMutation } = useSidebarControl();
  const sidebarRef = useRef<ImperativePanelHandle>(null);
  const [ isClient, setIsClient ] = useState(false);
  
  const handleSizePanel = (size: number) => {
    const sidebarPanel = sidebarRef.current;
    
    if (sidebarPanel && size < 11) {
      sidebarPanel.collapse();
    }
    
    updateSidebarPropertiesMutation.mutate({
      type: 'width', values: { width: size },
    });
  }
  
  useEffect(() => {
    setIsClient(true);
  }, []);
  
  if (!isClient) return <SidebarDesktopSkeleton />;
  
  return (
    isDynamic ? (
      <>
        <ResizablePanel
          id="sidebar"
          ref={sidebarRef}
          defaultSize={defaultSize}
          className="p-0 m-0 max-w-[340px] overflow-hidden"
          order={1}
          collapsible
          minSize={4}
          maxSize={16}
          onResize={(size: number) => handleSizePanel(size)}
        >
          <SidebarDesktop />
        </ResizablePanel>
        <ResizableHandle />
      </>
    ) : (
      <div className="overflow-hidden max-h-screen">
        <SidebarDesktop />
      </div>
    )
  );
};

export const AreaMain = ({
  children, defaultSize,
}: PanelsProps & { children: ReactNode }) => {
  return (
    <ResizablePanel
      id="main"
      defaultSize={defaultSize}
      order={2}
      minSize={84}
      maxSize={96}
      className="flex flex-col gap-y-2 !pb-4 !overflow-visible !min-h-screen !max-h-screen"
    >
      <div className="flex flex-col gap-y-4 h-full w-full main-section overflow-x-hidden overflow-y-scroll">
        {children}
      </div>
    </ResizablePanel>
  );
};

export const ResizableLayout = ({
  defaultLayout = DEFAULT_LAYOUT_SIZES, children,
}: ResizableLayout) => {
  const matches = useMediaQuery('(min-width: 768px)')
  const { isDynamic } = useSidebarControl();
  const [ isClient, setIsClient ] = useState(false);
  const layoutGroupGap = isDynamic ? 1 : 2;
  
  useEffect(() => {setIsClient(true)}, []);
  
  const onLayout = (sizes: number[]) => {
    document.cookie = `${RESIZABLE_LAYOUT_COOKIE_KEY}=${JSON.stringify(sizes)}`;
  };
  
  if (!isClient) return null;
  
  return (
    <>
      {matches ? (
        <ResizablePanelGroup
          direction="horizontal"
          autoSaveId="conditional"
          suppressHydrationWarning
          onLayout={onLayout}
          style={{ overflow: 'clip' }}
          className={`flex w-full min-h-screen h-screen max-h-screen p-2
            gap-${layoutGroupGap} overflow-hidden`}
        >
          <SidebarMain defaultSize={defaultLayout[0]} />
          <AreaMain defaultSize={defaultLayout[1]}>
            {children}
          </AreaMain>
        </ResizablePanelGroup>
      ) : (
        <div className="flex flex-col gap-2 h-screen relative overflow-hidden w-full">
          <div className="flex overflow-y-auto h-full w-full p-2">
            {children}
          </div>
          <SidebarMobile/>
        </div>
      )}
    </>
  );
};