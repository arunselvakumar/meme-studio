import * as React from 'react'
import { useState, useEffect, useContext } from 'react'
import { FatalError } from '@client/components/ErrorBoundary/ErrorBoundary'
import Export from '../components/Modal/Export/Export'
import { DefaultInt, DefaultContext } from '@client/store/DefaultContext'
import { EditorInt, EditorContext, EditorDispatch } from '@client/store/EditorContext'
import Router from '../routes'

function Main(): JSX.Element {
  const [{ fetchNextMemes, numPage }]: [DefaultInt] = useContext(DefaultContext)
  const [{ isExportModalActive }]: [EditorInt, EditorDispatch] = useContext(EditorContext)
  const [isError, setIsError] = useState<boolean>(false)

  useEffect(() => {
    if (numPage === 0) {
      const firstFetch = async (): Promise<void> => {
        try {
          await fetchNextMemes()
        } catch (error) {
          if (error.name !== 'AbortError') console.warn(error)
          setIsError(true)
        }
      }
      firstFetch()
    }
  }, [numPage, fetchNextMemes, setIsError])

  return (
    <main className="main-wrapper">
      {isError ? <FatalError /> : <Router />}
      {isExportModalActive && <Export />}
    </main>
  )
}

export default Main
