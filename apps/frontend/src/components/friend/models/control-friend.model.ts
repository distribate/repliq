import { myFriendsDataAtom, myFriendsPinnedDataAtom } from "#components/friends/models/friends.model";
import { friendClient } from "#shared/api/forum-client";
import { reatomAsync, withStatusesAtom } from "@reatom/async";
import { atom, batch } from "@reatom/core";
import { toast } from "sonner";
import { withReset } from "@reatom/framework";
import { validateResponse } from "#shared/api/validation";

export type ControlFriendRequests = {
  recipient: string;
  request_id: string
}

export type ControlFriendProperties = {
  recipient: string;
  friend_id: string
}

type SetFriendNote = ControlFriendProperties & {
  note: string;
};

type NoteOptions = {
  nickname: string;
  friend_id: string;
};

export const NOTE_MAX_LENGTH = 64

export const noteValueAtom = atom<string>("", "noteValue").pipe(withReset())
export const noteDialogIsOpenAtom = atom(false, "noteDialogIsOpen")
export const noteDialogOptionsAtom = atom<NoteOptions | null>(null, "noteDialogOptions").pipe(withReset())

noteDialogIsOpenAtom.onChange((ctx, state) => {
  if (!state) {
    noteValueAtom.reset(ctx)
    noteDialogOptionsAtom.reset(ctx)
    return;
  }

  const friendsData = ctx.get(myFriendsDataAtom)
  const target = ctx.get(noteDialogOptionsAtom)?.nickname

  if (!target || !friendsData) return;

  const newValue = friendsData.find(friend => friend.nickname === target)?.note ?? "";

  noteValueAtom(ctx, newValue)
})

const noteVariablesAtom = atom<Omit<SetFriendNote, "note">>({ friend_id: "", recipient: "" }, "noteVariables").pipe(withReset());

export const setFriendNoteAction = reatomAsync(async (ctx, values: Omit<SetFriendNote, "note">) => {
  const note = ctx.get(noteValueAtom)

  const { friend_id, recipient } = values

  if (note.length < 1) {
    setFriendUnnoteAction(ctx, { friend_id, recipient })
    return;
  }

  noteVariablesAtom(ctx, values);

  return await ctx.schedule(async () => {
    const res = await friendClient.friend["create-note"].$post({
      json: { recipient, friend_id, message: note }
    })

    return validateResponse<typeof res>(res)
  })
}, {
  name: "setFriendNoteAction",
  onReject: (_, e) => {
    if (e instanceof Error) {
      console.error(e.message)
    }
  },
  onFulfill: (ctx, result) => {
    if (!result) return;

    const { friend_id } = ctx.get(noteVariablesAtom)

    batch(ctx, () => {
      noteDialogIsOpenAtom(ctx, false)
      noteValueAtom.reset(ctx)

      myFriendsDataAtom(ctx, (state) => {
        if (!state) state = []

        const newNote = result.data

        const index = state.findIndex(f => f.friend_id === friend_id)
        if (index === -1) return state;

        const newState = [...state]
        newState[index] = { ...state[index], note: newNote }

        return newState
      })
    })
  },
  onSettle: (ctx) => noteVariablesAtom.reset(ctx)
}).pipe(withStatusesAtom())

const unnoteVariablesAtom = atom<ControlFriendProperties>({ friend_id: "", recipient: "" }, "unnoteVariables").pipe(withReset());

export const setFriendUnnoteAction = reatomAsync(async (ctx, values: ControlFriendProperties) => {
  const { recipient, friend_id } = values;

  unnoteVariablesAtom(ctx, values);

  return await ctx.schedule(async () => {
    const res = await friendClient.friend["remove-note"].$delete({
      json: { recipient, friend_id }
    })

    return validateResponse<typeof res>(res)
  })
}, {
  name: "setFriendUnnoteAction",
  onReject: (_, e) => {
    if (e instanceof Error) {
      console.error(e.message)
    }
  },
  onFulfill: (ctx, result) => {
    const { friend_id } = ctx.get(unnoteVariablesAtom)

    if (result.data) {
      myFriendsDataAtom(ctx, (state) => {
        if (!state) state = []

        const index = state.findIndex(f => f.friend_id === friend_id)
        if (index === -1) return state;

        const newState = [...state]
        newState[index] = { ...state[index], note: null }

        return newState
      })
    } else {
      toast.error("Warning")
    }
  },
  onSettle: (ctx) => unnoteVariablesAtom.reset(ctx)
}).pipe(withStatusesAtom())

const pinVariablesAtom = atom<ControlFriendProperties>({ friend_id: "", recipient: "" }, "pinVariables").pipe(withReset());

export const setFriendPinAction = reatomAsync(async (ctx, values: ControlFriendProperties) => {
  if (ctx.get(myFriendsPinnedDataAtom).length === 1) {
    throw new Error("pin-limit")
  }

  const { recipient, friend_id } = values

  pinVariablesAtom(ctx, values);

  return await ctx.schedule(async () => {
    const res = await friendClient.friend["pin"].$post({
      json: { recipient, friend_id, type: "pin" }
    })

    return validateResponse<typeof res>(res)
  })
}, {
  name: "setFriendPinAction",
  onReject: (_, e) => {
    if (e instanceof Error) {
      if (e.message === 'pin-limit') {
        return toast.warning("Закреплять можно максимум 1 друга")
      }
    }
  },
  onFulfill: (ctx, result) => {
    const { friend_id } = ctx.get(pinVariablesAtom);

    if (result.data) {
      myFriendsDataAtom(ctx, (state) => {
        if (!state) state = [];

        const index = state.findIndex(f => f.friend_id === friend_id)
        if (index === -1) return state;

        const newState = [...state]
        newState[index] = { ...state[index], is_pinned: true }

        return newState
      })
    } else {
      toast.error("Warning")
    }
  },
  onSettle: (ctx) => pinVariablesAtom.reset(ctx)
}).pipe(withStatusesAtom())

const unpinVariablesAtom = atom<ControlFriendProperties>({ friend_id: "", recipient: "" }, "unpinVariables").pipe(withReset());

export const setFriendUnpinAction = reatomAsync(async (ctx, values: ControlFriendProperties) => {
  const { friend_id, recipient } = values;

  unpinVariablesAtom(ctx, values);

  return await ctx.schedule(async () => {
    const res = await friendClient.friend["pin"].$post({
      json: { recipient, friend_id, type: "unpin" }
    })

    return validateResponse<typeof res>(res)
  })
}, {
  name: "setFriendUnpinAction",
  onReject: (_, e) => {
    if (e instanceof Error) {
      console.error(e.message)
    }
  },
  onFulfill: (ctx, result) => {
    const { friend_id } = ctx.get(unpinVariablesAtom);

    if (result.data) {
      myFriendsDataAtom(ctx, (state) => {
        if (!state) state = []

        const index = state.findIndex(f => f.friend_id === friend_id)
        if (index === -1) return state;

        const newState = [...state]
        newState[index] = { ...state[index], is_pinned: false }

        return newState
      })
    } else {
      toast.error("Warning")
    }
  },
  onSettle: (ctx) => unpinVariablesAtom.reset(ctx)
}).pipe(withStatusesAtom())