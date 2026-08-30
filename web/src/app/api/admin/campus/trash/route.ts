import { NextResponse } from "next/server";
import {
  listTrashedFacilities,
  autoPurgeTrashedFacilities,
} from "@/repositories/facilities.repository";
import {
  listTrashedCampusMap,
  autoPurgeTrashedCampusMap,
} from "@/repositories/campus-map.repository";

export async function GET() {
  await Promise.all([
    autoPurgeTrashedFacilities(),
    autoPurgeTrashedCampusMap(),
  ]);

  const [facilities, campusMap] = await Promise.all([
    listTrashedFacilities({ pageSize: 200 }),
    listTrashedCampusMap({ pageSize: 200 }),
  ]);

  const items = [
    ...facilities.items.map((i) => ({ ...i, collection: "facilities" })),
    ...campusMap.items.map((i) => ({ ...i, collection: "campus_map" })),
  ].sort(
    (a, b) =>
      new Date(b.deletedAt ?? 0).getTime() -
      new Date(a.deletedAt ?? 0).getTime()
  );

  return NextResponse.json({ items, total: items.length });
}
