import { useUpdate } from "@reatom/npm-react";
import { useMatches } from "@tanstack/react-router";
import { PropsWithChildren } from "react";

export const DEFAULT_TITLE = 'Fasberry';

const SyncMeta = () => {
  const matches = useMatches();
  const meta = matches.at(-1)?.meta?.find((meta) => meta?.title);

  useUpdate(() => {
    document.title = [meta?.title, DEFAULT_TITLE].filter(Boolean).join(' - ')
  }, [meta])

  return null;
}

export function Meta({ children }: PropsWithChildren) {
  return (
    <>
      <SyncMeta />
      {children}
    </>
  );
}