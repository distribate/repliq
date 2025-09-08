import { myFriendsDataAtom, myFriendsPinnedDataAtom } from "#components/friends/models/friends.model";
import { friendClient } from "#shared/forum-client";
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

export const setFriendNoteAction = reatomAsync(async (ctx, values: Omit<SetFriendNote, "note">) => {
  const note = ctx.get(noteValueAtom)
  
  const { friend_id, recipient } = values

  if (note.length < 1) {
    setFriendUnnoteAction(ctx, { friend_id, recipient })
    return;
  }

  const result =  await ctx.schedule(async () => {
    const res = await friendClient.friend["create-note"].$post({
      json: { recipient, friend_id, message: note }
    })

    return validateResponse<typeof res>(res)
  })

  return { result, values }
}, {
  name: "setFriendNoteAction",
  onReject: (_, e) => {
    if (e instanceof Error) {
      console.error(e.message)
    }
  },
  onFulfill: (ctx, res) => {
    if (!res) return;

    const { result, values: { friend_id } } = res;

    batch(ctx, () => {
      noteDialogIsOpenAtom(ctx, false)
      noteValueAtom.reset(ctx)

      myFriendsDataAtom(ctx, (state) => {
        if (!state) state = []

        const newNote = result.data

        return state.map(
          friend => friend.friend_id === friend_id ? { ...friend, note: newNote } : friend
        )
      })
    })
  }
}).pipe(withStatusesAtom())

export const setFriendUnnoteAction = reatomAsync(async (ctx, values: ControlFriendProperties) => {
  const { recipient, friend_id } = values;

  const result = await ctx.schedule(async () => {
    const res = await friendClient.friend["remove-note"].$delete({
      json: { recipient, friend_id }
    })

    return validateResponse<typeof res>(res)
  })

  return { result, values }
}, {
  name: "setFriendUnnoteAction",
  onReject: (_, e) => {
    if (e instanceof Error) {
      console.error(e.message)
    }
  },
  onFulfill: (ctx, res) => {
    const { result, values: { friend_id } } = res

    if (result.data) {
      myFriendsDataAtom(ctx, (state) => {
        if (!state) state = []
  
        return state.map(friend =>
          friend.friend_id === friend_id ? { ...friend, note: null } : friend
        )
      })
    } else {
      toast.error("Warning")
    }
  }
}).pipe(withStatusesAtom())

export const setFriendPinAction = reatomAsync(async (ctx, values: ControlFriendProperties) => {
  if (ctx.get(myFriendsPinnedDataAtom).length === 1) {
    throw new Error("pin-limit")
  }

  const { recipient, friend_id } = values

  const result = await ctx.schedule(async () => {
    const res = await friendClient.friend["pin"].$post({
      json: { recipient, friend_id, type: "pin" }
    })

    return validateResponse<typeof res>(res)
  })

  return { result, values }
}, {
  name: "setFriendPinAction",
  onReject: (_, e) => {
    if (e instanceof Error) {
      if (e.message === 'pin-limit') {
        return toast.warning("Закреплять можно максимум 1 друга")
      }

      console.error(e.message)
    }
  },
  onFulfill: (ctx, res) => {
    const { result, values: { friend_id } } = res;

    if (result) {
      myFriendsDataAtom(ctx, (state) => {
        if (!state) state = [];

        return state.map(friend =>
          friend.friend_id === friend_id ? { ...friend, is_pinned: true } : friend
        )
      })
    } else {
      toast.error("Warning")
    }
  }
}).pipe(withStatusesAtom())

export const setFriendUnpinAction = reatomAsync(async (ctx, values: ControlFriendProperties) => {
  const { friend_id, recipient } = values;

  const result = await ctx.schedule(async () => {
    const res = await friendClient.friend["pin"].$post({
      json: { recipient, friend_id, type: "unpin" }
    })

    return validateResponse<typeof res>(res)
  })

  return { result, values }
}, {
  name: "setFriendUnpinAction",
  onReject: (_, e) => {
    if (e instanceof Error) {
      console.error(e.message)
    }
  },
  onFulfill: (ctx, res) => {
    const { result, values: { friend_id } } = res;

    if (result.data) {
      myFriendsDataAtom(ctx, (state) => {
        if (!state) state = []

        return state.map(friend =>
          friend.friend_id === friend_id ? { ...friend, is_pinned: false } : friend
        )
      })
    } else {
      toast.error("Warning")
    }
  }
}).pipe(withStatusesAtom())