type HexToRgbaProps = {
  hex: string
  alpha: number
}

export const hexToRgba = ({ hex, alpha }: HexToRgbaProps) => {
  const match = hex.match(/\w\w/g)!;
  const [r, g, b] = match.map((x) => parseInt(x, 16));
  
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};