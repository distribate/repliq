import { extname } from "node:path";
import { getSupabaseClient } from "../supabase";

export const textSets: Record<string, Set<string>> = {};
export const fileBlobs: Record<string, File> = {};

type FileProcessor = (filename: string, content: string | Uint8Array) => void;
type FileEntry = { key: string, value: FileProcessor };

export const INTERNAl_FILES: FileEntry[] = [
  {
    key: "unsafe_passwords.txt",
    value: (filename, content) => {
      if (typeof content === "string") {
        textSets[filename] = new Set(
          content
            .split("\n")
            .map(l => l.trim())
            .filter(l => l && l !== "****")
        );
      } else {
        // @ts-expect-error
        fileBlobs[filename] = new File([content], filename);
      }
    }
  }
]

export async function loadInternalFiles(entries: FileEntry[]) {
  const supabase = getSupabaseClient();
  
  for (const { key: filename, value: callback } of entries) {
    const { data: blob, error } = await supabase.storage
      .from("internal")
      .download(filename);

    if (error || !blob) {
      console.error(filename, error?.message ?? "No data");
      continue;
    }

    const ext = extname(filename).toLowerCase();
    let content: string | Uint8Array;

    if ([".txt", ".json", ".csv"].includes(ext)) {
      content = await Bun.readableStreamToText(blob.stream());
    } else {
      const buffer = await Bun.readableStreamToArrayBuffer(blob.stream());
      content = new Uint8Array(buffer);
    }

    callback(filename, content);

    console.log(
      `Loaded ${filename} (${ext || "no extension"}) — type: ${typeof content}`
    );
  }
}