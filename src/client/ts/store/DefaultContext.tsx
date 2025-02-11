import * as React from 'react'
import { createContext, useReducer, createRef, RefObject, useLayoutEffect } from 'react'
import { DefaultReducer, Actions } from './reducer/default'

export interface DefaultState {
  modalRef: RefObject<HTMLDivElement>
  theme: 'dark' | 'light'
}

const initialState: DefaultState = {
  modalRef: createRef(),
  theme: document.documentElement.getAttribute('data-theme') as 'dark' | 'light'
}

export type DefaultDispatch = React.Dispatch<Actions>

export const DefaultContext = createContext<DefaultState | any>(initialState)

export function DefaultProvider({ children }: { children: React.ReactNode }): JSX.Element {
  const [state, updater] = useReducer(DefaultReducer, initialState)

  useLayoutEffect(() => {
    document.documentElement.setAttribute('data-theme', state.theme)
    localStorage.setItem('theme', state.theme)
  }, [state.theme])

  return (
    <>
      <div ref={state.modalRef} id="modal" />
      <DefaultContext.Provider value={[state, updater]}>{children}</DefaultContext.Provider>
    </>
  )
}
