import { createClient } from "@/lib/supabase/client";
import { normaliseRows, type SourceRow } from "@/lib/parsing/normalise";
import type { DetectedColumn } from "@/lib/parsing/schema";

const chunks = <T,>(items: T[], size = 400) => Array.from({ length: Math.ceil(items.length / size) }, (_, index) => items.slice(index * size, (index + 1) * size));

export async function normaliseDataset(datasetId: string, rows: SourceRow[], columns: DetectedColumn[]) {
  const db = createClient();
  const parsed = normaliseRows(rows, columns);
  const ingredientNames = [...new Set(parsed.products.flatMap((product) => product.ingredientNames))];
  const { data: ingredients, error: ingredientError } = await db.from("ingredients").insert(ingredientNames.map((name) => ({ dataset_id: datasetId, name, source: "heuristic", confidence: .9, review_status: "unreviewed" }))).select("id,name");
  if (ingredientError) throw ingredientError;
  const ingredientIds = new Map((ingredients ?? []).map((item) => [item.name, item.id]));
  const productRows = parsed.products.map((product) => ({
    dataset_id: datasetId, name: product.name, ingredient_id: ingredientIds.get(product.ingredientNames[0]),
    corporation: product.corporation, manufacturer: product.manufacturer, channel: product.channel,
    sub_channel: product.sub_channel, atc1: product.atc1, atc2: product.atc2, atc3: product.atc3,
    atc4: product.atc4, nfc1: product.nfc1, nfc2: product.nfc2, nfc3: product.nfc3, source_key: product.key,
  }));
  const productIds = new Map<string, string>();
  for (const group of chunks(productRows)) {
    const cleaned = group.map(({ source_key, ...row }) => row);
    const { data, error } = await db.from("products").insert(cleaned).select("id,name,corporation,channel,sub_channel");
    if (error) throw error;
    (data ?? []).forEach((item, index) => productIds.set(group[index].source_key, item.id));
  }
  for (const group of chunks(parsed.observations)) {
    const { error } = await db.from("sales_observations").insert(group.map((observation) => ({
      dataset_id: datasetId, product_id: productIds.get(observation.productKey), period: observation.period,
      value: observation.value, units: observation.units, cu: observation.cu, du: observation.du,
    })));
    if (error) throw error;
  }
  const atcGroups = new Map<string, Set<string>>();
  parsed.products.forEach((product) => {
    const group = product.atc1 || "Core market";
    if (!atcGroups.has(group)) atcGroups.set(group, new Set());
    product.ingredientNames.forEach((name) => atcGroups.get(group)!.add(name));
  });
  const suggested = [...atcGroups.entries()].slice(0, 5);
  const { data: categories, error: categoryError } = await db.from("categories").insert(suggested.map(([name]) => ({ dataset_id: datasetId, name, description: `Ingredient group supported by ${name === "Core market" ? "the uploaded market" : `ATC ${name}`}.`, source: "heuristic", confidence: .82, review_status: "unreviewed" }))).select("id,name");
  if (categoryError) throw categoryError;
  const categoryIds = new Map((categories ?? []).map((item) => [item.name, item.id]));
  const mappings = suggested.flatMap(([name, members]) => [...members].map((ingredient) => ({ category_id: categoryIds.get(name), ingredient_id: ingredientIds.get(ingredient), review_status: "unreviewed" })));
  if (mappings.length) { const { error } = await db.from("category_mappings").insert(mappings); if (error) throw error; }
  const { error: datasetError } = await db.from("datasets").update({ status: "normalised" }).eq("id", datasetId);
  if (datasetError) throw datasetError;
  return { productCount: productRows.length, ingredientCount: ingredientNames.length, observationCount: parsed.observations.length };
}

export type SetupProduct = { id: string; name: string; corporation: string | null; is_portfolio: boolean; ingredient_id: string | null };
export type SetupIngredient = { id: string; name: string; categoryId: string | null };
export type SetupCategory = { id: string; name: string; description: string | null };

export async function loadSetup(datasetId: string) {
  const db = createClient();
  const [products, ingredients, categories, mappings] = await Promise.all([
    db.from("products").select("id,name,corporation,is_portfolio,ingredient_id").eq("dataset_id", datasetId).order("name"),
    db.from("ingredients").select("id,name").eq("dataset_id", datasetId).order("name"),
    db.from("categories").select("id,name,description").eq("dataset_id", datasetId).order("name"),
    db.from("category_mappings").select("category_id,ingredient_id,ingredients!inner(dataset_id)").eq("ingredients.dataset_id", datasetId),
  ]);
  for (const result of [products, ingredients, categories, mappings]) if (result.error) throw result.error;
  const mapped = new Map((mappings.data ?? []).map((item) => [item.ingredient_id, item.category_id]));
  return {
    products: products.data as SetupProduct[], categories: categories.data as SetupCategory[],
    ingredients: (ingredients.data ?? []).map((item) => ({ ...item, categoryId: mapped.get(item.id) ?? null })) as SetupIngredient[],
  };
}

export async function savePortfolio(datasetId: string, corporation: string) {
  const db = createClient();
  const { error: clearError } = await db.from("products").update({ is_portfolio: false }).eq("dataset_id", datasetId);
  if (clearError) throw clearError;
  const { error } = await db.from("products").update({ is_portfolio: true }).eq("dataset_id", datasetId).eq("corporation", corporation);
  if (error) throw error;
}

export async function saveCategories(datasetId: string, categories: SetupCategory[], ingredients: SetupIngredient[]) {
  const db = createClient();
  for (const category of categories) {
    const { error } = await db.from("categories").update({ name: category.name, review_status: "reviewed", source: "user", confidence: 1 }).eq("id", category.id).eq("dataset_id", datasetId);
    if (error) throw error;
  }
  const ingredientIds = ingredients.map((item) => item.id);
  if (ingredientIds.length) {
    const { error } = await db.from("category_mappings").delete().in("ingredient_id", ingredientIds);
    if (error) throw error;
    const { error: insertError } = await db.from("category_mappings").insert(ingredients.filter((item) => item.categoryId).map((item) => ({ category_id: item.categoryId, ingredient_id: item.id, review_status: "reviewed" })));
    if (insertError) throw insertError;
  }
}
