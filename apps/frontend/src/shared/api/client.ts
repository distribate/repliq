import ky from "ky";
import { mainBaseUrl } from "./init";

export const client = ky.create({
  prefixUrl: mainBaseUrl,
  credentials: "include"
})