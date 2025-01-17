import { ASSETS_MAP } from "@/constants";
import { RawThidPartyAPIResponse, Single } from "@/types";

export function transformPrices(data: RawThidPartyAPIResponse) {
  const transformSingle = (item: { name: string; price: number }): Single => {
    const asset = ASSETS_MAP[item.name];
    const code = asset ? asset.code : "";
    const name = asset ? asset.name : "";

    return {
      name,
      code,
      value: item.price,
    };
  };

  return {
    gold: data.gold.map((item) => transformSingle(item)),
    currency: data.currency.map((item) => transformSingle(item)),
    cryptocurrency: [],
  };
}

export function sortByCodes<T extends { code: string }>(
  data: T[],
  sortOrder: string[]
): T[] {
  const sortOrderMap = new Map<string, number>(
    sortOrder.map((name, index) => [name.toLowerCase(), index])
  );

  return data.sort((a, b) => {
    const aIndex = sortOrderMap.get(a.code.toLowerCase()) ?? Infinity;
    const bIndex = sortOrderMap.get(b.code.toLowerCase()) ?? Infinity;
    return aIndex - bIndex;
  });
}

export function findAssetNameByCode(code: string) {
  for (const key in ASSETS_MAP) {
    if (ASSETS_MAP[key].code === code) {
      return ASSETS_MAP[key].name;
    }
  }
  return undefined;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function calculateGroupedSum<T extends Record<string, any>>(
  items: T[],
  combineKey: keyof T,
  sumKeys: (keyof T)[]
): Partial<T>[] {
  const combinedMap: Record<string, Partial<T>> = {};

  items.forEach((item) => {
    const key = item[combineKey] as string;

    if (!combinedMap[key]) {
      combinedMap[key] = { [combineKey]: key } as Partial<T>;
      sumKeys.forEach((sumKey) => {
        combinedMap[key][sumKey] = 0 as unknown as T[keyof T];
      });
    }

    sumKeys.forEach((sumKey) => {
      const value = parseFloat(item[sumKey] as string) || 0;
      combinedMap[key][sumKey] = ((combinedMap[key][sumKey] as number) +
        value) as unknown as T[keyof T];
    });
  });

  return Object.values(combinedMap);
}

export function calculateGroupedAverage<T>(
  array: T[],
  groupKey: keyof T,
  valueKeys: (keyof T)[]
): Array<{ [K in keyof T]?: T[K] } & { [key: string]: number }> {
  // Create a grouped result with sum and count for each valueKey
  const groupedResult = array.reduce((result, item) => {
    const group = String(item[groupKey]); // Convert group key to string for indexing

    if (!result[group]) {
      result[group] = {
        group: item[groupKey],
        values: valueKeys.reduce((acc, key) => {
          acc[key as string] = { sum: 0, count: 0 };
          return acc;
        }, {} as Record<string, { sum: number; count: number }>),
      };
    }

    valueKeys.forEach((key) => {
      const value = item[key] as number;
      if (typeof value === "number") {
        result[group].values[key as string].sum += value;
        result[group].values[key as string].count += 1;
      }
    });

    return result;
  }, {} as Record<string, { group: T[keyof T]; values: Record<string, { sum: number; count: number }> }>);

  // Transform groupedResult to an array of objects
  return Object.values(groupedResult).map(({ group, values }) => {
    const averages: Record<string, number> = {};
    for (const key in values) {
      const { sum, count } = values[key];
      averages[key] = sum / count;
    }

    return { [groupKey]: group, ...averages } as { [K in keyof T]?: T[K] } & {
      [key: string]: number;
    };
  });
}
