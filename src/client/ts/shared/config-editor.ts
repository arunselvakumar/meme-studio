import { createRef } from 'react'
import { randomID } from '@shared/utils'
import TextBox from './models/TextBox'

export const fontsFamilyConfig = [
  'Arial',
  'Helvetica',
  'Impact',
  'Geneva',
  'Arial Black',
  'Times New Roman',
  'Courier New',
  'Lucida Console',
]

export const fontSizeConfig = { min: 1, max: 100 }
export const boxShadowConfig = { min: 0, max: 5 }

export const createText = (base: TextBox['base']): TextBox =>
  new TextBox({
    rotate: 0,
    ...base,
    fontSize: 22,
    fontFamily: 'Impact',
    textAlign: 'center',
    alignVertical: 'middle',
    boxShadow: 2,
    value: '',
    id: randomID(),
    color: '#ffffff',
    isUppercase: false,
    refs: {
      accordion: createRef(),
      textarea: createRef(),
    },
  })
