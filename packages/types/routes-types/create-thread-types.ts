export type CreateThreadResponse = {
  data: {
    id: string
  }
  status: "Created" | "Error"
} | {
  error: string
}