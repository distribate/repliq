import ky from "ky";
import { MAIN_BASE_URL } from "#shared/env";

export const client = ky.create({
  prefixUrl: MAIN_BASE_URL,
  credentials: "include"
})