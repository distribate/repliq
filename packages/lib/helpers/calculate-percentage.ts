type CalculatePercentage = {
  firstValue: number,
  secondValue: number
}

export function calculatePercentage({
  firstValue, secondValue
}: CalculatePercentage): number {
  const total = firstValue + secondValue;
  
  if (total === 0) return 0;
  
  return (firstValue / total) * 100;
}