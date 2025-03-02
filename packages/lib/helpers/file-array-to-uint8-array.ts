export const fileArrayToUint8Array = async (files: File[] | null) => {
  if (!files) return null;

  const uint8ArrayFiles = await Promise.all(
    files.map(async (file) => {
      const buffer = await file.arrayBuffer();
      return new Uint8Array(buffer);
    })
  );

  return uint8ArrayFiles;
};