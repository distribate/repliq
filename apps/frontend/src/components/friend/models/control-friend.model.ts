import { myFriendsDataAtom, myFriendsPinnedDataAtom } from "#components/friends/models/friends.model";
import { userClient } from "#shared/forum-client";
import { reatomAsync, withStatusesAtom } from "@reatom/async";
import { atom, batch } from "@reatom/core";
import { toast } from "sonner";
import { withReset } from "@reatom/framework";

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

const setFriendNoteActionVariablesAtom = atom<SetFriendNote | null>(null, "setFriendNoteActionVariables")

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

export const setFriendNoteAction = reatomAsync(async (ctx, { friend_id, recipient }: Omit<SetFriendNote, "note">) => {
  const note = ctx.get(noteValueAtom)

  if (note.length < 1) {
    setFriendUnnoteAction(ctx, { friend_id, recipient })
    return;
  }

  setFriendNoteActionVariablesAtom(ctx, { friend_id, note, recipient })

  return await ctx.schedule(async () => {
    const res = await userClient.user["create-friend-note"].$post({
      json: { recipient, friend_id, message: note }
    })

    const data = await res.json();

    if ("error" in data) throw new Error(data.error)

    return { status: data.status, note: data.data }
  })
}, {
  name: "setFriendNoteAction",
  onReject: (_, e) => {
    if (e instanceof Error) {
      console.error(e.message)
    }
  },
  onFulfill: (ctx, res) => {
    if (!res) return;

    const variables = ctx.get(setFriendNoteActionVariablesAtom)
    if (!variables) return;

    batch(ctx, () => {
      noteDialogIsOpenAtom(ctx, false)
      noteValueAtom.reset(ctx)

      myFriendsDataAtom(ctx, (state) => {
        if (!state) state = []

        return state.map(
          friend => friend.friend_id === variables.friend_id ? { ...friend, note: res.note } : friend
        )
      })
    })
  }
}).pipe(withStatusesAtom())

const setFriendUnnoteActionVariablesAtom = atom<ControlFriendProperties | null>(null, "setFriendUnnoteActionVariables")

export const setFriendUnnoteAction = reatomAsync(async (ctx, { friend_id, recipient }: ControlFriendProperties) => {
  setFriendUnnoteActionVariablesAtom(ctx, { friend_id, recipient })
  return await ctx.schedule(async () => {
    const res = await userClient.user["delete-friend-note"].$delete({
      json: { recipient, friend_id }
    })

    const data = await res.json();

    if ("error" in data) throw new Error(data.error)

    return data.status
  })
}, {
  name: "setFriendUnnoteAction",
  onReject: (_, e) => {
    if (e instanceof Error) {
      console.error(e.message)
    }
  },
  onFulfill: (ctx, res) => {
    const variables = ctx.get(setFriendUnnoteActionVariablesAtom)
    if (!variables) return;

    myFriendsDataAtom(ctx, (state) => {
      if (!state) state = []
      return state.map(friend =>
        friend.friend_id === variables.friend_id ? { ...friend, note: null } : friend
      )
    })
  }
}).pipe(withStatusesAtom())

const setFriendPinActionVariablesAtom = atom<ControlFriendProperties | null>(null, "setFriendPinActionVariables")

export const setFriendPinAction = reatomAsync(async (ctx, { recipient, friend_id }: ControlFriendProperties) => {
  if (ctx.get(myFriendsPinnedDataAtom).length === 1) {
    throw new Error("pin-limit")
  }

  setFriendPinActionVariablesAtom(ctx, { recipient, friend_id });
  
  return await ctx.schedule(async () => {
    const res = await userClient.user["create-friend-pin"].$post({
      json: { recipient, friend_id, type: "pin" }
    })

    const data = await res.json();

    if ("error" in data) throw new Error(data.error)

    return data.status
  })
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
    const variables = ctx.get(setFriendPinActionVariablesAtom)
    if (!variables) return;

    myFriendsDataAtom(ctx, (state) => {
      if (!state) state = [];

      return state.map(friend =>
        friend.friend_id === variables.friend_id ? { ...friend, is_pinned: true } : friend
      )
    })
  }
}).pipe(withStatusesAtom())

const setFriendUnpinActionVariablesAtom = atom<ControlFriendProperties | null>(null, "setFriendUnpinActionVariables")

export const setFriendUnpinAction = reatomAsync(async (ctx, { friend_id, recipient }: ControlFriendProperties) => {
  setFriendUnpinActionVariablesAtom(ctx, { friend_id, recipient })
  return await ctx.schedule(async () => {
    const res = await userClient.user["create-friend-pin"].$post({
      json: { recipient, friend_id, type: "unpin" }
    })

    const data = await res.json();

    if ("error" in data) throw new Error(data.error)

    return data.status
  })
}, {
  name: "setFriendUnpinAction",
  onReject: (_, e) => {
    if (e instanceof Error) {
      console.error(e.message)
    }
  },
  onFulfill: (ctx, res) => {
    const variables = ctx.get(setFriendUnpinActionVariablesAtom)
    if (!variables) return;

    myFriendsDataAtom(ctx, (state) => {
      if (!state) state = []

      return state.map(friend =>
        friend.friend_id === variables.friend_id ? { ...friend, is_pinned: false } : friend
      )
    })
  }
}).pipe(withStatusesAtom())