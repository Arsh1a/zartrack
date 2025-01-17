export type RawThidPartyAPIResponse = {
  gold: {
    name: string;
    price: number;
  }[];
  currency: {
    name: string;

    price: number;
  }[];
  cryptocurrency: {
    name: string;
    price: number;
  }[];
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
