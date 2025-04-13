export type RawThidPartyAPIResponse = {
  gold: Array<{
    date: string;
    time: string;
    time_unix: number;
    symbol: string;
    name_en: string;
    name: string;
    price: number;
    change_value: number;
    change_percent: number;
    unit: string;
  }>;
  currency: Array<{
    date: string;
    time: string;
    time_unix: number;
    symbol: string;
    name_en: string;
    name: string;
    price: number;
    change_value: number;
    change_percent: number;
    unit: string;
  }>;
  cryptocurrency: Array<{
    date: string;
    time: string;
    time_unix: number;
    symbol: string;
    name_en: string;
    name: string;
    price: string;
    change_percent: number;
    market_cap: number;
    unit: string;
    description: string;
  }>;
};

export type Single = {
  name: string;
  code: string;
  value: number;
};

export type LatestPrices = {
  gold: Single[];
  currency: Single[];
  cryptocurrency: Single[];
  updatedAt: string;
};

export type Bubble = {
  value: number;
  percentage: number;
};
