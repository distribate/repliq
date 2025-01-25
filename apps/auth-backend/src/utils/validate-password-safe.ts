// @ts-ignore
import UnsafePasswords from "@repo/assets/configs/unsafe_passwords.txt"

const unsafePasswordsSet: Set<string> = new Set(
  UnsafePasswords.split("\n")
    .map((l: string) => l.trim())
    .filter((l: string) => l && l !== "****")
);

export function validatePasswordSafe(password: string): boolean {
  return !unsafePasswordsSet.has(password.trim());
}