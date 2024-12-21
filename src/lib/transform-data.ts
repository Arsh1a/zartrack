import { ASSETS_MAP } from "@/constants";
import { BonbastAPIResponse, LatestPrices } from "@/types";

function renameDataProperties(obj: BonbastAPIResponse): Record<string, string> {
  const newObj: Record<string, string> = {};

  for (const key in obj) {
    let newKey = key;

    if (key === "azadi12") newKey = "azadi2";
    else if (key === "emami12") newKey = "emami2";
    else if (key === "azadi1_2") newKey = "azadi_half1";
    else if (key === "azadi1_22") newKey = "azadi_half2";
    else if (key === "azadi1_4") newKey = "azadi_quarter1";
    else if (key === "azadi1_42") newKey = "azadi_quarter2";
    else if (key === "azadi1g") newKey = "gerami1";
    else if (key === "azadi1g2") newKey = "gerami2";

    const value = obj[key as keyof BonbastAPIResponse];
    newObj[newKey] = typeof value === "number" ? value.toString() : value;
  }

  return newObj;
}

function groupData(obj: Record<string, string>): LatestPrices {
  const result: LatestPrices = {
    currencies: [],
    coins: [],
    cryptos: [],
    golds: [],
    bourse: "",
    created: "",
    day: 0,
    hour: "",
    last_modified: "",
    minute: "",
    month: 0,
    second: "",
    weekday: "",
    year: 0,
  };

  for (const key in obj) {
    // Handle currencies
    if (key.endsWith("1") && obj.hasOwnProperty(key.slice(0, -1) + "2")) {
      const baseKey = key.slice(0, -1);

      // Check if the item should be in `coins` instead of `currencies`
      if (
        baseKey.startsWith("azadi") ||
        baseKey.startsWith("emami") ||
        baseKey === "gerami"
      ) {
        result.coins.push({
          code: baseKey,
          name: ASSETS_MAP[baseKey]?.name || baseKey,
          sell: {
            value: obj[key],
            change: "nochange",
          },
          buy: {
            value: obj[baseKey + "2"],
            change: "nochange",
          },
        });
      } else {
        // Default behavior for other currencies
        result.currencies.push({
          code: baseKey,
          name: ASSETS_MAP[baseKey]?.name || baseKey,
          sell: {
            value: obj[key],
            change: "nochange",
          },
          buy: {
            value: obj[baseKey + "2"],
            change: "nochange",
          },
        });
      }
    } else if (!key.endsWith("2")) {
      // Handling Single type fields explicitly
      switch (key) {
        case "ounce":
        case "mithqal":
        case "gol18":
          result.golds.push({
            code: key,
            name: ASSETS_MAP[key]?.name || key,
            value: obj[key],
            change: "nochange",
          });
          break;
        // Direct assignment for other fields
        case "bourse":
        case "created":
        case "last_modified":
        case "hour":
        case "minute":
        case "second":
        case "weekday":
          result[key] = obj[key];
          break;
        case "day":
        case "month":
        case "year":
          result[key] = parseInt(obj[key], 10);
          break;
        default:
          break;
      }
    }
  }

  return result as LatestPrices;
}

export function normalizeData(data: BonbastAPIResponse): LatestPrices {
  return groupData(renameDataProperties(data));
}

export function sortByNames<T extends { code: string }>(
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
