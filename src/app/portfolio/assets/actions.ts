"use server";

import { db } from "@/db";
import { asset } from "@/db/schema";
import { readSession } from "@/lib/session";
import { and, eq } from "drizzle-orm";
import {
  AddMultipleAssets,
  addMultipleAssetsSchema,
  EditAsset,
  editAssetSchema,
} from "./schemas";
import { revalidatePath } from "next/cache";

export async function addAssets(data: AddMultipleAssets) {
  const session = await readSession();

  if (!session) {
    return {
      errors: {
        root: ["You are not authorized"],
      },
    };
  }

  const result = addMultipleAssetsSchema.safeParse(data);

  if (!result.success) {
    return {
      errors: result.error.flatten().fieldErrors,
    };
  }

  await db.insert(asset).values(
    result.data.assets.map((item) => ({
      code: item.code,
      buyPrice: item.buyPrice.toString(),
      amount: item.amount.toString(),
      userId: session.userId,
    }))
  );

  revalidatePath("/portfolio");

  return {
    message: "Asset added successfully",
  };
}

export async function editAsset(data: EditAsset) {
  const session = await readSession();

  if (!session) {
    return {
      errors: {
        root: ["You are not authorized"],
      },
    };
  }

  const result = editAssetSchema.safeParse(data);

  if (!result.success) {
    return {
      errors: result.error.flatten().fieldErrors,
    };
  }

  await db
    .update(asset)
    .set({
      code: result.data.code,
      buyPrice: result.data.buyPrice.toString(),
      amount: result.data.amount.toString(),
      boughtAt: result.data.boughtAt,
    })
    .where(and(eq(asset.id, result.data.id), eq(asset.userId, session.userId)));

  revalidatePath("/portfolio");
  return {
    message: "Asset updated successfully",
  };
}

export async function deleteAsset(id: string) {
  const session = await readSession();

  if (!session) {
    return {
      errors: {
        general: ["You are not authorized"],
      },
    };
  }

  if (!id) {
    return {
      errors: {
        general: ["Asset not found"],
      },
    };
  }

  await db
    .delete(asset)
    .where(and(eq(asset.id, id), eq(asset.userId, session.userId)));

  revalidatePath("/portfolio");
  return {
    message: "Asset deleted successfully",
  };
}
