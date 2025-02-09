import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import Papa from "papaparse";
import { saveAs } from "file-saver";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: string) {
  const d = new Date(date);
  const formattedDate = new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(d);

  return formattedDate;
}

function stringToHash(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return hash;
}

export function randomHslFromString(str: string): string {
  const hash = stringToHash(str);
  const hue = Math.abs(hash) % 360;
  return `hsla(${hue}, 60%, 45%, 1)`;
}

export function calculateAverage<T>(array: T[], key: keyof T): number {
  return (
    array.reduce((sum, item) => sum + (item[key] as number), 0) / array.length
  );
}

export function exportToCSV<T extends object>(
  data: T[],
  filename: string = "data.csv"
) {
  if (!data.length) return;

  const csv = Papa.unparse(data);
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  saveAs(blob, filename);
}
