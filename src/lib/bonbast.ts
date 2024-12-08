import { LatestPrices } from "@/types";
import { normalizeData } from "./transform-data";

const BASE_URL = "https://bonbast.com";

const BONBAST_HEADERS = {
  authority: "bonbast.com",
  accept: "application/json, text/javascript, */*; q=0.01",
  "accept-language": "en-US,en;q=0.9,fa;q=0.8",
  "cache-control": "no-cache",
  "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
  cookie: "true; st_bb=0",
  origin: "https://bonbast.com",
  priority: "u=1, i",
  referer: "https://bonbast.com/",
  "sec-ch-au":
    '"Chromium";v="130", "Google Chrome";v="130", "Not?A_Brand";v="99"',
  "sec-ch-ua-mobile": "?0",
  "sec-ch-ua-platform": "Windows",
  "sec-fetch-dest": "empty",
  "sec-fetch-mode": "cors",
  "sec-fetch-site": "same-origin",
  "user-agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36",
  "x-requested-with": "XMLHttpRequest",
};

async function getToken(): Promise<string> {
  const response = await fetch(BASE_URL, {
    method: "GET",
    headers: BONBAST_HEADERS,
    credentials: "include",
  });

  const data = await response.text();
  const tokenMatch = data.match(/param\s*[=:]\s*"(.+?)"/);

  return tokenMatch?.[1] ?? "";
}

export async function fetchLatest(): Promise<LatestPrices | null> {
  try {
    const token = await getToken();

    if (!token) {
      console.error("Token not available");
      return null;
    }

    const urlSearchParams = new URLSearchParams();
    urlSearchParams.append("param", token);

    const response = await fetch(`${BASE_URL}/json`, {
      method: "POST",
      headers: BONBAST_HEADERS,
      body: urlSearchParams,
    });

    if (!response.ok) {
      console.error(`HTTP Error: ${response.status}`);
      return null;
    }

    const data = await response.json();
    const normalizedData = normalizeData(data);
    return normalizedData;
  } catch (error) {
    console.error("Error fetching latest prices:", error);
    return null;
  }
}
