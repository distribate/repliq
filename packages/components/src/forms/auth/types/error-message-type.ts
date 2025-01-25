export type AuthMessages =
  | "Unsafe password"
  | "Nickname invalid"
  | "Success"
  | null;

export interface ErrorMessageMap {
  notFound: string;
  incorrectPassword: string;
  something: string;
  created: string;
  alreadyOriginal: string;
  alreadyForum: string;
}