// export function determinePlayerDetailType(
//   value: string,
// ): "uuid" | "nickname" | "unknown" {
//   const UUID_REGEX =
//     /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
//   const NICKNAME_REGEX = /^[a-zA-Z0-9_]{3,16}$/;

//   if (UUID_REGEX.test(value)) {
//     return "uuid";
//   } else if (NICKNAME_REGEX.test(value)) {
//     return "nickname";
//   } else {
//     return "unknown";
//   }
// }