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

export function coinsIntrinsicValues(IR_GOLD_18K: number) {
  const oneGramGold900Purity = IR_GOLD_18K ? (IR_GOLD_18K * 900) / 750 : NaN;

  return {
    IR_COIN_EMAMI: 8.133 * oneGramGold900Purity + 50000,
    IR_COIN_BAHAR: 8.133 * oneGramGold900Purity + 50000,
    IR_COIN_HALF: 4.066 * oneGramGold900Purity + 50000,
    IR_COIN_QUARTER: 2.033 * oneGramGold900Purity + 50000,
    IR_COIN_1G: 1 * oneGramGold900Purity + 50000,
  };
}

export function coinsBubbles(
  IR_GOLD_18K: number,
  currentPrices: Record<string, number>
) {
  const intrinsicValues = coinsIntrinsicValues(IR_GOLD_18K);

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
