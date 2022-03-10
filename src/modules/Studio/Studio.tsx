import React from 'react'
import { useQuery } from 'react-query'
import { useRouter } from 'next/router'
import Header from '@components/Header/Header'
import { getMeme } from '@shared/api/memes'
import { useResizeObserverCallback } from '@shared/hooks/useResizeObserver'
import { EditorProvider } from '@stores/Editor/editor.store'

import Aside from './components/Aside/Aside'
import Canvas from './components/Canvas/Canvas'
import MemeContainer from './components/MemeContainer/MemeContainer'
import Tools from './components/Tools/Tools'
import Styled from './studio.styled'

const CreatePage = () => {
  const containerRef = React.useRef<HTMLDivElement>(null)

  const router = useRouter()
  const { data: meme } = useQuery(
    ['memes', router.query.memeId],
    () => {
      return getMeme(router.query.memeId as Meme['id'])
    },
    {
      enabled: Boolean(router.query.memeId)
    }
  )

  return (
    <Styled.Page title={meme?.translations.en.name}>
      <EditorProvider key={meme?.id} meme={meme || null}>
        <Header />
        <Styled.Studio>
          <Tools />
          <Styled.DefaultContainer ref={containerRef}>
            <MemeContainer>
              <Canvas />
            </MemeContainer>
          </Styled.DefaultContainer>
          <Aside />
        </Styled.Studio>
      </EditorProvider>
    </Styled.Page>
  )
}

export default CreatePage
