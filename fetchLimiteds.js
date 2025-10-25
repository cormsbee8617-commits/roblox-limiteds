import fetch from "node-fetch";
import fs from "fs";

const BASE = "https://catalog.roblox.com/v1/search/items?category=Collectibles&limit=100";

async function fetchAll() {
  let cursor = null;
  const items = [];

  while (true) {
    const url = cursor ? `${BASE}&cursor=${cursor}` : BASE;
    const res = await fetch(url);
    const json = await res.json();

    for (const it of json.data || []) {
      const r = it.itemRestrictions || [];
      if (r.includes("Limited") || r.includes("LimitedUnique")) {
        items.push({
          id: it.id,
          name: it.name,
          price: it.price ?? null,
          creatorName: it.creatorName ?? "Unknown",
          restrictions: r,
        });
      }
    }
    if (!json.nextPageCursor) break;
    cursor = json.nextPageCursor;
  }

  fs.writeFileSync("limiteds.json", JSON.stringify(items, null, 2));
  console.log("✅ wrote limiteds.json with", items.length, "items");
}

fetchAll().catch(console.error);
