import { SERVER_API } from "#shared/api/minecraft-api.ts"

type CommandType =
  | "lp" // luckperms
  | "sudo" // cmi sudo
  | "cmi" // cmi
  | "p" // player points

type CallServerCommand = {
  parent: CommandType,
  value: string
}

export const callServerCommand = async ({
  parent, value
}: CallServerCommand) => {
  try {
    await SERVER_API.post("command", { searchParams: { "command": `${parent} ${value}`, }, })
  } catch (e) {
    console.error(e)
  }
}