import { withAssign, withComputed } from '@reatom/framework';
import { atom, Atom } from '@reatom/core';
import { AsyncAction } from '@reatom/async';

export type WithVariables<T extends AsyncAction, State = undefined> = T & {
  variables: Atom<State | Parameters<T>[1]>
}

export const withVariables = <T extends AsyncAction, State = undefined>(
  initState: State,
): ((anAction: T) => WithVariables<T, State>) =>
  withAssign((target, name) => ({
    variables: atom(initState, `${name}.variables`).pipe(
      withComputed((ctx, state = initState) => {
        ctx.spy(target).forEach(({ params }) => {
          state = params[0]
        })
        ctx.spy(target.onSettle).forEach(() => {
          state = initState
        })

        return state
      }),
    ),
  }))
