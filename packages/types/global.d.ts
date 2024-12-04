import { BaseEditor, ParagraphElement, HistoryEditor } from "slate";
import { ReactEditor } from "slate-react";

declare module "bcryptjs";
declare module "tailwindcss/colors";

declare module "slate" {
  export interface CustomTypes {
    Editor: CustomEditor;
    Element: CustomElement;
    Text: CustomText;
  }

  export interface BaseElement {
    type: string;
  }
}

export type PageConventionProps = {
  params: {
    id: string;
    nickname: string;
  };
  searchParams: {
    [key: string]: string | string[] | undefined;
  };
};

export type MetadataType = {
  params: {
    id?: string;
    title?: string;
    nickname?: string;
  };
  searchParams: {
    [key: string]: string | string[] | undefined;
  };
};

export type UserPageParam = {
  nickname: string;
  uuid?: string;
};

export type CustomEditor = BaseEditor & ReactEditor & HistoryEditor;
export type CustomElement = ParagraphElement;

type CustomText = {
  text: string;
  bold?: boolean;
  underline?: boolean;
  italic?: boolean;
  strike?: boolean;
};

export type OperationType =
  | "insert_node"
  | "merge_node"
  | "move_node"
  | "remove_node"
  | "set_node"
  | "split_node"
  | "set_selection"
  | "insert_text"
  | "remove_text";
