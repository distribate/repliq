import { SERVER_API } from '#shared/api.ts';

type CommandType = "lp" | "sudo" | "cmi"

type CallServerCommand = {
  parent: CommandType,
  value: string
}

export async function callServerCommand({
  parent, value
}: CallServerCommand) {
  return SERVER_API.post("command", {
    searchParams: { "command": `${parent} ${value}`, },
  })
}