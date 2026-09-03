import raw from "@/lib/data/1.json";

export interface Municipality {
  id: number;
  district_id: number;
  category_id: number;
  name: string;
  area_sq_km: string;
  website: string;
  wards: string[];
}

export interface District {
  id: number;
  province_id: number;
  name: string;
  area_sq_km: string;
  website: string;
  headquarter: string;
  municipalities: Municipality[];
}

export interface Province {
  id: number;
  name: string;
  districts: District[];
}

function normalize(json: unknown): Province[] {
  const data = json && typeof json === "object" && "default" in (json as any) ? (json as any).default : json;
  return Array.isArray(data) ? (data as Province[]) : [];
}

function toArray<T>(value: unknown): T[] {
  if (Array.isArray(value)) return value as T[];
  if (value && typeof value === "object") return Object.values(value as Record<string, T>);
  return [];
}

export const provinces: Province[] = normalize(raw);

export function districtsForProvince(provinceName?: string): District[] {
  if (!provinceName) return [];
  const province = provinces.find((p) => p.name === provinceName);
  return province ? toArray<District>(province.districts) : [];
}

export function municipalitiesForDistrict(provinceName?: string, districtName?: string): Municipality[] {
  const district = districtsForProvince(provinceName).find((d) => d.name === districtName);
  return district ? toArray<Municipality>(district.municipalities) : [];
}

export function wardsForMunicipality(provinceName?: string, districtName?: string, municipalityName?: string): string[] {
  const municipality = municipalitiesForDistrict(provinceName, districtName).find(
    (m) => m.name === municipalityName
  );
  return municipality && Array.isArray(municipality.wards) ? municipality.wards : [];
}

export function findProvinceByDistrict(districtName?: string): Province | undefined {
  if (!districtName) return undefined;
  return provinces.find(
    (p) => toArray<District>(p.districts).some((d) => d.name === districtName)
  );
}
