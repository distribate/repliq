import "server-only"

const TOKEN = process.env.SECRET_TOKEN;

if (!TOKEN) {
  throw new Error(`Token must be required`)
}

export const authorized = {
  headers: {
    "Authorization": `Bearer ${TOKEN}`
  }
}