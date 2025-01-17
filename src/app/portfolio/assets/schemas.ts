import { z } from "zod";

export const addAssetSchema = z.object({
  code: z.string().min(1, { message: "Required" }).trim(),
  amount: z.string().min(1, { message: "Required" }),
  buyPrice: z.string().min(1, { message: "Required" }),
  boughtAt: z.date().optional(),
});
export type AddAsset = z.infer<typeof addAssetSchema>;

export const addMultipleAssetsSchema = z.object({
  assets: z.array(addAssetSchema),
});
export type AddMultipleAssets = z.infer<typeof addMultipleAssetsSchema>;

export const editAssetSchema = z.object({
  id: z.string(),
  code: z.string().min(1, { message: "Required" }).trim(),
  amount: z.string().min(1, { message: "Required" }),
  buyPrice: z.string().min(1, { message: "Required" }),
  boughtAt: z.date().optional().nullable(),
});
export type EditAsset = z.infer<typeof editAssetSchema>;

export const calculatedAssetSchema = z.object({
  amount: z.string(),
  buyPrice: z.string(),
  totalCost: z.number(),
  marketPrice: z.number().optional(),
  totalMarketPrice: z.number().optional(),
  profitAndLoss: z.number().nullable(),
  profitAndLossPercentage: z.number().nullable(),
  id: z.string(),
  code: z.string(),
  boughtAt: z.date().nullable(),
  createdAt: z.date().nullable(),
  updatedAt: z.date().nullable(),
  userId: z.string(),
});
export type CalculatedAsset = z.infer<typeof calculatedAssetSchema>;
