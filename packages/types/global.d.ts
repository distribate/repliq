import { BaseEditor, BaseElement, Editor, Element, Node } from 'slate'
import { ReactEditor } from 'slate-react'

declare module "png"
declare module "jpeg"
declare module "jpg"
declare module "webp"

export type CustomEditor = BaseEditor & ReactEditor & HistoryEditor

declare module "bcryptjs"

export type CustomElement = ParagraphElement

type CustomText = FormattedText;

export type FormattedText = {
  text: string;
  bold?: true,
  italic?: true
}

declare module 'slate' {
  export interface CustomTypes {
    Editor: CustomEditor
    Element: CustomElement
    Text: CustomText,
  }
  
  export interface BaseElement {
    type: string;
  }
}