import { NextResponse } from "next/server";

export async function GET() {
  const results: Record<string, string> = {};

  // Test 1: getTickerItems (fs/promises)
  try {
    const { getTickerItems } = await import("@/lib/ticker-config");
    const items = await getTickerItems();
    results["ticker"] = `OK (${items.length} items)`;
  } catch (e: unknown) {
    results["ticker"] = `FAIL: ${e instanceof Error ? e.message : String(e)}`;
  }

  // Test 2: getImageUrl (netlify/blobs)
  try {
    const { getImageUrl } = await import("@/lib/images-config");
    const url = await getImageUrl("hero");
    results["imageUrl"] = `OK: ${url}`;
  } catch (e: unknown) {
    results["imageUrl"] = `FAIL: ${e instanceof Error ? e.message : String(e)}`;
  }

  // Test 3: getTranslations
  try {
    const { getTranslations } = await import("next-intl/server");
    const t = await getTranslations({ locale: "de", namespace: "FAQ" });
    results["translations"] = `OK: q1_1 = ${t("q1_1")}`;
  } catch (e: unknown) {
    results["translations"] = `FAIL: ${e instanceof Error ? e.message : String(e)}`;
  }

  // Test 4: faqSchema
  try {
    const { faqSchema } = await import("@/lib/schema");
    const schema = faqSchema([{ name: "Test?", text: "Answer." }]);
    results["faqSchema"] = `OK: ${JSON.stringify(schema).length} chars`;
  } catch (e: unknown) {
    results["faqSchema"] = `FAIL: ${e instanceof Error ? e.message : String(e)}`;
  }

  // Test 5: next/image import (just check the module loads)
  try {
    await import("next/image");
    results["nextImage"] = "OK: module loads";
  } catch (e: unknown) {
    results["nextImage"] = `FAIL: ${e instanceof Error ? e.message : String(e)}`;
  }

  // Test 6: Check environment
  results["NODE_VERSION"] = process.version;
  results["NEXT_PUBLIC_SITE_URL"] = process.env.NEXT_PUBLIC_SITE_URL || "(not set)";
  results["cwd"] = process.cwd();

  return NextResponse.json(results, { status: 200 });
}
