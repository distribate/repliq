import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@repo/ui/src/components/resizable.tsx";
import { lazy, ReactNode, Suspense, useRef } from "react";
import { ImperativePanelHandle } from "react-resizable-panels";
import { useMediaQuery } from "@repo/lib/hooks/use-media-query.ts";
import { SidebarDesktop } from "../sidebar/desktop/components/sidebar/sidebar-desktop.tsx";
import { useSidebarControl } from "../sidebar/desktop/components/sidebar-layout/hooks/use-sidebar-control.ts";
import { Skeleton } from "@repo/ui/src/components/skeleton.tsx";
import { Separator } from "@repo/ui/src/components/separator.tsx";
import { RESIZABLE_COOKIE_KEY } from "@repo/shared/keys/cookie.ts";
import { getCookieByKey } from "@repo/lib/helpers/get-cookie-by-key.ts";

const SidebarMobile = lazy(() => import("#sidebar/mobile/components/sidebar-mobile.tsx")
  .then(m => ({ default: m.SidebarMobile }))
);

interface ResizableLayout {
  children: ReactNode;
}

type PanelsProps = {
  defaultSize: number;
};

export const DEFAULT_LAYOUT_SIZES = [16, 84];

const SidebarDesktopSkeleton = () => {
  return (
    <div
      className={`flex flex-col justify-between
		  px-3 rounded-lg overflow-hidden min-h-screen h-full py-6
			bg-primary-color outline-none w-[300px]`}
    >
      <div className="flex flex-col gap-y-4 items-center justify-center">
        <div className="flex flex-row items-center gap-4">
          <Skeleton className="w-[42px] h-[42px]" />
          <Skeleton className="h-10 w-48" />
        </div>
        <Separator />
        <div className="flex items-center gap-2 justify-between w-full">
          <Skeleton className="flex h-10 items-center gap-1 grow" />
          <Skeleton className="flex h-10 w-10" />
        </div>
        <Separator />
        <Skeleton className="flex gap-x-3 h-[50px] items-center w-full" />
        <Separator />
        <Skeleton className="flex h-10 items-center w-full" />
        <Separator />
        <Skeleton className="flex h-[230px] items-center w-full" />
        <Separator />
        <div className="flex flex-col gap-y-2 w-full">
          <Skeleton className="flex h-10 items-center w-full" />
          <Skeleton className="flex h-10 items-center w-full" />
          <Skeleton className="flex h-10 items-center w-full" />
          <Skeleton className="flex h-10 items-center w-full" />
        </div>
      </div>
    </div>
  );
};

export const SidebarMain = ({ defaultSize }: PanelsProps) => {
  const { isDynamic, updateSidebarPropertiesMutation } = useSidebarControl();
  const sidebarRef = useRef<ImperativePanelHandle>(null);

  const handleSizePanel = (size: number) => {
    const sidebarPanel = sidebarRef.current;

    if (sidebarPanel && size < 11) {
      sidebarPanel.collapse();
    }

    return updateSidebarPropertiesMutation.mutate({
      type: "width",
      values: { width: size },
    });
  };

  return isDynamic ? (
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
    <Suspense fallback={<SidebarDesktopSkeleton />}>
      <div className="overflow-hidden max-h-screen">
        <SidebarDesktop />
      </div>
    </Suspense>
  );
};

export const AreaMain = ({
  children,
  defaultSize,
}: PanelsProps & { children: ReactNode }) => {
  return (
    <ResizablePanel
      id="main"
      defaultSize={defaultSize}
      order={2}
      minSize={84}
      maxSize={96}
      className="flex flex-col gap-y-2 !pb-4 !overflow-visible !min-h-screen h-full !max-h-screen"
    >
      <div className="flex flex-col gap-y-4 h-full w-full main-section overflow-x-hidden overflow-y-scroll">
        {children}
      </div>
    </ResizablePanel>
  );
};

export const ResizableLayout = ({
  children,
}: ResizableLayout) => {
  const layout = getCookieByKey(RESIZABLE_COOKIE_KEY);
  const matches = useMediaQuery("(min-width: 768px)");
  const { isDynamic } = useSidebarControl();
  const layoutGroupGap = isDynamic ? 1 : 2;

  let defaultLayout: number[] = [16, 84];

  if (layout) {
    defaultLayout = JSON.parse(layout)
  }
  
  const onLayout = (sizes: number[]) => {
    document.cookie = `${RESIZABLE_COOKIE_KEY}=${JSON.stringify(sizes)}`;
  };

  return (
    matches ? (
      <ResizablePanelGroup
        onLayout={onLayout}
        direction="horizontal"
        autoSaveId="conditional"
        suppressHydrationWarning
        style={{ overflow: "clip" }}
        className={`flex w-full relative min-h-screen h-screen max-h-screen p-2
            gap-${layoutGroupGap} overflow-hidden`}
      >
        <SidebarMain defaultSize={defaultLayout[0]} />
        <AreaMain defaultSize={defaultLayout[1]}>
          {children}
        </AreaMain>
      </ResizablePanelGroup>
    ) : (
      <div className="flex flex-col gap-2 min-h-screen h-full relative w-full">
        <SidebarMobile />
        <div className="flex overflow-y-auto h-full w-full p-2">
          {children}
        </div>
      </div>
    )
  );
};