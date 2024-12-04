export const blobUrlToFile = (blobUrl: string): Promise<File> => {
  return new Promise((resolve) => {
    fetch(blobUrl).then((res) => {
      res.blob().then((blob) => {
        const file = new File([blob], "png", { type: blob.type });
        resolve(file);
      });
    });
  });
};
