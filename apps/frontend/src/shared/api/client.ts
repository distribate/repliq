import ky from "ky";
import { forumBaseUrl } from "./init";

export const client = ky.create({
  prefixUrl: forumBaseUrl,
  credentials: "include"
})