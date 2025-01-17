export function calculateTotalPnL(
  data: {
    profitAndLossPercentage?: number | null | undefined;
    totalMarketPrice?: number | null | undefined;
  }[]
): number {
  const totalMarketPrice = data.reduce(
    (sum, d) => sum + (d.totalMarketPrice ?? 0),
    0
  );

  const weightedPnL = data.reduce(
    (sum, d) =>
      sum +
      ((d.profitAndLossPercentage ?? 1) / 100) * (d.totalMarketPrice ?? 0),
    0
  );

  return (weightedPnL / totalMarketPrice) * 100;
}

export function coinsIntrinsicValues(gold18: number) {
  const oneGramGold900Purity = gold18 ? (gold18 * 900) / 750 : NaN;

  return {
    emami: 8.133 * oneGramGold900Purity + 50000,
    azadi: 8.133 * oneGramGold900Purity + 50000,
    azadi_half: 4.066 * oneGramGold900Purity + 50000,
    azadi_quarter: 2.033 * oneGramGold900Purity + 50000,
    gerami: 1 * oneGramGold900Purity + 50000,
  };
}

export function coinsBubbles(
  gold18: number,
  currentPrices: Record<string, number>
) {
  const intrinsicValues = coinsIntrinsicValues(gold18);

  return (
    Object.keys(currentPrices) as (keyof typeof intrinsicValues)[]
  ).reduce((result, coin) => {
    const intrinsicValue = intrinsicValues[coin];
    const currentValue = currentPrices[coin];
    result[coin] = {
      value: currentValue - intrinsicValue,
      percentage: (currentValue / intrinsicValue - 1) * 100,
    };
    return result;
  }, {} as Record<string, { value: number; percentage: number }>);
}
