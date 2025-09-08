import { AsyncCtx, reatomAsync, withStatusesAtom } from "@reatom/async";
import { atom, Atom, AtomMut, batch, Ctx } from "@reatom/core";
import { reatomComponent, useUpdate } from "@reatom/npm-react";
import { useInView } from "react-intersection-observer";

type UpdateType = 'update-filter' | 'update-cursor';

type Meta = {
  hasNextPage: boolean | undefined;
  hasPrevPage: boolean | undefined;
  startCursor: string | undefined;
  endCursor: string | undefined;
}

export type FetchResult<TItem, TMeta extends Meta = Meta> = {
  data: TItem[];
  meta: TMeta;
};

type CreateFabricOpts<
  TItem,
  TMeta extends Meta
> = {
  name: string;
  fn: (ctx: AsyncCtx) => Promise<FetchResult<TItem, TMeta>>;
  atoms: {
    dataAtom: AtomMut<TItem[] | null>;
    metaAtom: AtomMut<TMeta | null>;
    cursorAtom: AtomMut<string | undefined>;
  };
  viewerOpts?: {
    threshold?: number;
    isExistAtom?: Atom<boolean>;
  };
  key: keyof TItem;
  getKey?: (item: TItem) => string | number;
};

export function createFabric<
  TItem,
  TMeta extends Meta,
>(opts: CreateFabricOpts<TItem, TMeta>) {
  const {
    name,
    fn,
    atoms: { dataAtom, metaAtom, cursorAtom },
    viewerOpts,
    key,
    getKey,
  } = opts;

  const threshold = viewerOpts?.threshold ?? 1;

  function makeKeyFn(): (item: TItem) => string {
    if (typeof getKey === 'function') {
      return (item: TItem) => String(getKey(item));
    }
    if (key != null) {
      return (item: TItem) => String((item as any)[key]);
    }
    // fallback to id
    return (item: TItem) => String((item as any).id);
  }

  const keyFn = makeKeyFn();

  const isExistAtom =
    viewerOpts?.isExistAtom ??

    atom((ctx) => {
      const d = ctx.spy(dataAtom) as TItem[] | null;

      return !!(d && d.length > 0);
    }, `${name}ViewerIsExistAtom`);

  const isViewAtom = atom(false, `${name}IsView`);

  const update = reatomAsync(async (ctx: AsyncCtx, type: UpdateType) => {
    const result = await fn(ctx);

    return { type, result }
  }, {
    name: `${name}UpdateAction`,
    onFulfill: (ctx: Ctx, payload) => {
      const p = payload
      if (!p) return;

      const { type, result } = p;

      if (type === 'update-filter') {
        batch(ctx, () => {
          dataAtom(ctx, result.data);
          metaAtom(ctx, result.meta);
          cursorAtom(ctx, undefined);
        });

        return;
      }

      batch(ctx, () => {
        cursorAtom(ctx, result.meta?.endCursor);

        dataAtom(ctx, (state) => {
          if (!state) return null;

          const existingKeys = new Set(state.map((x) => keyFn(x as TItem)));
          const newData = result.data.filter((item) => !existingKeys.has(keyFn(item)));

          return [...state, ...newData];
        });

        metaAtom(ctx, result.meta);
      });
    },
    onReject: (_, e) => {
      if (e instanceof Error) console.error(e.message);
    },
  }).pipe(withStatusesAtom());

  isViewAtom.onChange((ctx: Ctx, state: boolean) => {
    if (!state) return;

    const hasMore = ctx.get(metaAtom)?.hasNextPage;

    if (hasMore) {
      update(ctx, 'update-cursor');
    }
  });

  const Viewer = reatomComponent(({ ctx }) => {
    const { inView, ref } = useInView({ triggerOnce: false, threshold });

    useUpdate((ctx) => isViewAtom(ctx, inView), [inView]);

    const exist = ctx.spy(isExistAtom);
    if (!exist) return null;

    return <div ref={ref} className="h-[1px] w-full" />;
  }, `${name}Viewer`);

  return {
    dataAtom,
    metaAtom,
    cursorAtom,
    isViewAtom,
    isExistAtom,
    update,
    Viewer,
  } as const;
}