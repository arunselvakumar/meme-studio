import Meme from '@shared/models/Meme'
import { fetchApi } from '@utils/index'
import TextBox from '@shared/models/TextBox'

export const API_URL = process.env.NODE_ENV === 'production' ? 'http://localhost:3000' : 'http://localhost:3000'

interface ResultMemeIndex {
  success: boolean
  data: {
    memes: Array<object>
    pages: number
  }
}

export const getMemes = (page: number, params?: object): Promise<{ memes: Array<Meme>; pages: number }> =>
  fetchApi(`/memes`, {
    method: 'POST',
    body: JSON.stringify({ page }),
    ...params
  }).then((response: ResultMemeIndex) => ({
    memes: response.data.memes.map((meme: object) => new Meme(meme)),
    pages: response.data.pages
  }))

export interface ResultMemeShowInt {
  success: boolean
  data: {
    meme: object
    texts: Array<object>
  }
}

export const getMeme = (id: string): Promise<{ texts: Array<TextBox>; meme: Meme }> =>
  fetchApi(`/memes/${id}`, { method: 'POST' }).then((response: ResultMemeShowInt) => ({
    texts: response.data.texts.map((text: object) => new TextBox(text)),
    meme: new Meme(response.data.meme)
  }))
