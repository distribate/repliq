import { textSets } from "../../shared/constants/internal-files";

export function validatePasswordSafe(pwd: string): boolean {
  const unsafePasswords = textSets["unsafe_passwords.txt"];

  return !unsafePasswords.has(pwd.trim())
}
