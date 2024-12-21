export type BonbastAPIResponse = {
  aed1: string;
  aed2: string;
  afn1: string;
  afn2: string;
  amd1: string;
  amd2: string;
  aud1: string;
  aud2: string;
  azadi1: string;
  azadi12: string;
  azadi1_2: string;
  azadi1_22: string;
  azadi1_4: string;
  azadi1_42: string;
  azadi1g: string;
  azadi1g2: string;
  azn1: string;
  azn2: string;
  bhd1: string;
  bhd2: string;
  bitcoin: string;
  bourse: string;
  cad1: string;
  cad2: string;
  chf1: string;
  chf2: string;
  cny1: string;
  cny2: string;
  created: string;
  day: number;
  dkk1: string;
  dkk2: string;
  emami1: string;
  emami12: string;
  eur1: string;
  eur2: string;
  gbp1: string;
  gbp2: string;
  gol18: string;
  hkd1: string;
  hkd2: string;
  hour: string;
  inr1: string;
  inr2: string;
  iqd1: string;
  iqd2: string;
  jpy1: string;
  jpy2: string;
  kwd1: string;
  kwd2: string;
  last_modified: string;
  minute: string;
  mithqal: string;
  month: number;
  myr1: string;
  myr2: string;
  nok1: string;
  nok2: string;
  omr1: string;
  omr2: string;
  ounce: string;
  qar1: string;
  qar2: string;
  rub1: string;
  rub2: string;
  sar1: string;
  sar2: string;
  second: string;
  sek1: string;
  sek2: string;
  sgd1: string;
  sgd2: string;
  thb1: string;
  thb2: string;
  try1: string;
  try2: string;
  usd1: string;
  usd2: string;
  weekday: string;
  year: number;
};

export type Change = "increased" | "decreased" | "nochange";

export type Pair = {
  name: string;
  code: string;
  sell: {
    value: string;
    change: Change;
  };
  buy: {
    value: string;
    change: Change;
  };
};

export type Single = {
  name: string;
  code: string;
  value: string;
  change: Change;
};

export type Gold = {
  name: string;
  value: string;
  change: Change;
};

export type LatestPrices = {
  currencies: Pair[];
  coins: Pair[];
  cryptos: Single[];
  golds: Single[];
  bourse: string;
  created: string;
  day: number;
  hour: string;
  last_modified: string;
  minute: string;
  month: number;
  second: string;
  weekday: string;
  year: number;
};
