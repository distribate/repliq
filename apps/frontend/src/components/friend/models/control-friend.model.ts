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

const WARNING_MESSAGES: Record<string, string> = {
  "pin-limit": "Закреплять можно максимум 1 друга"
}

function logError(e: Error | unknown) {
  if (e instanceof Error) console.error(e.message)
}

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

export const setFriendNoteAction = reatomAsync(async (ctx, values: Omit<SetFriendNote, "note">) => {
  const note = ctx.get(noteValueAtom)

  const { friend_id, recipient } = values

  if (note.length < 1) {
    setFriendUnnoteAction(ctx, { friend_id, recipient })
    throw new Error()
  }

  const res = await friendClient.friend["create-note"].$post({
    json: { recipient, friend_id, message: note }
  })

  const data = await validateResponse<typeof res>(res)

  return { result: data, friend_id }
}, {
  name: "setFriendNoteAction",
  onReject: (_, e) => {
    if (e instanceof Error) {
      console.error(e.message)
    }
  },
  onFulfill: (ctx, { result, friend_id }) => {
    batch(ctx, () => {
      noteDialogIsOpenAtom(ctx, false)
      noteValueAtom.reset(ctx)
    })

    myFriendsDataAtom(ctx, (state) => {
      if (!state) state = []

      const newNote = result.data

      const index = state.findIndex(f => f.friend_id === friend_id)
      if (index === -1) return state;

      const newState = [...state]
      newState[index] = { ...state[index], note: newNote }

      return newState
    })
  },
}).pipe(withStatusesAtom())

export const setFriendUnnoteAction = reatomAsync(async (ctx, values: ControlFriendProperties) => {
  const { recipient, friend_id } = values;

  const res = await friendClient.friend["remove-note"].$delete({
    json: { recipient, friend_id }
  })

  const data = await validateResponse<typeof res>(res)

  return { result: data, friend_id }
}, {
  name: "setFriendUnnoteAction",
  onReject: (_, e) => {
    logError(e)
  },
  onFulfill: (ctx, { result, friend_id }) => {
    myFriendsDataAtom(ctx, (state) => {
      if (!state) state = []

      const index = state.findIndex(f => f.friend_id === friend_id)
      if (index === -1) return state;

      const newState = [...state]
      newState[index] = { ...state[index], note: null }

      return newState
    })
  },
}).pipe(withStatusesAtom())

export const setFriendPinAction = reatomAsync(async (ctx, values: ControlFriendProperties) => {
  const isValid = ctx.get(myFriendsPinnedDataAtom).length === 0

  if (!isValid) {
    throw new Error("pin-limit")
  }

  const { recipient, friend_id } = values

  const res = await friendClient.friend["pin"].$post({
    json: { recipient, friend_id, type: "pin" }
  })

  const data = await validateResponse<typeof res>(res)

  return { result: data, friend_id }
}, {
  name: "setFriendPinAction",
  onReject: (_, e) => {
    logError(e)

    if (e instanceof Error) {
      toast.warning(WARNING_MESSAGES[e.message])
    }
  },
  onFulfill: (ctx, { result, friend_id }) => {
    myFriendsDataAtom(ctx, (state) => {
      if (!state) state = [];

      const index = state.findIndex(f => f.friend_id === friend_id)
      if (index === -1) return state;

      const newState = [...state]
      newState[index] = { ...state[index], is_pinned: true }

      return newState
    })
  },
}).pipe(withStatusesAtom())

export const setFriendUnpinAction = reatomAsync(async (ctx, values: ControlFriendProperties) => {
  const { friend_id, recipient } = values;

  const res = await friendClient.friend["pin"].$post({
    json: { recipient, friend_id, type: "unpin" }
  })

  const data = await validateResponse<typeof res>(res);

  return { result: data, friend_id }
}, {
  name: "setFriendUnpinAction",
  onReject: (_, e) => {
    logError(e)
  },
  onFulfill: (ctx, { result, friend_id }) => {
    myFriendsDataAtom(ctx, (state) => {
      if (!state) state = []

      const index = state.findIndex(f => f.friend_id === friend_id)
      if (index === -1) return state;

      const newState = [...state]
      newState[index] = { ...state[index], is_pinned: false }

      return newState
    })
  },
}).pipe(withStatusesAtom())