"use client"

import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@repo/ui/src/components/resizable.tsx";
import { ReactNode, useCallback, useEffect, useRef, useState } from 'react';
import { useSidebarControl } from "../sidebar/components/sidebar-layout/hooks/use-sidebar-control.ts";
import { RESIZABLE_LAYOUT_COOKIE_KEY } from "@repo/shared/keys/cookie.ts";
import { Sidebar } from "../sidebar/components/sidebar/sidebar.tsx";
import { ImperativePanelHandle } from "react-resizable-panels";
import { SidebarSkeleton } from "../sidebar/components/sidebar/sidebar-skeleton.tsx";
import { NavigationPanel } from '../navigation/components/navigation-panel.tsx';

interface ResizableLayout {
	defaultLayout: number[] | undefined,
	children: ReactNode
}

export const DEFAULT_LAYOUT_SIZES = [ 16, 84 ];

export const ResizableLayout = ({
	defaultLayout = DEFAULT_LAYOUT_SIZES, children
}: ResizableLayout) => {
	const { isDynamic, updateSidebarPropertiesMutation } = useSidebarControl();
	
	const onLayout = (sizes: number[]) => {
		document.cookie = `${RESIZABLE_LAYOUT_COOKIE_KEY}=${JSON.stringify(sizes)}`;
	};
	
	const sidebarRef = useRef<ImperativePanelHandle>(null);
	const [ isClient, setIsClient ] = useState(false)
	
	useEffect(() => setIsClient(true), [])
	
	const handleSizePanel = useCallback((size: number) => {
		const sidebarPanel = sidebarRef.current;
		
		if (sidebarPanel && size < 11) {
			sidebarPanel.collapse();
		}
		
		updateSidebarPropertiesMutation.mutate({
			type: "width", values: { width: size }
		})
	}, [])
	
	const layoutGroupGap = isDynamic ? 2 : 4;
	
	return (
		<ResizablePanelGroup
			direction="horizontal"
			autoSaveId="conditional"
			onLayout={onLayout}
			className={`flex flex-row w-full min-h-screen p-2 h-full max-h-screen gap-${layoutGroupGap} overflow-hidden`}
		>
			{!isClient && <SidebarSkeleton/>}
			{(isDynamic && isClient) && (
				<>
					<ResizablePanel
						id="sidebar"
						ref={sidebarRef}
						defaultSize={defaultLayout[0]}
						className="p-0 m-0"
						order={1}
						collapsible
						minSize={4}
						maxSize={16}
						onResize={(size: number) => handleSizePanel(size)}
					>
						<Sidebar/>
					</ResizablePanel>
					<ResizableHandle/>
				</>
			)}
			{(!isDynamic && isClient) && (
				<div className="overflow-hidden max-h-screen">
					<Sidebar/>
				</div>
			)}
			<ResizablePanel
				id="main"
				defaultSize={defaultLayout[1]}
				order={2}
				minSize={84}
				maxSize={96}
				className="flex flex-col gap-y-4 pb-4 !overflow-y-scroll min-h-screen max-h-screen"
			>
				<NavigationPanel/>
				{children}
			</ResizablePanel>
		</ResizablePanelGroup>
	)
}