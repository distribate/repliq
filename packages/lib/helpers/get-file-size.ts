export function getFileSizeInMB(file: File): number {
  const sizeInBytes = file.size;
  
  return sizeInBytes / (1024 * 1024);
}